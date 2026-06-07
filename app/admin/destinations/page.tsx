import { createClient } from '@/lib/supabase/server'
import DestinationsManager from '@/components/admin/DestinationsManager'
import type { Destination } from '@/types/database'

export const dynamic = 'force-dynamic'

async function getDestinations() {
  const supabase = await createClient()
  const { data } = await supabase.from('destinations').select('*').order('country_name')
  return (data as Destination[]) ?? []
}

export default async function AdminDestinationsPage() {
  const destinations = await getDestinations()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Destinations</h1>
        <p className="text-[#6a7a8a] text-sm mt-1">Manage countries available for shipping</p>
      </div>
      <DestinationsManager destinations={destinations} />
    </div>
  )
}
