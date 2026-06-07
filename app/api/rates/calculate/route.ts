import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { withRequestContext } from '@/lib/logger'
import type { ServiceType } from '@/types/database'

const TRANSIT_TIMES: Record<ServiceType, string> = {
  EXPRESS: '1–3 Business Days',
  STANDARD: '5–10 Business Days',
  FREIGHT: 'Varies',
  INTERNATIONAL: '5–21 Business Days',
  ECOMMERCE: '1–5 Business Days',
  SAMEDAY: '2–6 Hours',
}

export async function POST(request: NextRequest) {
  const log = withRequestContext('/api/rates/calculate', 'POST')

  try {
    const body = await request.json()
    const { origin, destination, weight, service } = body as {
      origin: string
      destination: string
      weight: number
      service: ServiceType
    }

    if (!origin || !destination || !weight || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    log.info('Rate calculation requested', { origin, destination, weight, service })

    const supabase = createAdminClient()

    // Try to find exact or zone match
    const { data: rates } = await supabase
      .from('rate_table')
      .select('*')
      .eq('service_type', service)
      .eq('is_active', true)

    if (!rates || rates.length === 0) {
      return NextResponse.json({ found: false })
    }

    // Normalize input for zone matching
    const originNorm = origin.toLowerCase()
    const destNorm = destination.toLowerCase()

    // Find best matching rate
    const rate = rates.find((r) => {
      const oMatch = r.origin_zone.toLowerCase() === originNorm || r.origin_zone.toLowerCase() === 'worldwide'
      const dMatch = r.destination_zone.toLowerCase() === destNorm || r.destination_zone.toLowerCase() === 'worldwide'
      const weightOk = weight >= (r.min_weight ?? 0) && (!r.max_weight || weight <= r.max_weight)
      return oMatch && dMatch && weightOk
    })

    if (!rate) {
      return NextResponse.json({ found: false })
    }

    const base = parseFloat(rate.base_fee)
    const perKg = parseFloat(rate.per_kg_rate)
    const estimated = base + perKg * weight
    const estimatedMax = estimated * 1.1 // 10% range

    return NextResponse.json({
      found: true,
      estimatedMin: estimated,
      estimatedMax: estimatedMax,
      currency: rate.currency,
      service,
      transitTime: TRANSIT_TIMES[service],
    })
  } catch (err) {
    log.error('Rate calculation failed', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
  }
}
