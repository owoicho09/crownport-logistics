import { createClient } from '@/lib/supabase/server'
import LocationsManager from '@/components/admin/LocationsManager'
import type { Location } from '@/types/database'

export const dynamic = 'force-dynamic'

async function getLocations() {
  const supabase = await createClient()
  const { data } = await supabase.from('locations').select('*').order('sort_order').order('name')
  return (data as Location[]) ?? []
}

export default async function AdminLocationsPage() {
  const locations = await getLocations()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Locations</h1>
        <p className="text-[#6a7a8a] text-sm mt-1">Manage Crownport offices, hubs, and drop-off points</p>
      </div>
      <LocationsManager locations={locations} />
    </div>
  )
}
