import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Location } from '@/types/database'
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Locations | Crownport Logistics',
  description: 'Find Crownport Logistics offices, hubs, and drop-off points worldwide.',
}
export const revalidate = 3600

async function getLocations(): Promise<Location[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co')) return []
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-3">Find Us Worldwide</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Our Global Offices & Hubs</h1>
        <p className="text-[#6a7a8a] text-lg max-w-2xl mx-auto">
          Visit any Crownport office to drop off a shipment, request a pickup, or speak with our logistics team.
        </p>
      </div>

      {locations.length === 0 ? (
        <div className="text-center py-20 text-[#4a5a6a]">
          <MapPin size={40} className="mx-auto mb-4 opacity-40" />
          <p>Location information coming soon. Contact us for details.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div key={loc.id} className="card hover:border-[#c9a84c30] hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
              {/* Location header */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-white font-bold text-base leading-snug">{loc.name}</h3>
                  <p className="text-[#c9a84c] text-xs font-semibold mt-1">{loc.city}, {loc.country}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-[#c9a84c15] border border-[#c9a84c20] flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-[#c9a84c]" />
                </div>
              </div>

              {/* Contact details */}
              <div className="space-y-2.5 flex-1">
                <div className="flex items-start gap-2.5">
                  <MapPin size={13} className="text-[#c9a84c] mt-0.5 shrink-0" />
                  <span className="text-[#8899aa] text-sm leading-relaxed">{loc.address}, {loc.city}</span>
                </div>
                {loc.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone size={13} className="text-[#c9a84c] shrink-0" />
                    <a href={`tel:${loc.phone}`} className="text-[#8899aa] hover:text-[#c9a84c] text-sm transition-colors">
                      {loc.phone}
                    </a>
                  </div>
                )}
                {loc.email && (
                  <div className="flex items-center gap-2.5">
                    <Mail size={13} className="text-[#c9a84c] shrink-0" />
                    <a href={`mailto:${loc.email}`} className="text-[#8899aa] hover:text-[#c9a84c] text-sm transition-colors truncate">
                      {loc.email}
                    </a>
                  </div>
                )}
                {loc.hours && (
                  <div className="flex items-start gap-2.5">
                    <Clock size={13} className="text-[#c9a84c] mt-0.5 shrink-0" />
                    <span className="text-[#8899aa] text-sm">{loc.hours}</span>
                  </div>
                )}
              </div>

              {/* Services */}
              {loc.services && loc.services.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#243448]">
                  <p className="text-[#5a6a7a] text-[10px] uppercase tracking-widest font-semibold mb-2">Services Available</p>
                  <div className="flex flex-wrap gap-1.5">
                    {loc.services.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-[#1e2d3d] border border-[#2d4058] text-[#8899aa]">
                        <CheckCircle size={9} className="text-[#c9a84c]" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CTA strip */}
      <div className="mt-16 rounded-2xl bg-gradient-to-br from-[#1e2d3d] to-[#1a2535] border border-[#c9a84c20] p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Can't find a location near you?</h2>
        <p className="text-[#6a7a8a] text-sm mb-5">We offer door-to-door pickup services worldwide. Schedule a collection from your address.</p>
        <a href="/pickup" className="btn-gold inline-flex">Schedule a Pickup</a>
      </div>
    </div>
  )
}
