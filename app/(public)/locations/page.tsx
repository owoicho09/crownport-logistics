import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Location } from '@/types/database'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Locations',
  description: 'Find Crownport Logistics offices, hubs, and drop-off points worldwide.',
}
export const revalidate = 3600

async function getLocations() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT')) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .order('country')
    return (data as Location[]) ?? []
  } catch { return [] }
}

export default async function LocationsPage() {
  const locations = await getLocations()

  const byCountry: Record<string, Location[]> = {}
  locations.forEach((l) => {
    if (!byCountry[l.country]) byCountry[l.country] = []
    byCountry[l.country].push(l)
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-12">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-3">Find Us</p>
        <h1 className="text-4xl font-bold text-white mb-4">Our Offices & Drop-off Points</h1>
        <p className="text-[#6a7a8a] max-w-xl mx-auto">
          Visit any of our locations to drop off a package or speak with our team.
        </p>
      </div>

      {locations.length === 0 ? (
        <div className="text-center py-20 text-[#4a5a6a]">
          <MapPin size={40} className="mx-auto mb-4 opacity-40" />
          <p>Location information coming soon. Contact us for details.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(byCountry).map(([country, locs]) => (
            <div key={country}>
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-2 h-5 rounded bg-[#c9a84c] inline-block" />
                {country}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {locs.map((loc) => (
                  <div key={loc.id} className="card">
                    <h3 className="text-white font-semibold mb-3">{loc.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-[#6a7a8a]">
                        <MapPin size={14} className="text-[#c9a84c] mt-0.5 shrink-0" />
                        <span>{loc.address}, {loc.city}</span>
                      </div>
                      {loc.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} className="text-[#c9a84c] shrink-0" />
                          <a href={`tel:${loc.phone}`} className="text-[#6a7a8a] hover:text-[#c9a84c]">{loc.phone}</a>
                        </div>
                      )}
                      {loc.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-[#c9a84c] shrink-0" />
                          <a href={`mailto:${loc.email}`} className="text-[#6a7a8a] hover:text-[#c9a84c]">{loc.email}</a>
                        </div>
                      )}
                      {loc.hours && (
                        <div className="flex items-start gap-2 text-sm text-[#6a7a8a]">
                          <Clock size={14} className="text-[#c9a84c] mt-0.5 shrink-0" />
                          <span>{loc.hours}</span>
                        </div>
                      )}
                    </div>
                    {loc.services && loc.services.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#243448] flex flex-wrap gap-1.5">
                        {loc.services.map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e2d3d] border border-[#2d4058] text-[#6a7a8a]">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
