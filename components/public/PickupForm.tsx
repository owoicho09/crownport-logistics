'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle, Truck } from 'lucide-react'

const schema = z.object({
  contact_name: z.string().min(2, 'Required'),
  contact_phone: z.string().min(6, 'Required'),
  contact_email: z.string().email('Valid email required').optional().or(z.literal('')),
  pickup_address: z.string().min(5, 'Required'),
  pickup_city: z.string().min(2, 'Required'),
  pickup_country: z.string().min(2, 'Required'),
  preferred_date: z.string().min(1, 'Required'),
  preferred_time_from: z.string().optional(),
  preferred_time_to: z.string().optional(),
  special_instructions: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function PickupForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setServerError('')
    setLoading(true)
    try {
      const res = await fetch('/api/pickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Submission failed')
      setSuccess(true)
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
        <h2 className="text-xl font-bold text-white mb-2">Pickup Request Submitted!</h2>
        <p className="text-[#6a7a8a]">
          Our team will review your request and confirm the pickup time by email or phone.
        </p>
      </div>
    )
  }

  const f = (err?: { message?: string }) => `input-field ${err ? 'border-red-500/60' : ''}`

  return (
    <div className="card">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#8899aa] text-xs mb-1.5">Your Name *</label>
            <input {...register('contact_name')} className={f(errors.contact_name)} placeholder="Full name" />
            {errors.contact_name && <p className="text-red-400 text-xs mt-1">{errors.contact_name.message}</p>}
          </div>
          <div>
            <label className="block text-[#8899aa] text-xs mb-1.5">Phone *</label>
            <input {...register('contact_phone')} className={f(errors.contact_phone)} placeholder="+1 555 000 0000" />
            {errors.contact_phone && <p className="text-red-400 text-xs mt-1">{errors.contact_phone.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[#8899aa] text-xs mb-1.5">Email (for confirmation)</label>
            <input {...register('contact_email')} type="email" className="input-field" placeholder="your@email.com" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[#8899aa] text-xs mb-1.5">Pickup Address *</label>
            <input {...register('pickup_address')} className={f(errors.pickup_address)} placeholder="Street address" />
            {errors.pickup_address && <p className="text-red-400 text-xs mt-1">{errors.pickup_address.message}</p>}
          </div>
          <div>
            <label className="block text-[#8899aa] text-xs mb-1.5">City *</label>
            <input {...register('pickup_city')} className={f(errors.pickup_city)} placeholder="City" />
            {errors.pickup_city && <p className="text-red-400 text-xs mt-1">{errors.pickup_city.message}</p>}
          </div>
          <div>
            <label className="block text-[#8899aa] text-xs mb-1.5">Country *</label>
            <input {...register('pickup_country')} className={f(errors.pickup_country)} placeholder="Country" />
            {errors.pickup_country && <p className="text-red-400 text-xs mt-1">{errors.pickup_country.message}</p>}
          </div>
          <div>
            <label className="block text-[#8899aa] text-xs mb-1.5">Preferred Date *</label>
            <input {...register('preferred_date')} type="date" className={f(errors.preferred_date)} min={new Date().toISOString().split('T')[0]} />
            {errors.preferred_date && <p className="text-red-400 text-xs mt-1">{errors.preferred_date.message}</p>}
          </div>
          <div className="sm:col-span-2 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#8899aa] text-xs mb-1.5">From Time</label>
              <input {...register('preferred_time_from')} type="time" className="input-field" />
            </div>
            <div>
              <label className="block text-[#8899aa] text-xs mb-1.5">To Time</label>
              <input {...register('preferred_time_to')} type="time" className="input-field" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[#8899aa] text-xs mb-1.5">Special Instructions</label>
            <textarea
              {...register('special_instructions')}
              className="input-field resize-none min-h-[80px]"
              placeholder="Any special instructions or access notes..."
            />
          </div>
        </div>

        {serverError && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {serverError}
          </p>
        )}

        <button type="submit" className="btn-gold w-full py-3 mt-2" disabled={loading}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Truck size={18} />}
          {loading ? 'Submitting...' : 'Request Pickup'}
        </button>
      </form>
    </div>
  )
}
