import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { withRequestContext } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const log = withRequestContext(`/api/track/${code}`, 'GET')

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('shipments')
      .select('*, tracking_events(*)')
      .eq('tracking_code', code.toUpperCase())
      .eq('is_test', false)
      .single()

    if (error || !data) {
      log.warn('Tracking code not found', { code })
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    log.info('Shipment tracking accessed', { code, status: data.current_status })
    return NextResponse.json({ shipment: data })
  } catch (err) {
    log.error('Track route error', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
