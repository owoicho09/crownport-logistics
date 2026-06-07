import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { withRequestContext } from '@/lib/logger'

export async function DELETE(request: NextRequest) {
  const log = withRequestContext('/api/admin/test/clear', 'DELETE')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const adminClient = createAdminClient()

    // Get all test shipment IDs first
    const { data: testShipments } = await adminClient
      .from('shipments')
      .select('id')
      .eq('is_test', true)

    if (testShipments && testShipments.length > 0) {
      const ids = testShipments.map((s) => s.id)

      // Delete related data
      await Promise.all([
        adminClient.from('tracking_events').delete().in('shipment_id', ids),
        adminClient.from('notifications_log').delete().in('shipment_id', ids),
      ])

      // Delete shipments
      await adminClient.from('shipments').delete().in('id', ids)
    }

    // Clear test pickup requests
    await adminClient.from('pickup_requests').delete().eq('is_test', true)

    log.info('Test data cleared', { user_id: user.id, count: testShipments?.length ?? 0 })

    return NextResponse.json({ success: true, deleted: testShipments?.length ?? 0 })
  } catch (err) {
    log.error('Failed to clear test data', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Failed to clear test data' }, { status: 500 })
  }
}
