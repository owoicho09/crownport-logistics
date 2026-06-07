'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import type { Location } from '@/types/database'

interface Props { locations: Location[] }

const EMPTY = {
  name: '', address: '', city: '', country: '',
  phone: '', email: '', hours: '', services: '', is_active: true,
}

export default function LocationsManager({ locations }: Props) {
  const router = useRouter()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function add() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          services: form.services ? form.services.split(',').map((s) => s.trim()).filter(Boolean) : [],
        }),
      })
      if (!res.ok) throw new Error()
      setShowAdd(false)
      setForm({ ...EMPTY })
      router.refresh()
    } catch { alert('Failed to add location') }
    finally { setSaving(false) }
  }

  async function del(id: string) {
    if (!confirm('Delete location?')) return
    setDeleting(id)
    try { await fetch(`/api/admin/locations/${id}`, { method: 'DELETE' }); router.refresh() }
    catch { alert('Failed') }
    finally { setDeleting(null) }
  }

  const f = (key: string, value: string) => setForm({ ...form, [key]: value })

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowAdd(!showAdd)} className="btn-gold text-sm py-2 px-4">
          <Plus size={14} /> Add Location
        </button>
      </div>

      {showAdd && (
        <div className="card mb-4">
          <h3 className="text-white font-semibold mb-4 text-sm">Add Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { key: 'name', label: 'Name', placeholder: 'e.g. London Hub' },
              { key: 'address', label: 'Street Address' },
              { key: 'city', label: 'City' },
              { key: 'country', label: 'Country' },
              { key: 'phone', label: 'Phone' },
              { key: 'email', label: 'Email' },
              { key: 'hours', label: 'Hours', placeholder: 'e.g. Mon–Fri 8am–6pm' },
              { key: 'services', label: 'Services (comma-separated)', placeholder: 'Drop-off, Pickup, Packing' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-[#8899aa] text-xs mb-1">{label}</label>
                <input
                  value={(form as unknown as Record<string, string>)[key]}
                  onChange={(e) => f(key, e.target.value)}
                  placeholder={placeholder}
                  className="input-field text-sm py-2"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="btn-outline text-sm py-2 px-4">Cancel</button>
            <button onClick={add} disabled={saving} className="btn-gold text-sm py-2 px-4">
              {saving ? <Loader2 size={14} className="animate-spin" /> : 'Add Location'}
            </button>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#243448] bg-[#1e2d3d]/50">
              <tr>
                {['Name', 'Address', 'Contact', 'Hours', 'Active', ''].map((h) => (
                  <th key={h} className="text-left py-2.5 px-3 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {locations.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-[#4a5a6a]">No locations added yet.</td></tr>
              ) : locations.map((l) => (
                <tr key={l.id} className="border-b border-[#1e2d3d]">
                  <td className="py-2.5 px-3">
                    <div className="text-[#c0d0e0] font-medium">{l.name}</div>
                    <div className="text-[#5a6a7a] text-xs">{l.city}, {l.country}</div>
                  </td>
                  <td className="py-2.5 px-3 text-[#6a7a8a] text-xs">{l.address}</td>
                  <td className="py-2.5 px-3 text-[#6a7a8a] text-xs">
                    {l.phone && <div>{l.phone}</div>}
                    {l.email && <div>{l.email}</div>}
                  </td>
                  <td className="py-2.5 px-3 text-[#6a7a8a] text-xs">{l.hours ?? '—'}</td>
                  <td className="py-2.5 px-3">
                    <span className={`badge ${l.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      {l.is_active ? 'Active' : 'Off'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <button onClick={() => del(l.id)} disabled={deleting === l.id} className="text-red-400 hover:text-red-300 disabled:opacity-40">
                      {deleting === l.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
