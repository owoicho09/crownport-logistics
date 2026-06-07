'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Package, Loader2, CheckCircle } from 'lucide-react'
import { SERVICE_LABELS, ServiceType } from '@/types/database'

const schema = z.object({
  // Sender
  sender_name: z.string().min(2, 'Required'),
  sender_email: z.string().email('Valid email required'),
  sender_phone: z.string().min(6, 'Required'),
  sender_address: z.string().min(5, 'Required'),
  sender_city: z.string().min(2, 'Required'),
  sender_country: z.string().min(2, 'Required'),
  sender_postal_code: z.string().optional(),
  // Recipient
  recipient_name: z.string().min(2, 'Required'),
  recipient_email: z.string().email('Valid email required').or(z.literal('')).optional(),
  recipient_phone: z.string().min(6, 'Required'),
  recipient_address: z.string().min(5, 'Required'),
  recipient_city: z.string().min(2, 'Required'),
  recipient_country: z.string().min(2, 'Required'),
  recipient_postal_code: z.string().optional(),
  // Package
  service_type: z.enum(['EXPRESS', 'STANDARD', 'FREIGHT', 'INTERNATIONAL', 'ECOMMERCE', 'SAMEDAY'] as const),
  weight_kg: z.number({ coerce: true }).positive('Required').optional(),
  length_cm: z.number({ coerce: true }).positive().optional(),
  width_cm: z.number({ coerce: true }).positive().optional(),
  height_cm: z.number({ coerce: true }).positive().optional(),
  declared_value: z.number({ coerce: true }).min(0).optional(),
  contents_description: z.string().min(3, 'Required'),
})

type FormData = z.infer<typeof schema>

const STEPS = ['Sender', 'Recipient', 'Package']

export default function ShipForm() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{ trackingCode: string } | null>(null)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors }, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { service_type: 'STANDARD' },
  })

  async function goNext() {
    let fields: (keyof FormData)[] = []
    if (step === 0) fields = ['sender_name', 'sender_email', 'sender_phone', 'sender_address', 'sender_city', 'sender_country']
    if (step === 1) fields = ['recipient_name', 'recipient_phone', 'recipient_address', 'recipient_city', 'recipient_country']
    const ok = await trigger(fields)
    if (ok) setStep((s) => s + 1)
  }

  async function onSubmit(data: FormData) {
    setServerError('')
    setLoading(true)
    try {
      const res = await fetch('/api/ship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Submission failed')
      setSuccess({ trackingCode: json.trackingCode })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Shipment Created!</h2>
        <p className="text-[#6a7a8a] mb-6">
          Your shipment has been submitted and is under review. Check your email for details.
        </p>
        <div className="bg-[#1e2d3d] border border-[#c9a84c30] rounded-xl p-5 mb-6 inline-block">
          <p className="text-[#6a7a8a] text-xs uppercase tracking-widest mb-1">Your Tracking Code</p>
          <p className="text-2xl font-bold font-mono text-[#c9a84c]">{success.trackingCode}</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href={`/track/${success.trackingCode}`} className="btn-gold">
            <Package size={18} /> Track Shipment
          </a>
          <button onClick={() => { setSuccess(null); setStep(0) }} className="btn-outline">
            Ship Another
          </button>
        </div>
      </div>
    )
  }

  const fieldClass = (err?: { message?: string }) =>
    `input-field ${err ? 'border-red-500/60' : ''}`

  return (
    <div className="card">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                i < step
                  ? 'step-completed'
                  : i === step
                  ? 'step-active'
                  : 'step-pending'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${i === step ? 'text-[#c9a84c]' : 'text-[#4a5a6a]'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-[#2d4058] mx-1" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 0: Sender */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-5">Sender Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Full Name *</label>
                <input {...register('sender_name')} className={fieldClass(errors.sender_name)} placeholder="John Smith" />
                {errors.sender_name && <p className="text-red-400 text-xs mt-1">{errors.sender_name.message}</p>}
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Email *</label>
                <input {...register('sender_email')} type="email" className={fieldClass(errors.sender_email)} placeholder="john@email.com" />
                {errors.sender_email && <p className="text-red-400 text-xs mt-1">{errors.sender_email.message}</p>}
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Phone *</label>
                <input {...register('sender_phone')} className={fieldClass(errors.sender_phone)} placeholder="+1 555 000 0000" />
                {errors.sender_phone && <p className="text-red-400 text-xs mt-1">{errors.sender_phone.message}</p>}
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Postal Code</label>
                <input {...register('sender_postal_code')} className="input-field" placeholder="10001" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[#8899aa] text-xs mb-1.5">Street Address *</label>
                <input {...register('sender_address')} className={fieldClass(errors.sender_address)} placeholder="123 Main Street" />
                {errors.sender_address && <p className="text-red-400 text-xs mt-1">{errors.sender_address.message}</p>}
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">City *</label>
                <input {...register('sender_city')} className={fieldClass(errors.sender_city)} placeholder="New York" />
                {errors.sender_city && <p className="text-red-400 text-xs mt-1">{errors.sender_city.message}</p>}
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Country *</label>
                <input {...register('sender_country')} className={fieldClass(errors.sender_country)} placeholder="United States" />
                {errors.sender_country && <p className="text-red-400 text-xs mt-1">{errors.sender_country.message}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Recipient */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-5">Recipient Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Full Name *</label>
                <input {...register('recipient_name')} className={fieldClass(errors.recipient_name)} placeholder="Jane Doe" />
                {errors.recipient_name && <p className="text-red-400 text-xs mt-1">{errors.recipient_name.message}</p>}
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Email</label>
                <input {...register('recipient_email')} type="email" className="input-field" placeholder="jane@email.com" />
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Phone *</label>
                <input {...register('recipient_phone')} className={fieldClass(errors.recipient_phone)} placeholder="+44 20 0000 0000" />
                {errors.recipient_phone && <p className="text-red-400 text-xs mt-1">{errors.recipient_phone.message}</p>}
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Postal Code</label>
                <input {...register('recipient_postal_code')} className="input-field" placeholder="SW1A 1AA" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[#8899aa] text-xs mb-1.5">Street Address *</label>
                <input {...register('recipient_address')} className={fieldClass(errors.recipient_address)} placeholder="456 High Street" />
                {errors.recipient_address && <p className="text-red-400 text-xs mt-1">{errors.recipient_address.message}</p>}
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">City *</label>
                <input {...register('recipient_city')} className={fieldClass(errors.recipient_city)} placeholder="London" />
                {errors.recipient_city && <p className="text-red-400 text-xs mt-1">{errors.recipient_city.message}</p>}
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Country *</label>
                <input {...register('recipient_country')} className={fieldClass(errors.recipient_country)} placeholder="United Kingdom" />
                {errors.recipient_country && <p className="text-red-400 text-xs mt-1">{errors.recipient_country.message}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Package */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-5">Package Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[#8899aa] text-xs mb-1.5">Service Type *</label>
                <select {...register('service_type')} className="input-field">
                  {(Object.entries(SERVICE_LABELS) as [ServiceType, string][]).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Weight (kg)</label>
                <input {...register('weight_kg')} type="number" step="0.1" min="0" className="input-field" placeholder="2.5" />
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Declared Value (USD)</label>
                <input {...register('declared_value')} type="number" step="0.01" min="0" className="input-field" placeholder="150.00" />
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Length (cm)</label>
                <input {...register('length_cm')} type="number" step="0.1" min="0" className="input-field" placeholder="30" />
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Width (cm)</label>
                <input {...register('width_cm')} type="number" step="0.1" min="0" className="input-field" placeholder="20" />
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Height (cm)</label>
                <input {...register('height_cm')} type="number" step="0.1" min="0" className="input-field" placeholder="15" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[#8899aa] text-xs mb-1.5">Contents Description *</label>
                <textarea
                  {...register('contents_description')}
                  className={`input-field min-h-[80px] resize-none ${errors.contents_description ? 'border-red-500/60' : ''}`}
                  placeholder="Describe the package contents (e.g. clothing, electronics, documents)"
                />
                {errors.contents_description && (
                  <p className="text-red-400 text-xs mt-1">{errors.contents_description.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {serverError && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mt-4">
            {serverError}
          </p>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-[#243448]">
          {step > 0 && (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-outline">
              Back
            </button>
          )}
          {step < 2 ? (
            <button type="button" onClick={goNext} className="btn-gold ml-auto">
              Next: {STEPS[step + 1]}
            </button>
          ) : (
            <button type="submit" className="btn-gold ml-auto" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Package size={18} />}
              {loading ? 'Submitting...' : 'Submit Shipment'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
