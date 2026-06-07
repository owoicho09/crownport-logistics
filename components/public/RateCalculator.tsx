'use client'

import { useState } from 'react'
import { Calculator, Loader2 } from 'lucide-react'
import { SERVICE_LABELS, ServiceType } from '@/types/database'

interface RateResult {
  estimatedMin: number
  estimatedMax: number
  currency: string
  service: ServiceType
  transitTime: string
  found: boolean
}

const SERVICES = Object.entries(SERVICE_LABELS) as [ServiceType, string][]

export default function RateCalculator() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [weight, setWeight] = useState('')
  const [service, setService] = useState<ServiceType>('STANDARD')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RateResult | null>(null)
  const [error, setError] = useState('')

  async function calculate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setResult(null)
    if (!origin || !destination || !weight) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/rates/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, weight: parseFloat(weight), service }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Calculation failed')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate rate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <form onSubmit={calculate} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[#8899aa] text-xs font-semibold uppercase tracking-wider mb-2">
              Origin Country
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. United States"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-[#8899aa] text-xs font-semibold uppercase tracking-wider mb-2">
              Destination Country
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. United Kingdom"
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[#8899aa] text-xs font-semibold uppercase tracking-wider mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 2.5"
              min="0.1"
              step="0.1"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-[#8899aa] text-xs font-semibold uppercase tracking-wider mb-2">
              Service Type
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value as ServiceType)}
              className="input-field"
            >
              {SERVICES.map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button type="submit" className="btn-gold w-full py-3" disabled={loading}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Calculator size={18} />}
          {loading ? 'Calculating...' : 'Calculate Rate'}
        </button>
      </form>

      {result && (
        <div className="mt-6 pt-6 border-t border-[#243448]">
          {result.found ? (
            <div className="rounded-xl bg-[#1e2d3d] border border-[#c9a84c30] p-6 text-center">
              <p className="text-[#6a7a8a] text-xs uppercase tracking-widest mb-2">Estimated Shipping Cost</p>
              <p className="text-3xl font-bold text-white mb-1">
                {result.currency} {result.estimatedMin.toFixed(2)}
                {result.estimatedMin !== result.estimatedMax && (
                  <span> – {result.estimatedMax.toFixed(2)}</span>
                )}
              </p>
              <p className="text-[#8899aa] text-sm">
                {SERVICE_LABELS[result.service]} · {result.transitTime}
              </p>
              <p className="text-[#5a6a7a] text-xs mt-3">
                * Estimate only. Final price may vary based on actual dimensions and customs fees.
              </p>
              <a href="/ship" className="btn-gold mt-5 inline-flex">
                Ship Now
              </a>
            </div>
          ) : (
            <div className="rounded-xl bg-[#1e2d3d] border border-[#243448] p-6 text-center">
              <p className="text-[#c9a84c] font-semibold mb-2">Rate Not Available Online</p>
              <p className="text-[#6a7a8a] text-sm">
                We don't have a published rate for this route/service combination. Please contact us for a custom quote.
              </p>
              <a href="/contact" className="btn-outline mt-4 inline-flex">Contact Sales</a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
