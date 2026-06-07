'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { PickupRequest } from '@/types/database'

interface Props { pickup: PickupRequest }

export default function PickupActions({ pickup }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function updateStatus(status: string) {
    setLoading(status)
    try {
      await fetch(`/api/admin/pickups/${pickup.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      router.refresh()
    } catch { alert('Failed to update') }
    finally { setLoading(null) }
  }

  if (pickup.status === 'COMPLETED' || pickup.status === 'CANCELLED') {
    return <span className="text-[#4a5a6a] text-xs">{pickup.status}</span>
  }

  return (
    <div className="flex gap-1.5">
      {pickup.status === 'PENDING' && (
        <button onClick={() => updateStatus('CONFIRMED')} className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20" disabled={!!loading}>
          {loading === 'CONFIRMED' ? <Loader2 size={12} className="animate-spin" /> : 'Confirm'}
        </button>
      )}
      {pickup.status === 'CONFIRMED' && (
        <button onClick={() => updateStatus('COMPLETED')} className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20" disabled={!!loading}>
          {loading === 'COMPLETED' ? <Loader2 size={12} className="animate-spin" /> : 'Complete'}
        </button>
      )}
      <button onClick={() => updateStatus('CANCELLED')} className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20" disabled={!!loading}>
        {loading === 'CANCELLED' ? <Loader2 size={12} className="animate-spin" /> : 'Cancel'}
      </button>
    </div>
  )
}
