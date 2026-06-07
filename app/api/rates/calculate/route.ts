import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { withRequestContext } from '@/lib/logger'
import type { ServiceType } from '@/types/database'

const TRANSIT_TIMES: Record<ServiceType, string> = {
  EXPRESS: '1–3 Business Days',
  STANDARD: '5–10 Business Days',
  FREIGHT: 'Varies by route',
  INTERNATIONAL: '5–21 Business Days',
  ECOMMERCE: '1–5 Business Days',
  SAMEDAY: '2–6 Hours',
}

// Regional zone names stored in rate_table destination_zone
const REGION_TO_ZONE: Record<string, string> = {
  Africa: 'Africa',
  Americas: 'Americas',
  'Asia Pacific': 'Asia Pacific',
  'Middle East': 'Middle East',
  Europe: 'Europe',
  Oceania: 'Asia Pacific',
}

export async function POST(request: NextRequest) {
  const log = withRequestContext('/api/rates/calculate', 'POST')

  try {
    const body = await request.json()
    const {
      origin,
      destination,
      weight,
      service,
      length_cm,
      width_cm,
      height_cm,
    } = body as {
      origin: string
      destination: string
      weight: number
      service: ServiceType
      length_cm?: number
      width_cm?: number
      height_cm?: number
    }

    if (!origin || !destination || !weight || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Volumetric weight (L × W × H / 5000), chargeable = max(actual, volumetric)
    const volumetricWeight =
      length_cm && width_cm && height_cm
        ? (length_cm * width_cm * height_cm) / 5000
        : null

    const chargeableWeight = volumetricWeight
      ? Math.max(weight, volumetricWeight)
      : weight

    log.info('Rate calculation requested', {
      origin,
      destination,
      weight,
      volumetricWeight,
      chargeableWeight,
      service,
    })

    const supabase = createAdminClient()

    // Resolve destination region from destinations table
    const { data: destRecord } = await supabase
      .from('destinations')
      .select('region')
      .ilike('country_name', `%${destination.trim()}%`)
      .limit(1)
      .single()

    const region = destRecord?.region ?? null
    const destinationZone = region ? REGION_TO_ZONE[region] ?? 'Worldwide' : 'Worldwide'

    // Look for a region-specific rate, then fall back to Worldwide
    const { data: rates } = await supabase
      .from('rate_table')
      .select('*')
      .eq('service_type', service)
      .eq('is_active', true)

    if (!rates || rates.length === 0) {
      return NextResponse.json({ found: false })
    }

    // Priority: exact zone match > Worldwide fallback
    const findRate = (zone: string) =>
      rates.find((r) => {
        const oMatch =
          r.origin_zone.toLowerCase() === origin.toLowerCase() ||
          r.origin_zone.toLowerCase() === 'worldwide'
        const dMatch = r.destination_zone.toLowerCase() === zone.toLowerCase()
        const weightOk =
          chargeableWeight >= (r.min_weight ?? 0) &&
          (!r.max_weight || chargeableWeight <= r.max_weight)
        return oMatch && dMatch && weightOk
      })

    const rate = findRate(destinationZone) ?? findRate('worldwide')

    if (!rate) {
      return NextResponse.json({ found: false })
    }

    const base = parseFloat(rate.base_fee)
    const perKg = parseFloat(rate.per_kg_rate)
    const estimated = base + perKg * chargeableWeight
    const estimatedMax = estimated * 1.1

    return NextResponse.json({
      found: true,
      estimatedMin: parseFloat(estimated.toFixed(2)),
      estimatedMax: parseFloat(estimatedMax.toFixed(2)),
      currency: rate.currency,
      service,
      transitTime: TRANSIT_TIMES[service],
      chargeableWeight: parseFloat(chargeableWeight.toFixed(3)),
      volumetricWeight: volumetricWeight ? parseFloat(volumetricWeight.toFixed(3)) : null,
      destinationRegion: region ?? 'Unknown',
    })
  } catch (err) {
    log.error('Rate calculation failed', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
  }
}
