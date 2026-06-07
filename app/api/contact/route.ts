import { NextRequest, NextResponse } from 'next/server'
import { sendAdminAlert } from '@/lib/email'
import { withRequestContext } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const log = withRequestContext('/api/contact', 'POST')

  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await sendAdminAlert(
      `Contact Form: ${subject} — from ${name}`,
      `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
       <p><strong>Subject:</strong> ${subject}</p>
       <hr/>
       <p>${message.replace(/\n/g, '<br/>')}</p>`
    )

    log.info('Contact form submitted', { email, subject })
    return NextResponse.json({ success: true })
  } catch (err) {
    log.error('Contact route error', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
