'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, UserX, UserCheck } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { AdminProfile } from '@/types/database'

interface Props { users: AdminProfile[] }

export default function UsersManager({ users }: Props) {
  const router = useRouter()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function addUser() {
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed')
      setShowAdd(false)
      setForm({ full_name: '', email: '', password: '' })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(id: string, current: boolean) {
    setToggling(id)
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !current }),
      })
      router.refresh()
    } catch { alert('Failed') }
    finally { setToggling(null) }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowAdd(!showAdd)} className="btn-gold text-sm py-2 px-4">
          <Plus size={14} /> Add Admin User
        </button>
      </div>

      {showAdd && (
        <div className="card mb-4">
          <h3 className="text-white font-semibold mb-4 text-sm">Create Admin User</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-[#8899aa] text-xs mb-1">Full Name</label>
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field text-sm py-2" />
            </div>
            <div>
              <label className="block text-[#8899aa] text-xs mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field text-sm py-2" />
            </div>
            <div>
              <label className="block text-[#8899aa] text-xs mb-1">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field text-sm py-2" />
            </div>
          </div>
          {error && <p className="text-red-400 text-xs mb-3 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">{error}</p>}
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="btn-outline text-sm py-2 px-4">Cancel</button>
            <button onClick={addUser} disabled={saving} className="btn-gold text-sm py-2 px-4">
              {saving ? <Loader2 size={14} className="animate-spin" /> : 'Create User'}
            </button>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#243448] bg-[#1e2d3d]/50">
            <tr>
              {['Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-[#5a6a7a] font-medium text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#1e2d3d]">
                <td className="py-3 px-4 text-[#c0d0e0] font-medium">{u.full_name}</td>
                <td className="py-3 px-4 text-[#6a7a8a]">{u.email}</td>
                <td className="py-3 px-4"><span className="badge bg-[#c9a84c15] text-[#c9a84c]">{u.role}</span></td>
                <td className="py-3 px-4">
                  <span className={`badge ${u.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#5a6a7a] text-xs">{formatDate(u.created_at)}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleActive(u.id, u.is_active)}
                    disabled={toggling === u.id}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded border transition-colors ${
                      u.is_active
                        ? 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                        : 'border-green-500/20 text-green-400 hover:bg-green-500/10'
                    }`}
                  >
                    {toggling === u.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : u.is_active ? (
                      <><UserX size={12} /> Deactivate</>
                    ) : (
                      <><UserCheck size={12} /> Activate</>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
