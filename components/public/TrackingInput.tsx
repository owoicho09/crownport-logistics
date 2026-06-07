'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Package } from 'lucide-react'

interface Props {
  defaultValue?: string
  size?: 'large' | 'default'
}

export default function TrackingInput({ defaultValue = '', size = 'default' }: Props) {
  const [code, setCode] = useState(defaultValue)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return
    router.push(`/track/${trimmed}`)
  }

  const isLarge = size === 'large'

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex gap-2 ${isLarge ? 'flex-col sm:flex-row' : ''}`}>
        <div className="relative flex-1">
          <Package
            size={isLarge ? 20 : 16}
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c] pointer-events-none`}
          />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter tracking code (e.g. EX00000001AAUS)"
            className={`input-field ${isLarge ? 'text-base py-4 pl-12 pr-4' : 'pl-10 pr-4 py-2.5 text-sm'}`}
            style={{ borderRadius: isLarge ? '8px' : '6px' }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button
          type="submit"
          className={`btn-gold whitespace-nowrap ${isLarge ? 'py-4 px-8 text-base sm:w-auto w-full' : 'py-2.5 px-5 text-sm'}`}
          style={{ borderRadius: isLarge ? '8px' : '6px' }}
        >
          <Search size={isLarge ? 18 : 15} />
          Track
        </button>
      </div>
    </form>
  )
}
