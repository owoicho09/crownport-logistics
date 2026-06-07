'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import Link from 'next/link'
import StatusBadge from '@/components/public/StatusBadge'
import { formatDate } from '@/lib/utils'
import { SERVICE_LABELS, STATUS_LABELS, type Shipment, type ServiceType, type ShipmentStatus } from '@/types/database'
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Props {
  shipments: Shipment[]
  total: number
  page: number
  pageSize: number
  filters: {
    status?: string
    search?: string
    country?: string
    service?: string
  }
}

const STATUSES = Object.entries(STATUS_LABELS) as [ShipmentStatus, string][]
const SERVICES = Object.entries(SERVICE_LABELS) as [ServiceType, string][]

export default function ShipmentsTable({ shipments, total, page, pageSize, filters }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) { params.set(key, value) } else { params.delete(key) }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      {/* Filters */}
      <div className="card mb-4 p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6a7a]" />
            <input
              type="text"
              placeholder="Search tracking code, sender, recipient..."
              defaultValue={filters.search ?? ''}
              className="input-field pl-8 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateFilter('search', (e.target as HTMLInputElement).value)
                }
              }}
              onChange={(e) => {
                if (!e.target.value) updateFilter('search', '')
              }}
            />
          </div>

          <select
            value={filters.status ?? ''}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="input-field py-2 text-sm w-auto min-w-[160px]"
          >
            <option value="">All Statuses</option>
            {STATUSES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>

          <select
            value={filters.service ?? ''}
            onChange={(e) => updateFilter('service', e.target.value)}
            className="input-field py-2 text-sm w-auto min-w-[160px]"
          >
            <option value="">All Services</option>
            {SERVICES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>

          {(filters.status || filters.search || filters.service) && (
            <button
              onClick={() => router.push(pathname)}
              className="flex items-center gap-1 text-[#6a7a8a] hover:text-white text-sm px-3 py-2 rounded border border-[#2d4058] hover:border-[#3d5068]"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#243448] bg-[#1e2d3d]/50">
              <tr>
                <th className="text-left py-3 px-4 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider">Tracking</th>
                <th className="text-left py-3 px-4 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider hidden md:table-cell">Sender</th>
                <th className="text-left py-3 px-4 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider">Recipient</th>
                <th className="text-left py-3 px-4 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Service</th>
                <th className="text-left py-3 px-4 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider hidden xl:table-cell">Est. Delivery</th>
                <th className="text-left py-3 px-4 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider hidden xl:table-cell">Created</th>
              </tr>
            </thead>
            <tbody>
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#4a5a6a]">No shipments found.</td>
                </tr>
              ) : (
                shipments.map((s) => (
                  <tr key={s.id} className="border-b border-[#1e2d3d] admin-row">
                    <td className="py-3 px-4">
                      <Link href={`/admin/shipments/${s.id}`} className="font-mono text-[#c9a84c] text-xs hover:underline">
                        {s.tracking_code}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={s.current_status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-[#8899aa] hidden md:table-cell">{s.sender_name}</td>
                    <td className="py-3 px-4">
                      <div className="text-[#c0d0e0] text-xs">{s.recipient_name}</div>
                      <div className="text-[#5a6a7a] text-xs">{s.recipient_country}</div>
                    </td>
                    <td className="py-3 px-4 text-[#6a7a8a] text-xs hidden lg:table-cell">
                      {SERVICE_LABELS[s.service_type] ?? s.service_type}
                    </td>
                    <td className="py-3 px-4 text-[#6a7a8a] text-xs hidden xl:table-cell">
                      {formatDate(s.estimated_delivery)}
                    </td>
                    <td className="py-3 px-4 text-[#5a6a7a] text-xs hidden xl:table-cell">
                      {formatDate(s.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#243448]">
            <p className="text-[#5a6a7a] text-xs">
              Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => updateFilter('page', String(page - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded border border-[#2d4058] text-[#6a7a8a] hover:text-white disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="text-[#6a7a8a] text-sm px-2 flex items-center">{page} / {totalPages}</span>
              <button
                onClick={() => updateFilter('page', String(page + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded border border-[#2d4058] text-[#6a7a8a] hover:text-white disabled:opacity-40"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
