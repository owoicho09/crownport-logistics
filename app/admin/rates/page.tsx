import { createClient } from '@/lib/supabase/server'
import RatesManager from '@/components/admin/RatesManager'
import type { RateEntry } from '@/types/database'

export const dynamic = 'force-dynamic'

async function getRates() {
  const supabase = await createClient()
  const { data } = await supabase.from('rate_table').select('*').order('service_type').order('origin_zone')
  return (data as RateEntry[]) ?? []
}

export default async function RatesPage() {
  const rates = await getRates()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Rate Table</h1>
        <p className="text-[#6a7a8a] text-sm mt-1">Manage shipping rates used by the public rate calculator</p>
      </div>
      <RatesManager rates={rates} />
    </div>
  )
}
