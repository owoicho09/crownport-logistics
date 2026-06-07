import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import ShipmentDetailView from '@/components/admin/ShipmentDetailView'
import type { Shipment } from '@/types/database'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ id: string }> }

async function getShipment(id: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('shipments')
      .select('*, tracking_events(*), notifications_log(*)')
      .eq('id', id)
      .single<Shipment & { notifications_log: unknown[] }>()

    if (error || !data) return null
    return data
  } catch (err) {
    logger.error('Failed to fetch shipment detail', { id, error: err instanceof Error ? err.message : 'unknown' })
    return null
  }
}

export default async function ShipmentDetailPage({ params }: Props) {
  const { id } = await params
  const shipment = await getShipment(id)
  if (!shipment) notFound()

  return <ShipmentDetailView shipment={shipment} />
}
