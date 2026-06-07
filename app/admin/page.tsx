import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { Package, Truck, AlertTriangle, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import StatusBadge from '@/components/public/StatusBadge'
import type { Shipment } from '@/types/database'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  try {
    const supabase = await createClient()

    const [
      { count: totalActive },
      { count: deliveredToday },
      { count: exceptions },
      { count: pendingReview },
      { count: pickupsPending },
      { data: recentShipments },
    ] = await Promise.all([
      supabase.from('shipments').select('*', { count: 'exact', head: true })
        .eq('is_test', false)
        .not('current_status', 'in', '("DELIVERED","CANCELLED","RETURNED_TO_SENDER")'),
      supabase.from('shipments').select('*', { count: 'exact', head: true })
        .eq('is_test', false)
        .eq('current_status', 'DELIVERED')
        .gte('updated_at', new Date().toISOString().split('T')[0]),
      supabase.from('shipments').select('*', { count: 'exact', head: true })
        .eq('is_test', false)
        .in('current_status', ['EXCEPTION', 'ON_HOLD']),
      supabase.from('shipments').select('*', { count: 'exact', head: true })
        .eq('is_test', false)
        .eq('current_status', 'PENDING_REVIEW'),
      supabase.from('pickup_requests').select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING'),
      supabase.from('shipments')
        .select('id, tracking_code, current_status, sender_name, recipient_name, recipient_country, created_at')
        .eq('is_test', false)
        .order('created_at', { ascending: false })
        .limit(10),
    ])

    return {
      totalActive: totalActive ?? 0,
      deliveredToday: deliveredToday ?? 0,
      exceptions: exceptions ?? 0,
      pendingReview: pendingReview ?? 0,
      pickupsPending: pickupsPending ?? 0,
      recentShipments: (recentShipments as Shipment[]) ?? [],
    }
  } catch (err) {
    logger.error('Dashboard data fetch failed', { error: err instanceof Error ? err.message : 'unknown' })
    return {
      totalActive: 0, deliveredToday: 0, exceptions: 0,
      pendingReview: 0, pickupsPending: 0, recentShipments: [],
    }
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const kpis = [
    { icon: Package, label: 'Active Shipments', value: data.totalActive, color: 'text-cyan-400', bg: 'bg-cyan-400/10', href: '/admin/shipments' },
    { icon: CheckCircle, label: 'Delivered Today', value: data.deliveredToday, color: 'text-green-400', bg: 'bg-green-400/10', href: '/admin/shipments?status=DELIVERED' },
    { icon: AlertTriangle, label: 'Exceptions', value: data.exceptions, color: 'text-red-400', bg: 'bg-red-400/10', href: '/admin/exceptions' },
    { icon: Clock, label: 'Pending Review', value: data.pendingReview, color: 'text-yellow-400', bg: 'bg-yellow-400/10', href: '/admin/shipments?status=PENDING_REVIEW' },
    { icon: Truck, label: 'Pickup Requests', value: data.pickupsPending, color: 'text-purple-400', bg: 'bg-purple-400/10', href: '/admin/pickups' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-[#6a7a8a] text-sm mt-1">Operations overview — live data</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {kpis.map(({ icon: Icon, label, value, color, bg, href }) => (
          <a key={label} href={href} className="card hover:border-[#344a62] transition-colors">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-[#5a6a7a] text-xs mt-1">{label}</p>
          </a>
        ))}
      </div>

      {/* Recent Shipments */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <TrendingUp size={18} className="text-[#c9a84c]" />
            Recent Shipments
          </h2>
          <a href="/admin/shipments" className="text-[#c9a84c] text-xs hover:underline">View all →</a>
        </div>

        {data.recentShipments.length === 0 ? (
          <p className="text-[#4a5a6a] text-sm text-center py-8">No shipments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#243448]">
                  <th className="text-left py-2 px-3 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider">Tracking</th>
                  <th className="text-left py-2 px-3 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-2 px-3 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Sender</th>
                  <th className="text-left py-2 px-3 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider hidden md:table-cell">Recipient</th>
                  <th className="text-left py-2 px-3 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.recentShipments.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-[#1e2d3d] admin-row"
                    onClick={() => { window.location.href = `/admin/shipments/${s.id}` }}
                  >
                    <td className="py-3 px-3">
                      <span className="font-mono text-[#c9a84c] text-xs">{s.tracking_code}</span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={s.current_status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-[#8899aa] hidden sm:table-cell">{s.sender_name}</td>
                    <td className="py-3 px-3 text-[#8899aa] hidden md:table-cell">
                      {s.recipient_name} <span className="text-[#4a5a6a]">· {s.recipient_country}</span>
                    </td>
                    <td className="py-3 px-3 text-[#5a6a7a] text-xs hidden lg:table-cell">
                      {formatDateTime(s.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
