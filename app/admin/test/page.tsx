import { createClient } from '@/lib/supabase/server'
import TestModePanel from '@/components/admin/TestModePanel'
import type { Shipment } from '@/types/database'

export const dynamic = 'force-dynamic'

async function getTestData() {
  const supabase = await createClient()
  const [{ data: shipments }, { data: settings }] = await Promise.all([
    supabase
      .from('shipments')
      .select('id, tracking_code, current_status, sender_name, recipient_name, created_at')
      .eq('is_test', true)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase.from('settings').select('key, value').in('key', ['test_notification_email']),
  ])

  const settingsMap: Record<string, string> = {}
  ;(settings ?? []).forEach((s: { key: string; value: string }) => { settingsMap[s.key] = s.value })

  return {
    testShipments: (shipments as Shipment[]) ?? [],
    testEmail: settingsMap['test_notification_email'] ?? '',
  }
}

export default async function TestModePage() {
  const { testShipments, testEmail } = await getTestData()
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-white">Test Mode</h1>
          <span className="badge bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Sandbox</span>
        </div>
        <p className="text-[#6a7a8a] text-sm">
          Create and simulate test shipments without affecting live data. All test emails have a [TEST] prefix.
        </p>
      </div>
      <TestModePanel testShipments={testShipments} testEmail={testEmail} />
    </div>
  )
}
