'use client'

import { useState, useMemo } from 'react'
import { Search, MapPin, Clock } from 'lucide-react'
import { Destination } from '@/types/database'

const REGIONS = ['Africa', 'Americas', 'Asia Pacific', 'Europe', 'Middle East'] as const

interface Props {
  destinations: Destination[]
}

export default function DestinationsClient({ destinations }: Props) {
  const [query, setQuery] = useState('')
  const [activeRegion, setActiveRegion] = useState<string>('All')

  const filtered = useMemo(() => {
    let result = destinations
    if (activeRegion !== 'All') {
      result = result.filter((d) => d.region === activeRegion)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter((d) => d.country_name.toLowerCase().includes(q))
    }
    return result
  }, [destinations, query, activeRegion])

  const grouped = useMemo(() => {
    const map: Record<string, Destination[]> = {}
    REGIONS.forEach((r) => {
      map[r] = filtered.filter((d) => d.region === r)
    })
    return map
  }, [filtered])

  const regionCounts = useMemo(() => {
    const map: Record<string, number> = { All: destinations.length }
    REGIONS.forEach((r) => {
      map[r] = destinations.filter((d) => d.region === r).length
    })
    return map
  }, [destinations])

  return (
    <div>
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5a6a] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search countries..."
            className="input-field"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...REGIONS].map((r) => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                activeRegion === r
                  ? 'bg-[#c9a84c] text-[#0f1923]'
                  : 'bg-[#1e2d3d] border border-[#2d4058] text-[#8899aa] hover:border-[#c9a84c40] hover:text-white'
              }`}
            >
              {r} <span className="opacity-70">({regionCounts[r] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {query && (
        <p className="text-[#6a7a8a] text-sm mb-6">
          {filtered.length} {filtered.length === 1 ? 'country' : 'countries'} matching &quot;{query}&quot;
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#4a5a6a]">
          <MapPin size={40} className="mx-auto mb-4 opacity-40" />
          <p>No destinations found. Try a different search.</p>
        </div>
      ) : (
        <div className="space-y-14">
          {REGIONS.map((region) => {
            const items = grouped[region]
            if (!items || items.length === 0) return null
            return (
              <div key={region}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-1.5 h-6 rounded bg-gradient-to-b from-[#c9a84c] to-[#e8c96e] inline-block" />
                  <h2 className="text-xl font-bold text-white">{region}</h2>
                  <span className="text-[#4a5a6a] text-sm font-normal">
                    ({items.length} {items.length === 1 ? 'country' : 'countries'})
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {items.map((dest) => (
                    <div
                      key={dest.id}
                      className="card p-4 hover:border-[#c9a84c30] hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl leading-none">{dest.flag_emoji ?? '🌍'}</span>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{dest.country_name}</p>
                          <div className="flex items-center gap-1 text-[#6a7a8a] text-xs mt-0.5">
                            <Clock size={11} />
                            <span>
                              {dest.transit_time_min}–{dest.transit_time_max} {dest.transit_unit}
                            </span>
                          </div>
                        </div>
                      </div>
                      {dest.special_notes && (
                        <div className="pt-2 border-t border-[#243448]">
                          <p className="text-[#5a6a7a] text-xs leading-relaxed">{dest.special_notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
