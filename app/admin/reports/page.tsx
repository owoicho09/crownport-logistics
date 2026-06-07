import { createClient } from '@/lib/supabase/server'
import ReportsView from '@/components/admin/ReportsView'

export const dynamic = 'force-dynamic'

async function getReportData() {
  const supabase = await createClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const fromDate = thirtyDaysAgo.toISOString()

  const [
    { data: statusCounts },
    { data: byCountry },
    { data: byService },
    { data: recentDeliveries },
  ] = await Promise.all([
    supabase
      .from('shipments')
      .select('current_status')
      .eq('is_test', false)
      .gte('created_at', fromDate),
    supabase
      .from('shipments')
      .select('recipient_country')
      .eq('is_test', false)
      .gte('created_at', fromDate),
    supabase
      .from('shipments')
      .select('service_type')
      .eq('is_test', false)
      .gte('created_at', fromDate),
    supabase
      .from('shipments')
      .select('id, tracking_code, current_status, estimated_delivery, actual_delivery, recipient_country')
      .eq('is_test', false)
      .in('current_status', ['DELIVERED', 'DELIVERY_ATTEMPTED', 'EXCEPTION'])
      .gte('created_at', fromDate)
      .limit(50),
  ])

  // Aggregate status distribution
  const statusMap: Record<string, number> = {}
  ;(statusCounts ?? []).forEach((s: { current_status: string }) => {
    statusMap[s.current_status] = (statusMap[s.current_status] ?? 0) + 1
  })

  // Top countries
  const countryMap: Record<string, number> = {}
  ;(byCountry ?? []).forEach((s: { recipient_country: string }) => {
    countryMap[s.recipient_country] = (countryMap[s.recipient_country] ?? 0) + 1
  })
  const topCountries = Object.entries(countryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }))

  // By service
  const serviceMap: Record<string, number> = {}
  ;(byService ?? []).forEach((s: { service_type: string }) => {
    serviceMap[s.service_type] = (serviceMap[s.service_type] ?? 0) + 1
  })

  const total = statusCounts?.length ?? 0
  const delivered = statusMap['DELIVERED'] ?? 0
  const exceptions = statusMap['EXCEPTION'] ?? 0
  const exceptionRate = total > 0 ? ((exceptions / total) * 100).toFixed(1) : '0'

  return {
    total,
    delivered,
    exceptions,
    exceptionRate,
    statusDistribution: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
    topCountries,
    byService: Object.entries(serviceMap).map(([service, count]) => ({ service, count })),
  }
}

export default async function ReportsPage() {
  const data = await getReportData()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-[#6a7a8a] text-sm mt-1">Last 30 days — live analytics</p>
      </div>
      <ReportsView data={data} />
    </div>
  )
}
