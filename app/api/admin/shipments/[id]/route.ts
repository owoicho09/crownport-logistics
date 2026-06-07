import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { writeAuditLog } from '@/lib/audit'
import { sendNotification } from '@/lib/email'
import { withRequestContext } from '@/lib/logger'
import type { ShipmentStatus, NotificationType } from '@/types/database'

const STATUS_TO_NOTIFICATION: Partial<Record<ShipmentStatus, NotificationType>> = {
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  EXCEPTION: 'EXCEPTION',
  RETURNED_TO_SENDER: 'RETURN_TO_SENDER',
}

async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('id, email, full_name')
    .eq('id', user.id)
    .single()

  return profile
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const log = withRequestContext(`/api/admin/shipments/${id}`, 'PATCH')
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'

  const adminUser = await getAdminUser()
  if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const supabase = createAdminClient()

    // Get current shipment for audit
    const { data: before } = await supabase.from('shipments').select('*').eq('id', id).single()

    const { data: updated, error } = await supabase
      .from('shipments')
      .update(body)
      .eq('id', id)
      .select('*')
      .single()

    if (error || !updated) {
      log.error('Failed to update shipment', { id, error: error?.message })
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    log.info('Shipment updated', { id, changes: Object.keys(body) })

    // Auto-trigger notification on status change
    if (body.current_status && body.current_status !== before?.current_status && updated.notifications_enabled) {
      const notifType = STATUS_TO_NOTIFICATION[body.current_status as ShipmentStatus]
      if (notifType) {
        sendNotification(updated, notifType, undefined, updated.is_test).catch((e) => {
          log.error('Auto notification failed', { error: e.message, status: body.current_status })
        })
      }
    }

    await writeAuditLog({
      actorId: adminUser.id,
      actorEmail: adminUser.email,
      action: 'UPDATE',
      entityType: 'shipment',
      entityId: id,
      beforeData: before ?? undefined,
      afterData: updated,
      ipAddress: ip,
    })

    return NextResponse.json({ success: true, shipment: updated })
  } catch (err) {
    log.error('Shipment update error', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const log = withRequestContext(`/api/admin/shipments/${id}`, 'DELETE')

  const adminUser = await getAdminUser()
  if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const supabase = createAdminClient()
    await supabase.from('shipments').update({ current_status: 'CANCELLED' }).eq('id', id)

    await writeAuditLog({
      actorId: adminUser.id,
      actorEmail: adminUser.email,
      action: 'CANCEL',
      entityType: 'shipment',
      entityId: id,
    })

    log.info('Shipment cancelled', { id })
    return NextResponse.json({ success: true })
  } catch (err) {
    log.error('Shipment cancel error', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
