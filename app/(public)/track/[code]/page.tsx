import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import TrackingStepper from '@/components/public/TrackingStepper'
import TrackingTimeline from '@/components/public/TrackingTimeline'
import StatusBadge from '@/components/public/StatusBadge'
import TrackingPoller from '@/components/public/TrackingPoller'
import { formatDate, formatWeight, formatDimensions } from '@/lib/utils'
import { SERVICE_LABELS, STATUS_LABELS, type Shipment } from '@/types/database'
import { Calendar, MapPin, Package, AlertTriangle, Truck } from 'lucide-react'

interface Props {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  return {
    title: `Tracking ${code}`,
    description: `Track your Crownport shipment ${code} for real-time status updates.`,
  }
}

async function getShipment(code: string): Promise<Shipment | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT')) return null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('shipments')
      .select('*, tracking_events(*)')
      .eq('tracking_code', code.toUpperCase())
      .eq('is_test', false)
      .single<Shipment>()

    if (error || !data) {
      logger.warn('Shipment not found for tracking', { code })
      return null
    }
    return data
  } catch (err) {
    logger.error('Error fetching shipment for tracking', { code, error: err instanceof Error ? err.message : 'unknown' })
    return null
  }
}

export default async function TrackCodePage({ params }: Props) {
  const { code } = await params
  const shipment = await getShipment(code)

  if (!shipment) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
            <Package size={32} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Shipment Not Found</h1>
          <p className="text-[#6a7a8a] mb-6">
            We couldn't find a shipment with tracking code{' '}
            <span className="font-mono text-[#c9a84c] font-semibold">{code.toUpperCase()}</span>.
            Please check the code and try again.
          </p>
          <a href="/track" className="btn-gold inline-flex">
            Try Again
          </a>
        </div>
      </div>
    )
  }

  const isException = ['EXCEPTION', 'ON_HOLD', 'DELIVERY_ATTEMPTED'].includes(shipment.current_status)
  const isCancelled = shipment.current_status === 'CANCELLED'
  const isDelivered = shipment.current_status === 'DELIVERED'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[#6a7a8a] text-sm mb-1">Tracking Number</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-wide">
            {shipment.tracking_code}
          </h1>
        </div>
        <StatusBadge status={shipment.current_status} />
      </div>

      {/* Exception banner */}
      {isException && shipment.exception_message && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3">
          <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-semibold text-sm mb-1">Attention Required</p>
            <p className="text-red-300/80 text-sm">{shipment.exception_message}</p>
          </div>
        </div>
      )}

      {/* Delivered banner */}
      {isDelivered && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex gap-3">
          <span className="text-2xl leading-none">🎉</span>
          <div>
            <p className="text-green-400 font-semibold text-sm mb-1">Package Delivered!</p>
            <p className="text-green-300/80 text-sm">
              Your package was successfully delivered{shipment.actual_delivery ? ` on ${formatDate(shipment.actual_delivery)}` : ''}.
            </p>
          </div>
        </div>
      )}

      {/* Stepper */}
      {!isCancelled && (
        <div className="card mb-6 overflow-x-auto">
          <TrackingStepper status={shipment.current_status} />
        </div>
      )}

      {/* Estimated delivery */}
      {shipment.estimated_delivery && !isDelivered && !isCancelled && (
        <div className="card mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#c9a84c15] flex items-center justify-center shrink-0">
            <Calendar size={20} className="text-[#c9a84c]" />
          </div>
          <div>
            <p className="text-[#6a7a8a] text-xs">Estimated Delivery</p>
            <p className="text-white font-semibold text-lg">{formatDate(shipment.estimated_delivery)}</p>
          </div>
        </div>
      )}

      {/* Shipment Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {/* From / To */}
        <div className="card">
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-4">Route</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[#6a7a8a] text-xs mb-1">
                <MapPin size={12} /> Origin
              </div>
              <p className="text-white font-medium text-sm">{shipment.sender_city}, {shipment.sender_country}</p>
            </div>
            <div className="border-t border-[#243448]" />
            <div>
              <div className="flex items-center gap-1.5 text-[#6a7a8a] text-xs mb-1">
                <MapPin size={12} /> Destination
              </div>
              <p className="text-white font-medium text-sm">{shipment.recipient_city}, {shipment.recipient_country}</p>
            </div>
          </div>
        </div>

        {/* Shipment info */}
        <div className="card">
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-4">Shipment Info</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#6a7a8a] text-xs flex items-center gap-1.5"><Package size={12} /> Service</span>
              <span className="text-white text-sm font-medium">
                {SERVICE_LABELS[shipment.service_type] ?? shipment.service_type}
              </span>
            </div>
            {shipment.physical_carrier && (
              <div className="flex justify-between items-center">
                <span className="text-[#6a7a8a] text-xs flex items-center gap-1.5"><Truck size={12} /> Carrier</span>
                <span className="text-white text-sm font-medium">{shipment.physical_carrier}</span>
              </div>
            )}
            {shipment.weight_kg && (
              <div className="flex justify-between items-center">
                <span className="text-[#6a7a8a] text-xs">Weight</span>
                <span className="text-white text-sm font-medium">{formatWeight(shipment.weight_kg)}</span>
              </div>
            )}
            {shipment.length_cm && (
              <div className="flex justify-between items-center">
                <span className="text-[#6a7a8a] text-xs">Dimensions</span>
                <span className="text-white text-sm font-medium">
                  {formatDimensions(shipment.length_cm, shipment.width_cm, shipment.height_cm)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-6">
          Tracking History
        </h3>
        <TrackingTimeline events={shipment.tracking_events ?? []} />
      </div>

      {/* POD Photo */}
      {isDelivered && shipment.pod_photo_url && (
        <div className="card mt-5">
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-4">
            Proof of Delivery
          </h3>
          <img
            src={shipment.pod_photo_url}
            alt="Proof of delivery"
            className="rounded-lg max-h-64 object-cover"
          />
        </div>
      )}

      {/* Client-side polling */}
      <TrackingPoller trackingCode={shipment.tracking_code} />
    </div>
  )
}
