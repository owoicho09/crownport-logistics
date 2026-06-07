'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import type { Destination } from '@/types/database'

interface Props { destinations: Destination[] }

const REGIONS = ['Africa', 'Americas', 'Asia Pacific', 'Europe', 'Middle East', 'Oceania']

const EMPTY = {
  country_name: '', country_code: '', region: 'Africa',
  flag_emoji: '', transit_time_min: '', transit_time_max: '',
  transit_unit: 'business days', special_notes: '', is_active: true,
}

export default function DestinationsManager({ destinations }: Props) {
  const router = useRouter()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function add() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          transit_time_min: form.transit_time_min ? parseInt(form.transit_time_min) : null,
          transit_time_max: form.transit_time_max ? parseInt(form.transit_time_max) : null,
        }),
      })
      if (!res.ok) throw new Error()
      setShowAdd(false)
      setForm({ ...EMPTY })
      router.refresh()
    } catch { alert('Failed') }
    finally { setSaving(false) }
  }

  async function del(id: string) {
    if (!confirm('Delete destination?')) return
    setDeleting(id)
    try { await fetch(`/api/admin/destinations/${id}`, { method: 'DELETE' }); router.refresh() }
    catch { alert('Failed') }
    finally { setDeleting(null) }
  }

  const f = (key: string, value: string) => setForm({ ...form, [key]: value })

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowAdd(!showAdd)} className="btn-gold text-sm py-2 px-4">
          <Plus size={14} /> Add Country
        </button>
      </div>

      {showAdd && (
        <div className="card mb-4">
          <h3 className="text-white font-semibold mb-4 text-sm">Add Destination</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <div><label className="block text-[#8899aa] text-xs mb-1">Country Name</label><input value={form.country_name} onChange={(e) => f('country_name', e.target.value)} className="input-field text-sm py-2" /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1">Country Code (2-3 letters)</label><input value={form.country_code} onChange={(e) => f('country_code', e.target.value.toUpperCase())} className="input-field text-sm py-2" maxLength={3} /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1">Region</label><select value={form.region} onChange={(e) => f('region', e.target.value)} className="input-field text-sm py-2">{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></div>
            <div><label className="block text-[#8899aa] text-xs mb-1">Flag Emoji</label><input value={form.flag_emoji} onChange={(e) => f('flag_emoji', e.target.value)} className="input-field text-sm py-2" placeholder="🇺🇸" /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1">Min Transit Days</label><input type="number" value={form.transit_time_min} onChange={(e) => f('transit_time_min', e.target.value)} className="input-field text-sm py-2" /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1">Max Transit Days</label><input type="number" value={form.transit_time_max} onChange={(e) => f('transit_time_max', e.target.value)} className="input-field text-sm py-2" /></div>
            <div className="sm:col-span-3"><label className="block text-[#8899aa] text-xs mb-1">Special Notes</label><input value={form.special_notes} onChange={(e) => f('special_notes', e.target.value)} className="input-field text-sm py-2" placeholder="Optional notes displayed on the destinations page" /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="btn-outline text-sm py-2 px-4">Cancel</button>
            <button onClick={add} disabled={saving} className="btn-gold text-sm py-2 px-4">{saving ? <Loader2 size={14} className="animate-spin" /> : 'Add'}</button>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#243448] bg-[#1e2d3d]/50">
              <tr>
                {['Flag', 'Country', 'Code', 'Region', 'Transit', 'Active', ''].map((h) => (
                  <th key={h} className="text-left py-2.5 px-3 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {destinations.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-[#4a5a6a]">No destinations added yet.</td></tr>
              ) : destinations.map((d) => (
                <tr key={d.id} className="border-b border-[#1e2d3d]">
                  <td className="py-2.5 px-3 text-xl">{d.flag_emoji}</td>
                  <td className="py-2.5 px-3 text-[#c0d0e0]">{d.country_name}</td>
                  <td className="py-2.5 px-3 font-mono text-[#6a7a8a]">{d.country_code}</td>
                  <td className="py-2.5 px-3 text-[#6a7a8a]">{d.region}</td>
                  <td className="py-2.5 px-3 text-[#6a7a8a] text-xs">
                    {d.transit_time_min && d.transit_time_max ? `${d.transit_time_min}–${d.transit_time_max} ${d.transit_unit}` : '—'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`badge ${d.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      {d.is_active ? 'Active' : 'Off'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <button onClick={() => del(d.id)} disabled={deleting === d.id} className="text-red-400 hover:text-red-300 disabled:opacity-40">
                      {deleting === d.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
