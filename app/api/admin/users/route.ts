import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { withRequestContext } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const log = withRequestContext('/api/admin/users', 'POST')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { full_name, email, password } = await request.json()

    if (!full_name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      log.error('Failed to create auth user', { error: authError?.message })
      return NextResponse.json({ error: authError?.message ?? 'Failed to create user' }, { status: 500 })
    }

    // Create admin profile
    const { error: profileError } = await adminClient.from('admin_profiles').insert({
      id: authData.user.id,
      full_name,
      email,
      role: 'admin',
      is_active: true,
    })

    if (profileError) {
      // Rollback auth user
      await adminClient.auth.admin.deleteUser(authData.user.id)
      log.error('Failed to create admin profile', { error: profileError.message })
      return NextResponse.json({ error: 'Failed to create admin profile' }, { status: 500 })
    }

    log.info('Admin user created', { email })
    return NextResponse.json({ success: true, id: authData.user.id }, { status: 201 })
  } catch (err) {
    log.error('User creation error', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
