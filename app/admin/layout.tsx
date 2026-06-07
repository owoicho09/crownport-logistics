import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirectTo=/admin')

  // Check admin profile
  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('full_name, email, role')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login?redirectTo=/admin')

  return (
    <div className="flex h-screen bg-[#0c1520] overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopBar user={{ name: profile.full_name, email: profile.email }} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
