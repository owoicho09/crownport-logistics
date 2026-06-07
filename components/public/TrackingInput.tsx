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

  if (size === 'large') {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className="flex flex-col sm:flex-row w-full overflow-hidden border border-[#2d4058] transition-all duration-150 focus-within:border-[#c9a84c] focus-within:shadow-[0_0_0_3px_rgba(201,168,76,0.1)]"
          style={{ borderRadius: '10px' }}
        >
          <div className="relative flex-1">
            <Package
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c] pointer-events-none z-10"
            />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter tracking code (e.g. EX00000001AAUS)"
              className="w-full bg-[#141f2e] text-[#d0dde8] text-base py-4 pr-4 outline-none border-b sm:border-b-0 sm:border-r border-[#2d4058]"
              style={{ paddingLeft: '3rem' }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button
            type="submit"
            className="btn-gold py-4 px-8 text-base shrink-0 w-full sm:w-auto whitespace-nowrap"
            style={{ borderRadius: 0 }}
          >
            <Search size={18} />
            Track Shipment
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Package
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c] pointer-events-none z-10"
          />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter tracking code"
            className="input-field pr-4 py-2.5 text-sm"
            style={{ paddingLeft: '2.25rem' }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button type="submit" className="btn-gold py-2.5 px-5 text-sm whitespace-nowrap">
          <Search size={15} />
          Track
        </button>
      </div>
    </form>
  )
}
