'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { STATUS_LABELS, SERVICE_LABELS, type ShipmentStatus, type ServiceType } from '@/types/database'
import { Package, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'

interface Props {
  data: {
    total: number
    delivered: number
    exceptions: number
    exceptionRate: string
    statusDistribution: { status: string; count: number }[]
    topCountries: { country: string; count: number }[]
    byService: { service: string; count: number }[]
  }
}

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: '#4ade80',
  IN_TRANSIT: '#22d3ee',
  OUT_FOR_DELIVERY: '#f59e0b',
  EXCEPTION: '#f87171',
  PENDING_REVIEW: '#facc15',
  PICKED_UP: '#60a5fa',
}

const TOOLTIP_STYLE = {
  backgroundColor: '#1a2535',
  border: '1px solid #243448',
  borderRadius: '8px',
  color: '#d0dde8',
  fontSize: '12px',
}

export default function ReportsView({ data }: Props) {
  const kpis = [
    { icon: Package, label: 'Total (30 days)', value: data.total, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { icon: CheckCircle, label: 'Delivered', value: data.delivered, color: 'text-green-400', bg: 'bg-green-400/10' },
    { icon: AlertTriangle, label: 'Exceptions', value: data.exceptions, color: 'text-red-400', bg: 'bg-red-400/10' },
    { icon: TrendingUp, label: 'Exception Rate', value: `${data.exceptionRate}%`, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ]

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-[#5a6a7a] text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 text-sm">Status Distribution</h3>
          {data.statusDistribution.length === 0 ? (
            <p className="text-[#4a5a6a] text-sm text-center py-8">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.statusDistribution.map((s) => ({
                name: (STATUS_LABELS[s.status as ShipmentStatus] ?? s.status).replace(' ', '\n'),
                count: s.count,
                status: s.status,
              }))}>
                <XAxis dataKey="name" tick={{ fill: '#6a7a8a', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6a7a8a', fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.statusDistribution.map((s) => (
                    <Cell key={s.status} fill={STATUS_COLORS[s.status] ?? '#c9a84c'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* By Service */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 text-sm">Volume by Service</h3>
          {data.byService.length === 0 ? (
            <p className="text-[#4a5a6a] text-sm text-center py-8">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.byService.map((s) => ({
                name: SERVICE_LABELS[s.service as ServiceType] ?? s.service,
                count: s.count,
              }))}>
                <XAxis dataKey="name" tick={{ fill: '#6a7a8a', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6a7a8a', fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#c9a84c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Countries */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4 text-sm">Top Destination Countries</h3>
        {data.topCountries.length === 0 ? (
          <p className="text-[#4a5a6a] text-sm text-center py-6">No data yet.</p>
        ) : (
          <div className="space-y-2">
            {data.topCountries.map(({ country, count }, i) => {
              const max = data.topCountries[0]?.count ?? 1
              const pct = Math.round((count / max) * 100)
              return (
                <div key={country} className="flex items-center gap-3">
                  <span className="text-[#4a5a6a] text-xs w-5 text-right">{i + 1}</span>
                  <span className="text-[#c0d0e0] text-sm w-36 shrink-0">{country}</span>
                  <div className="flex-1 h-2 bg-[#1e2d3d] rounded-full overflow-hidden">
                    <div className="h-full bg-[#c9a84c] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[#6a7a8a] text-xs w-10 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
