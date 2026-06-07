import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/admin/SettingsForm'
import type { Setting } from '@/types/database'

export const dynamic = 'force-dynamic'

async function getSettings() {
  const supabase = await createClient()
  const { data } = await supabase.from('settings').select('*').order('key')
  return (data as Setting[]) ?? []
}

export default async function SettingsPage() {
  const settings = await getSettings()
  const map: Record<string, string> = {}
  settings.forEach((s) => { if (s.key && s.value !== null) map[s.key] = s.value ?? '' })

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-[#6a7a8a] text-sm mt-1">Configure company information and notification defaults</p>
      </div>
      <SettingsForm settings={map} />
    </div>
  )
}
