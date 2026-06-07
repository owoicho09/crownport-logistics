'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { SERVICE_LABELS, ServiceType, type RateEntry } from '@/types/database'

interface Props { rates: RateEntry[] }

const EMPTY_RATE = {
  origin_zone: '',
  destination_zone: '',
  service_type: 'STANDARD' as ServiceType,
  base_fee: 0,
  per_kg_rate: 0,
  min_weight: 0,
  max_weight: '',
  currency: 'USD',
  is_active: true,
}

export default function RatesManager({ rates }: Props) {
  const router = useRouter()
  const [showAdd, setShowAdd] = useState(false)
  const [newRate, setNewRate] = useState({ ...EMPTY_RATE })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function addRate() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRate,
          max_weight: newRate.max_weight ? parseFloat(String(newRate.max_weight)) : null,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setShowAdd(false)
      setNewRate({ ...EMPTY_RATE })
      router.refresh()
    } catch { alert('Failed to add rate') }
    finally { setSaving(false) }
  }

  async function deleteRate(id: string) {
    if (!confirm('Delete this rate?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/rates/${id}`, { method: 'DELETE' })
      router.refresh()
    } catch { alert('Failed') }
    finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowAdd(!showAdd)} className="btn-gold text-sm py-2 px-4">
          <Plus size={14} /> Add Rate
        </button>
      </div>

      {showAdd && (
        <div className="card mb-4">
          <h3 className="text-white font-semibold mb-4 text-sm">New Rate Entry</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { key: 'origin_zone', label: 'Origin Zone', placeholder: 'e.g. USA or Worldwide' },
              { key: 'destination_zone', label: 'Destination Zone', placeholder: 'e.g. UK or Worldwide' },
              { key: 'base_fee', label: 'Base Fee', type: 'number' },
              { key: 'per_kg_rate', label: 'Per Kg Rate', type: 'number' },
              { key: 'min_weight', label: 'Min Weight (kg)', type: 'number' },
              { key: 'max_weight', label: 'Max Weight (kg)', type: 'number' },
              { key: 'currency', label: 'Currency', placeholder: 'USD' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-[#8899aa] text-xs mb-1">{label}</label>
                <input
                  type={type ?? 'text'}
                  step={type === 'number' ? '0.01' : undefined}
                  value={(newRate as Record<string, unknown>)[key] as string}
                  onChange={(e) => setNewRate({ ...newRate, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="input-field text-sm py-2"
                />
              </div>
            ))}
            <div>
              <label className="block text-[#8899aa] text-xs mb-1">Service</label>
              <select
                value={newRate.service_type}
                onChange={(e) => setNewRate({ ...newRate, service_type: e.target.value as ServiceType })}
                className="input-field text-sm py-2"
              >
                {(Object.entries(SERVICE_LABELS) as [ServiceType, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="btn-outline text-sm py-2 px-4">Cancel</button>
            <button onClick={addRate} disabled={saving} className="btn-gold text-sm py-2 px-4">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add
            </button>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#243448] bg-[#1e2d3d]/50">
              <tr>
                {['Service', 'Origin', 'Destination', 'Base Fee', 'Per Kg', 'Weight Range', 'Currency', 'Active', ''].map((h) => (
                  <th key={h} className="text-left py-2.5 px-3 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rates.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-10 text-[#4a5a6a]">No rates configured yet.</td></tr>
              ) : rates.map((r) => (
                <tr key={r.id} className="border-b border-[#1e2d3d]">
                  <td className="py-2.5 px-3 text-[#c0d0e0]">{SERVICE_LABELS[r.service_type]}</td>
                  <td className="py-2.5 px-3 text-[#8899aa]">{r.origin_zone}</td>
                  <td className="py-2.5 px-3 text-[#8899aa]">{r.destination_zone}</td>
                  <td className="py-2.5 px-3 text-[#c9a84c]">${r.base_fee}</td>
                  <td className="py-2.5 px-3 text-[#c9a84c]">${r.per_kg_rate}/kg</td>
                  <td className="py-2.5 px-3 text-[#6a7a8a] text-xs">
                    {r.min_weight}–{r.max_weight ?? '∞'} kg
                  </td>
                  <td className="py-2.5 px-3 text-[#6a7a8a]">{r.currency}</td>
                  <td className="py-2.5 px-3">
                    <span className={`badge ${r.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      {r.is_active ? 'Active' : 'Off'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <button onClick={() => deleteRate(r.id)} disabled={deleting === r.id} className="text-red-400 hover:text-red-300 disabled:opacity-40">
                      {deleting === r.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
