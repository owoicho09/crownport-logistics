import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateTrackingCode } from '@/lib/tracking-code'
import { sendNotification, sendAdminAlert } from '@/lib/email'
import { writeAuditLog } from '@/lib/audit'
import { withRequestContext } from '@/lib/logger'
import { z } from 'zod'
import type { ServiceType } from '@/types/database'

const shipSchema = z.object({
  sender_name: z.string().min(2),
  sender_email: z.string().email(),
  sender_phone: z.string().min(6),
  sender_address: z.string().min(5),
  sender_city: z.string().min(2),
  sender_country: z.string().min(2),
  sender_postal_code: z.string().optional(),
  recipient_name: z.string().min(2),
  recipient_email: z.string().email().optional().or(z.literal('')),
  recipient_phone: z.string().min(6),
  recipient_address: z.string().min(5),
  recipient_city: z.string().min(2),
  recipient_country: z.string().min(2),
  recipient_postal_code: z.string().optional(),
  service_type: z.enum(['EXPRESS', 'STANDARD', 'FREIGHT', 'INTERNATIONAL', 'ECOMMERCE', 'SAMEDAY'] as const),
  weight_kg: z.number().positive().optional(),
  length_cm: z.number().positive().optional(),
  width_cm: z.number().positive().optional(),
  height_cm: z.number().positive().optional(),
  declared_value: z.number().min(0).optional(),
  contents_description: z.string().min(3),
})

export async function POST(request: NextRequest) {
  const log = withRequestContext('/api/ship', 'POST')
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown'

  try {
    const body = await request.json()
    const parsed = shipSchema.safeParse(body)

    if (!parsed.success) {
      log.warn('Invalid ship request', { errors: parsed.error.errors })
      return NextResponse.json({ error: 'Invalid request data', details: parsed.error.errors }, { status: 400 })
    }

    const data = parsed.data
    const trackingCode = await generateTrackingCode(data.service_type as ServiceType, data.recipient_country)

    log.info('Creating new shipment', { trackingCode, service: data.service_type })

    const supabase = createAdminClient()

    const { data: shipment, error } = await supabase
      .from('shipments')
      .insert({
        tracking_code: trackingCode,
        current_status: 'PENDING_REVIEW',
        ...data,
        is_test: false,
      })
      .select('*')
      .single()

    if (error || !shipment) {
      log.error('Failed to create shipment', { error: error?.message })
      return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 })
    }

    log.info('Shipment created', { shipmentId: shipment.id, trackingCode })

    // Create LABEL_CREATED event
    await supabase.from('tracking_events').insert({
      shipment_id: shipment.id,
      event_type: 'LABEL_CREATED',
      description: 'Shipment received and pending review by Crownport operations.',
    })

    // Audit log
    await writeAuditLog({
      action: 'CREATE',
      entityType: 'shipment',
      entityId: shipment.id,
      afterData: { tracking_code: trackingCode, sender: data.sender_name, recipient: data.recipient_name },
      ipAddress: ip,
    })

    // Send confirmation email to sender
    sendNotification(shipment, 'SHIPMENT_CONFIRMED').catch((e) => {
      log.error('Confirmation email failed', { error: e.message, shipmentId: shipment.id })
    })

    // Admin alert
    sendAdminAlert(
      `New Shipment Request: ${trackingCode}`,
      `<p>A new shipment has been submitted.</p>
       <p><strong>Tracking:</strong> ${trackingCode}</p>
       <p><strong>From:</strong> ${data.sender_name} (${data.sender_country})</p>
       <p><strong>To:</strong> ${data.recipient_name} (${data.recipient_country})</p>
       <p><strong>Service:</strong> ${data.service_type}</p>
       <p>Review it in the <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/shipments">admin panel</a>.</p>`
    ).catch(() => {})

    return NextResponse.json({ success: true, trackingCode, shipmentId: shipment.id }, { status: 201 })
  } catch (err) {
    log.error('Ship route error', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
