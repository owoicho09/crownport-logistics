import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Destination } from '@/types/database'
import { MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'Explore all countries Crownport Logistics ships to, grouped by region.',
}
export const revalidate = 3600

const REGIONS = ['Africa', 'Americas', 'Asia Pacific', 'Europe', 'Middle East', 'Oceania'] as const

async function getDestinations() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT')) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('destinations')
      .select('*')
      .eq('is_active', true)
      .order('region')
      .order('country_name')
    return (data as Destination[]) ?? []
  } catch { return [] }
}

export default async function DestinationsPage() {
  const destinations = await getDestinations()
  const grouped: Record<string, Destination[]> = {}
  REGIONS.forEach((r) => { grouped[r] = destinations.filter((d) => d.region === r) })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-12">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-3">Where We Ship</p>
        <h1 className="text-4xl font-bold text-white mb-4">Our Global Coverage</h1>
        <p className="text-[#6a7a8a] max-w-xl mx-auto">
          Crownport delivers to {destinations.length > 0 ? `${destinations.length}+` : '150+'} countries worldwide.
        </p>
      </div>

      {destinations.length === 0 ? (
        <div className="text-center py-20 text-[#4a5a6a]">
          <MapPin size={40} className="mx-auto mb-4 opacity-40" />
          <p>Destinations coming soon. Contact us for availability.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {REGIONS.map((region) => {
            const items = grouped[region]
            if (!items.length) return null
            return (
              <div key={region}>
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <span className="w-2 h-5 rounded bg-[#c9a84c] inline-block" />
                  {region}
                  <span className="text-[#4a5a6a] text-sm font-normal">({items.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {items.map((dest) => (
                    <div key={dest.id} className="card p-4 hover:border-[#c9a84c30] transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{dest.flag_emoji ?? '🌍'}</span>
                        <div>
                          <p className="text-white font-medium text-sm">{dest.country_name}</p>
                          {dest.transit_time_min && dest.transit_time_max && (
                            <p className="text-[#6a7a8a] text-xs">
                              {dest.transit_time_min}–{dest.transit_time_max} {dest.transit_unit}
                            </p>
                          )}
                        </div>
                      </div>
                      {dest.special_notes && (
                        <p className="text-[#5a6a7a] text-xs border-t border-[#243448] pt-2 mt-2">
                          {dest.special_notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
