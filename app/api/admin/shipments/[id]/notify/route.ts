import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNotification } from '@/lib/email'
import { withRequestContext } from '@/lib/logger'
import type { NotificationType } from '@/types/database'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const log = withRequestContext(`/api/admin/shipments/${id}/notify`, 'POST')

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { notification_type } = await request.json() as { notification_type: NotificationType }

    const adminClient = createAdminClient()
    const { data: shipment } = await adminClient
      .from('shipments')
      .select('*')
      .eq('id', id)
      .single()

    if (!shipment) return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })

    const result = await sendNotification(shipment, notification_type, undefined, shipment.is_test)

    log.info('Manual notification sent', { shipmentId: id, type: notification_type, success: result.success })

    return NextResponse.json({ success: result.success, error: result.error })
  } catch (err) {
    log.error('Notify route error', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
