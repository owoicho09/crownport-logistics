import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendAdminAlert } from '@/lib/email'
import { withRequestContext } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const log = withRequestContext('/api/pickup', 'POST')

  try {
    const body = await request.json()
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('pickup_requests')
      .insert({
        status: 'PENDING',
        contact_name: body.contact_name,
        contact_phone: body.contact_phone,
        contact_email: body.contact_email || null,
        pickup_address: body.pickup_address,
        pickup_city: body.pickup_city,
        pickup_country: body.pickup_country,
        preferred_date: body.preferred_date,
        preferred_time_from: body.preferred_time_from || null,
        preferred_time_to: body.preferred_time_to || null,
        special_instructions: body.special_instructions || null,
      })
      .select('id')
      .single()

    if (error) {
      log.error('Failed to create pickup request', { error: error.message })
      return NextResponse.json({ error: 'Failed to submit pickup request' }, { status: 500 })
    }

    log.info('Pickup request created', { id: data.id })

    sendAdminAlert(
      `New Pickup Request — ${body.contact_name}`,
      `<p><strong>Name:</strong> ${body.contact_name}</p>
       <p><strong>Phone:</strong> ${body.contact_phone}</p>
       <p><strong>Address:</strong> ${body.pickup_address}, ${body.pickup_city}, ${body.pickup_country}</p>
       <p><strong>Date:</strong> ${body.preferred_date}</p>
       <p>View in <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/pickups">admin panel</a></p>`
    ).catch(() => {})

    return NextResponse.json({ success: true, id: data.id }, { status: 201 })
  } catch (err) {
    log.error('Pickup route error', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
