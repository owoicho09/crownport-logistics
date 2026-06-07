import { Resend } from 'resend'
import { logger } from '@/lib/logger'
import { createAdminClient } from '@/lib/supabase/admin'
import { NotificationType, Shipment, NotificationTemplate } from '@/types/database'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailVariables {
  tracking_code: string
  tracking_url: string
  sender_name: string
  recipient_name: string
  estimated_delivery: string
  status_message: string
  event_location: string
  carrier: string
  company_email: string
  pod_url?: string
}

function interpolate(template: string, vars: EmailVariables): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return (vars as unknown as Record<string, string>)[key] ?? ''
  })
}

export async function sendNotification(
  shipment: Shipment,
  notificationType: NotificationType,
  overrides?: { recipientEmail?: string; subject?: string; body?: string },
  isTest?: boolean
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const supabase = createAdminClient()

  // Fetch template
  const { data: template } = await supabase
    .from('notification_templates')
    .select('*')
    .eq('notification_type', notificationType)
    .single<NotificationTemplate>()

  if (!template) {
    logger.error('Notification template not found', { notificationType })
    return { success: false, error: 'Template not found' }
  }

  // Fetch settings
  const { data: settings } = await supabase.from('settings').select('key, value')
  const settingsMap: Record<string, string> = {}
  if (settings) {
    for (const s of settings) {
      if (s.key && s.value !== null) settingsMap[s.key] = s.value
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const vars: EmailVariables = {
    tracking_code: shipment.tracking_code,
    tracking_url: `${siteUrl}/track/${shipment.tracking_code}`,
    sender_name: shipment.sender_name,
    recipient_name: shipment.recipient_name,
    estimated_delivery: shipment.estimated_delivery ?? 'TBD',
    status_message: shipment.exception_message ?? '',
    event_location: '',
    carrier: shipment.physical_carrier ?? 'Crownport Logistics',
    company_email: settingsMap['company_email'] ?? '',
    pod_url: shipment.pod_photo_url ?? undefined,
  }

  const fromName = settingsMap['notification_sender_name'] ?? process.env.RESEND_FROM_NAME ?? 'Crownport Logistics'
  const fromEmail = settingsMap['notification_sender_email'] ?? process.env.RESEND_FROM_EMAIL ?? 'noreply@crownportlogistics.site'

  const recipientEmail = overrides?.recipientEmail ?? shipment.recipient_email ?? shipment.sender_email
  if (!recipientEmail) {
    return { success: false, error: 'No recipient email' }
  }

  let subject = overrides?.subject ?? interpolate(template.email_subject, vars)
  const body = overrides?.body ?? interpolate(template.email_body, vars)

  if (isTest) {
    subject = `[TEST] ${subject}`
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: recipientEmail,
      subject,
      html: wrapEmailHtml(body, fromName),
    })

    if (error) {
      logger.error('Resend email failed', { error: error.message, shipmentId: shipment.id, notificationType })

      await supabase.from('notifications_log').insert({
        shipment_id: shipment.id,
        notification_type: notificationType,
        recipient_email: recipientEmail,
        recipient_name: shipment.recipient_name,
        email_subject: subject,
        status: 'failed',
        error_message: error.message,
        is_test: isTest ?? false,
      })

      return { success: false, error: error.message }
    }

    logger.info('Email sent successfully', { shipmentId: shipment.id, notificationType, messageId: data?.id })

    await supabase.from('notifications_log').insert({
      shipment_id: shipment.id,
      notification_type: notificationType,
      recipient_email: recipientEmail,
      recipient_name: shipment.recipient_name,
      email_subject: subject,
      resend_message_id: data?.id,
      status: 'sent',
      is_test: isTest ?? false,
    })

    return { success: true, messageId: data?.id }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    logger.error('Email send exception', { error: msg, shipmentId: shipment.id })
    return { success: false, error: msg }
  }
}

function wrapEmailHtml(body: string, companyName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Crownport Logistics</title>
</head>
<body style="margin:0;padding:0;background-color:#0f1923;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f1923;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background-color:#1a2535;border-radius:8px 8px 0 0;padding:32px;text-align:center;border-bottom:3px solid #c9a84c;">
              <h1 style="color:#c9a84c;margin:0;font-size:24px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">${companyName}</h1>
              <p style="color:#8899aa;margin:8px 0 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Global Courier Services</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#1e2d3d;padding:32px;color:#d0dde8;font-size:15px;line-height:1.7;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="background-color:#1a2535;border-radius:0 0 8px 8px;padding:24px;text-align:center;border-top:1px solid #243448;">
              <p style="color:#5a6a7a;margin:0;font-size:12px;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
              <p style="color:#5a6a7a;margin:8px 0 0;font-size:12px;">crownportlogistics.site</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendAdminAlert(subject: string, htmlBody: string) {
  const adminEmail = process.env.ADMIN_ALERT_EMAIL
  if (!adminEmail) return

  try {
    await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME ?? 'Crownport Logistics'} <${process.env.RESEND_FROM_EMAIL ?? 'noreply@crownportlogistics.site'}>`,
      to: adminEmail,
      subject,
      html: htmlBody,
    })
  } catch (err) {
    logger.error('Admin alert email failed', { error: err instanceof Error ? err.message : 'unknown' })
  }
}
