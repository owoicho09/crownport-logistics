'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, ChevronDown, ChevronUp } from 'lucide-react'
import type { NotificationTemplate } from '@/types/database'

interface Props { templates: NotificationTemplate[] }

export default function NotificationTemplatesEditor({ templates }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(templates)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  function update(id: string, field: string, value: string | boolean) {
    setItems(items.map((t) => t.id === id ? { ...t, [field]: value } : t))
  }

  async function save(template: NotificationTemplate) {
    setSaving(template.id)
    try {
      await fetch(`/api/admin/notifications/${template.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_subject: template.email_subject,
          email_body: template.email_body,
          is_enabled: template.is_enabled,
        }),
      })
      router.refresh()
    } catch { alert('Save failed') }
    finally { setSaving(null) }
  }

  return (
    <div className="space-y-3">
      {items.map((t) => (
        <div key={t.id} className="card p-0 overflow-hidden">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1e2d3d]/50"
            onClick={() => setExpanded(expanded === t.id ? null : t.id)}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); update(t.id, 'is_enabled', !t.is_enabled) }}
                className={`w-9 h-5 rounded-full transition-colors relative ${t.is_enabled ? 'bg-[#c9a84c]' : 'bg-[#2d4058]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${t.is_enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              <div>
                <p className="text-white font-medium text-sm">{t.label}</p>
                <p className="text-[#5a6a7a] text-xs">{t.notification_type}</p>
              </div>
            </div>
            {expanded === t.id ? <ChevronUp size={16} className="text-[#5a6a7a]" /> : <ChevronDown size={16} className="text-[#5a6a7a]" />}
          </div>

          {expanded === t.id && (
            <div className="border-t border-[#243448] p-4 space-y-3">
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Subject</label>
                <input
                  type="text"
                  value={t.email_subject}
                  onChange={(e) => update(t.id, 'email_subject', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Email Body (HTML)</label>
                <textarea
                  value={t.email_body}
                  onChange={(e) => update(t.id, 'email_body', e.target.value)}
                  className="input-field text-sm font-mono text-xs resize-y min-h-[120px]"
                />
              </div>
              <button
                onClick={() => save(t)}
                disabled={saving === t.id}
                className="btn-gold text-sm py-2 px-4"
              >
                {saving === t.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save Template
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
