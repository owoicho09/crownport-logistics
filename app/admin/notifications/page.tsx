import { createClient } from '@/lib/supabase/server'
import NotificationTemplatesEditor from '@/components/admin/NotificationTemplatesEditor'
import type { NotificationTemplate } from '@/types/database'

export const dynamic = 'force-dynamic'

async function getTemplates() {
  const supabase = await createClient()
  const { data } = await supabase.from('notification_templates').select('*').order('notification_type')
  return (data as NotificationTemplate[]) ?? []
}

export default async function NotificationsPage() {
  const templates = await getTemplates()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Notification Templates</h1>
        <p className="text-[#6a7a8a] text-sm mt-1">
          Configure which notifications fire automatically and edit email templates.
          Supported variables: {'{{tracking_code}}'}, {'{{recipient_name}}'}, {'{{sender_name}}'}, {'{{estimated_delivery}}'}, {'{{status_message}}'}, {'{{event_location}}'}, {'{{carrier}}'}, {'{{tracking_url}}'}, {'{{company_email}}'}
        </p>
      </div>
      <NotificationTemplatesEditor templates={templates} />
    </div>
  )
}
