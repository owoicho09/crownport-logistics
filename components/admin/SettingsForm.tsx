'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Check } from 'lucide-react'

interface Props {
  settings: Record<string, string>
}

const SETTING_GROUPS = [
  {
    title: 'Company',
    fields: [
      { key: 'company_name', label: 'Company Name' },
      { key: 'company_tagline', label: 'Tagline' },
      { key: 'company_email', label: 'Contact Email' },
      { key: 'company_phone', label: 'Phone Number' },
      { key: 'company_address', label: 'Address' },
    ],
  },
  {
    title: 'Social Media',
    fields: [
      { key: 'social_twitter', label: 'Twitter URL' },
      { key: 'social_linkedin', label: 'LinkedIn URL' },
      { key: 'social_facebook', label: 'Facebook URL' },
    ],
  },
  {
    title: 'Homepage Stats',
    fields: [
      { key: 'stat_countries', label: 'Countries Served' },
      { key: 'stat_shipments', label: 'Shipments Delivered' },
      { key: 'stat_years', label: 'Years in Operation' },
    ],
  },
  {
    title: 'Email Notifications',
    fields: [
      { key: 'notification_sender_name', label: 'Sender Name' },
      { key: 'notification_sender_email', label: 'Sender Email' },
      { key: 'admin_alert_email', label: 'Admin Alert Email' },
      { key: 'test_notification_email', label: 'Test Email Address' },
    ],
  },
]

export default function SettingsForm({ settings }: Props) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function saveSettings() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    } catch {
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      {SETTING_GROUPS.map((group) => (
        <div key={group.title} className="card">
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-4">{group.title}</h3>
          <div className="space-y-3">
            {group.fields.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-[#8899aa] text-xs mb-1.5">{label}</label>
                <input
                  type="text"
                  value={values[key] ?? ''}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                  className="input-field text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={saveSettings} className="btn-gold py-3 px-6" disabled={saving}>
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}
