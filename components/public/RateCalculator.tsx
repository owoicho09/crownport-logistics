'use client'

import { useState } from 'react'
import { Calculator, Loader2, Package, ChevronDown, ChevronUp } from 'lucide-react'
import { SERVICE_LABELS, ServiceType } from '@/types/database'

interface RateResult {
  estimatedMin: number
  estimatedMax: number
  currency: string
  service: ServiceType
  transitTime: string
  chargeableWeight: number
  volumetricWeight: number | null
  destinationRegion: string
  found: boolean
}

const SERVICES = Object.entries(SERVICE_LABELS) as [ServiceType, string][]

export default function RateCalculator() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [weight, setWeight] = useState('')
  const [service, setService] = useState<ServiceType>('STANDARD')
  const [showDimensions, setShowDimensions] = useState(false)
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RateResult | null>(null)
  const [error, setError] = useState('')

  async function calculate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setResult(null)
    if (!origin || !destination || !weight) {
      setError('Please fill in origin, destination, and weight.')
      return
    }
    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        origin,
        destination,
        weight: parseFloat(weight),
        service,
      }
      if (showDimensions && length && width && height) {
        body.length_cm = parseFloat(length)
        body.width_cm = parseFloat(width)
        body.height_cm = parseFloat(height)
      }

      const res = await fetch('/api/rates/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
              placeholder="e.g. United Kingdom"
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
              placeholder="e.g. Nigeria"
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[#8899aa] text-xs font-semibold uppercase tracking-wider mb-2">
              Actual Weight (kg)
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

        {/* Dimensions (optional) */}
        <div>
          <button
            type="button"
            onClick={() => setShowDimensions(!showDimensions)}
            className="flex items-center gap-2 text-[#8899aa] hover:text-[#c9a84c] text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Package size={13} />
            Package Dimensions (optional — for volumetric weight)
            {showDimensions ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {showDimensions && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {[
                { label: 'Length (cm)', value: length, setter: setLength },
                { label: 'Width (cm)', value: width, setter: setWidth },
                { label: 'Height (cm)', value: height, setter: setHeight },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label className="block text-[#6a7a8a] text-[11px] mb-1.5">{label}</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder="0"
                    min="1"
                    step="1"
                    className="input-field text-sm py-2"
                  />
                </div>
              ))}
            </div>
          )}
          {showDimensions && (
            <p className="text-[#4a5a6a] text-[11px] mt-2">
              Volumetric weight = L × W × H ÷ 5000. Chargeable weight = max(actual, volumetric).
            </p>
          )}
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
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {result.currency} {result.estimatedMin.toFixed(2)}
                {result.estimatedMin !== result.estimatedMax && (
                  <span className="text-2xl"> – {result.estimatedMax.toFixed(2)}</span>
                )}
              </p>
              <p className="text-[#8899aa] text-sm mt-1">
                {SERVICE_LABELS[result.service]} · {result.transitTime}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs text-[#5a6a7a]">
                <span>Chargeable weight: <strong className="text-[#8899aa]">{result.chargeableWeight} kg</strong></span>
                {result.volumetricWeight && (
                  <span>Volumetric: <strong className="text-[#8899aa]">{result.volumetricWeight} kg</strong></span>
                )}
                {result.destinationRegion && result.destinationRegion !== 'Unknown' && (
                  <span>Region: <strong className="text-[#8899aa]">{result.destinationRegion}</strong></span>
                )}
              </div>
              <p className="text-[#4a5a6a] text-xs mt-4">
                * Estimate only. Final price confirmed at booking. Customs duties not included.
              </p>
              <a href="/ship" className="btn-gold mt-5 inline-flex">
                Ship Now
              </a>
            </div>
          ) : (
            <div className="rounded-xl bg-[#1e2d3d] border border-[#243448] p-6 text-center">
              <p className="text-[#c9a84c] font-semibold mb-2">Custom Quote Required</p>
              <p className="text-[#6a7a8a] text-sm">
                We don't have a published rate for this route and service combination. Contact our team for a tailored quote.
              </p>
              <a href="/contact" className="btn-outline mt-4 inline-flex">Contact Sales</a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
