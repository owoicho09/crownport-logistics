import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Destination } from '@/types/database'
import { Globe } from 'lucide-react'
import DestinationsClient from '@/components/public/DestinationsClient'

export const metadata: Metadata = {
  title: 'Global Destinations | Crownport Logistics',
  description: 'Explore all countries Crownport Logistics ships to, with transit times and service details.',
}
export const revalidate = 3600

async function getDestinations(): Promise<Destination[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co')) return []
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9a84c15] border border-[#c9a84c30] text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-5">
          <Globe size={12} /> Global Coverage
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Where We Ship</h1>
        <p className="text-[#6a7a8a] text-lg max-w-xl mx-auto">
          Crownport delivers to{' '}
          <span className="text-white font-semibold">
            {destinations.length > 0 ? `${destinations.length}+` : '150+'}
          </span>{' '}
          countries worldwide — from major cities to remote destinations.
        </p>
      </div>

      <DestinationsClient destinations={destinations} />
    </div>
  )
}
