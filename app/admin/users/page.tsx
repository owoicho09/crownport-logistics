import { createClient } from '@/lib/supabase/server'
import UsersManager from '@/components/admin/UsersManager'
import type { AdminProfile } from '@/types/database'

export const dynamic = 'force-dynamic'

async function getUsers() {
  const supabase = await createClient()
  const { data } = await supabase.from('admin_profiles').select('*').order('created_at')
  return (data as AdminProfile[]) ?? []
}

export default async function UsersPage() {
  const users = await getUsers()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Users</h1>
        <p className="text-[#6a7a8a] text-sm mt-1">Manage admin panel access</p>
      </div>
      <UsersManager users={users} />
    </div>
  )
}
