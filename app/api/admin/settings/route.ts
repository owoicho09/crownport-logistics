import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { writeAuditLog } from '@/lib/audit'

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const values = await request.json() as Record<string, string>
    const adminClient = createAdminClient()

    const upserts = Object.entries(values).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }))

    const { error } = await adminClient
      .from('settings')
      .upsert(upserts, { onConflict: 'key' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await writeAuditLog({
      actorId: user.id,
      action: 'UPDATE_SETTINGS',
      entityType: 'settings',
      afterData: values,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
