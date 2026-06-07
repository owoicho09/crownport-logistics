import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import StatusBadge from '@/components/public/StatusBadge'
import ShipmentsTable from '@/components/admin/ShipmentsTable'
import type { Shipment } from '@/types/database'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    status?: string
    search?: string
    page?: string
    country?: string
    service?: string
  }>
}

const PAGE_SIZE = 25

async function getShipments(filters: {
  status?: string
  search?: string
  page: number
  country?: string
  service?: string
}) {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('shipments')
      .select('id, tracking_code, current_status, sender_name, recipient_name, recipient_country, service_type, created_at, estimated_delivery, physical_carrier, is_test', { count: 'exact' })
      .order('created_at', { ascending: false })
      .eq('is_test', false)
      .range((filters.page - 1) * PAGE_SIZE, filters.page * PAGE_SIZE - 1)

    if (filters.status) query = query.eq('current_status', filters.status)
    if (filters.country) query = query.eq('recipient_country', filters.country)
    if (filters.service) query = query.eq('service_type', filters.service)
    if (filters.search) {
      query = query.or(
        `tracking_code.ilike.%${filters.search}%,sender_name.ilike.%${filters.search}%,recipient_name.ilike.%${filters.search}%`
      )
    }

    const { data, count, error } = await query
    if (error) throw error
    return { shipments: (data as Shipment[]) ?? [], total: count ?? 0 }
  } catch (err) {
    logger.error('Failed to fetch shipments', { error: err instanceof Error ? err.message : 'unknown' })
    return { shipments: [], total: 0 }
  }
}

export default async function ShipmentsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const { shipments, total } = await getShipments({
    status: params.status,
    search: params.search,
    page,
    country: params.country,
    service: params.service,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Shipments</h1>
          <p className="text-[#6a7a8a] text-sm mt-1">{total} total shipments</p>
        </div>
        <a href="/admin/create" className="btn-gold text-sm py-2 px-4">+ New Shipment</a>
      </div>
      <ShipmentsTable
        shipments={shipments}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        filters={{ status: params.status, search: params.search, country: params.country, service: params.service }}
      />
    </div>
  )
}
