import { createClient } from '@/lib/supabase/server'
import { formatDate, formatDateTime } from '@/lib/utils'
import PickupActions from '@/components/admin/PickupActions'
import type { PickupRequest } from '@/types/database'

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  CONFIRMED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  COMPLETED: 'bg-green-500/10 text-green-400 border-green-500/20',
  CANCELLED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

async function getPickups() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('pickup_requests')
    .select('*')
    .order('created_at', { ascending: false })
  return (data as PickupRequest[]) ?? []
}

export default async function PickupsPage() {
  const pickups = await getPickups()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Pickup Requests</h1>
        <p className="text-[#6a7a8a] text-sm mt-1">{pickups.length} total requests</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#243448] bg-[#1e2d3d]/50">
              <tr>
                {['Contact', 'Address', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pickups.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-[#4a5a6a]">No pickup requests.</td></tr>
              ) : pickups.map((p) => (
                <tr key={p.id} className="border-b border-[#1e2d3d]">
                  <td className="py-3 px-4">
                    <div className="text-[#c0d0e0] font-medium">{p.contact_name}</div>
                    {p.contact_phone && <div className="text-[#5a6a7a] text-xs">{p.contact_phone}</div>}
                  </td>
                  <td className="py-3 px-4 text-[#8899aa]">
                    {p.pickup_address}, {p.pickup_city}, {p.pickup_country}
                  </td>
                  <td className="py-3 px-4 text-[#8899aa]">
                    <div>{formatDate(p.preferred_date)}</div>
                    {p.preferred_time_from && (
                      <div className="text-xs text-[#5a6a7a]">
                        {p.preferred_time_from}{p.preferred_time_to ? ` – ${p.preferred_time_to}` : ''}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge border ${STATUS_COLORS[p.status] ?? ''}`}>{p.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <PickupActions pickup={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
