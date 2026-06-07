import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNotification } from '@/lib/email'
import { writeAuditLog } from '@/lib/audit'
import { withRequestContext } from '@/lib/logger'
import type { EventType, ShipmentStatus, NotificationType } from '@/types/database'

const EVENT_TO_STATUS: Partial<Record<EventType, ShipmentStatus>> = {
  LABEL_CREATED: 'LABEL_CREATED',
  PICKED_UP: 'PICKED_UP',
  ARRIVED_AT_HUB: 'ARRIVED_AT_HUB',
  IN_TRANSIT: 'IN_TRANSIT',
  CUSTOMS_CLEARANCE: 'CUSTOMS_CLEARANCE',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERY_ATTEMPTED: 'DELIVERY_ATTEMPTED',
  DELIVERED: 'DELIVERED',
  RETURNED_TO_SENDER: 'RETURNED_TO_SENDER',
  EXCEPTION: 'EXCEPTION',
  ON_HOLD: 'ON_HOLD',
}

const STATUS_TO_NOTIFICATION: Partial<Record<ShipmentStatus, NotificationType>> = {
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  EXCEPTION: 'EXCEPTION',
  RETURNED_TO_SENDER: 'RETURN_TO_SENDER',
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const log = withRequestContext(`/api/admin/shipments/${id}/events`, 'POST')

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const adminClient = createAdminClient()

    const { data: event, error: eventError } = await adminClient
      .from('tracking_events')
      .insert({
        shipment_id: id,
        event_type: body.event_type as EventType,
        event_time: body.event_time ? new Date(body.event_time).toISOString() : new Date().toISOString(),
        location_text: body.location_text || null,
        description: body.description || null,
        created_by_admin_id: user.id,
      })
      .select('*')
      .single()

    if (eventError || !event) {
      log.error('Failed to create tracking event', { error: eventError?.message })
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
    }

    // Update shipment status based on event type
    const newStatus = EVENT_TO_STATUS[body.event_type as EventType]
    if (newStatus) {
      const updateData: Record<string, unknown> = { current_status: newStatus }
      if (newStatus === 'DELIVERED') {
        updateData.actual_delivery = new Date().toISOString()
      }

      const { data: shipment } = await adminClient
        .from('shipments')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single()

      // Auto-send notification
      if (shipment?.notifications_enabled) {
        const notifType = STATUS_TO_NOTIFICATION[newStatus]
        if (notifType) {
          sendNotification(shipment, notifType, undefined, shipment.is_test).catch((e) => {
            log.error('Event notification failed', { error: e.message, eventType: body.event_type })
          })
        }
      }
    }

    log.info('Tracking event added', { shipmentId: id, eventType: body.event_type })

    await writeAuditLog({
      actorId: user.id,
      action: 'ADD_EVENT',
      entityType: 'tracking_event',
      entityId: event.id,
      afterData: { shipment_id: id, event_type: body.event_type },
    })

    return NextResponse.json({ success: true, event })
  } catch (err) {
    log.error('Event creation error', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
