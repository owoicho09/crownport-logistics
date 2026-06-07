import { createClient } from '@/lib/supabase/server'
import StatusBadge from '@/components/public/StatusBadge'
import { formatDateTime } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'
import type { Shipment } from '@/types/database'

export const dynamic = 'force-dynamic'

async function getExceptions() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('shipments')
    .select('id, tracking_code, current_status, recipient_name, recipient_country, exception_message, updated_at, sender_email, recipient_email')
    .in('current_status', ['EXCEPTION', 'ON_HOLD', 'DELIVERY_ATTEMPTED'])
    .eq('is_test', false)
    .order('updated_at', { ascending: false })
  return (data as Shipment[]) ?? []
}

export default async function ExceptionsPage() {
  const exceptions = await getExceptions()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Exceptions Queue</h1>
        <p className="text-[#6a7a8a] text-sm mt-1">{exceptions.length} shipments requiring attention</p>
      </div>

      {exceptions.length === 0 ? (
        <div className="card text-center py-16">
          <AlertTriangle size={40} className="text-green-400 mx-auto mb-3" />
          <p className="text-white font-semibold">All Clear!</p>
          <p className="text-[#5a6a7a] text-sm mt-1">No shipments currently in exception state.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exceptions.map((s) => (
            <a key={s.id} href={`/admin/shipments/${s.id}`} className="card block hover:border-[#c9a84c30] transition-colors">
              <div className="flex flex-wrap items-start gap-4 justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-[#c9a84c] font-semibold text-sm">{s.tracking_code}</span>
                    <StatusBadge status={s.current_status} size="sm" />
                  </div>
                  <p className="text-[#8899aa] text-sm">{s.recipient_name} · {s.recipient_country}</p>
                  {s.exception_message && (
                    <p className="text-red-400 text-xs mt-1.5 bg-red-500/10 border border-red-500/20 rounded px-2 py-1 inline-block">
                      {s.exception_message}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[#5a6a7a] text-xs">{formatDateTime(s.updated_at)}</p>
                  <p className="text-[#c9a84c] text-xs mt-1">View & Resolve →</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
