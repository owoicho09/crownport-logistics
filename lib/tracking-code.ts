import { createAdminClient } from '@/lib/supabase/admin'
import { ServiceType, SERVICE_PREFIXES } from '@/types/database'

export async function generateTrackingCode(
  serviceType: ServiceType,
  recipientCountry: string
): Promise<string> {
  const supabase = createAdminClient()
  const prefix = SERVICE_PREFIXES[serviceType] || 'CR'
  const countryCode = recipientCountry.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X')

  const { data, error } = await supabase
    .rpc('generate_tracking_code', {
      service_prefix: prefix,
      country_code: countryCode,
    })

  if (error || !data) {
    // Fallback: generate locally if RPC fails
    const rand = Math.floor(Math.random() * 99999999).toString().padStart(8, '0')
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const check = chars[Math.floor(Math.random() * chars.length)]
    return `${prefix}${rand}${check}${countryCode}`
  }

  return data as string
}
