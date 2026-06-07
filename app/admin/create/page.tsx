'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Package, Loader2, CheckCircle } from 'lucide-react'
import { SERVICE_LABELS, ServiceType } from '@/types/database'

const schema = z.object({
  sender_name: z.string().min(2),
  sender_email: z.string().email().optional().or(z.literal('')),
  sender_phone: z.string().optional(),
  sender_address: z.string().min(5),
  sender_city: z.string().min(2),
  sender_country: z.string().min(2),
  sender_postal_code: z.string().optional(),
  recipient_name: z.string().min(2),
  recipient_email: z.string().email().optional().or(z.literal('')),
  recipient_phone: z.string().optional(),
  recipient_address: z.string().min(5),
  recipient_city: z.string().min(2),
  recipient_country: z.string().min(2),
  recipient_postal_code: z.string().optional(),
  service_type: z.enum(['EXPRESS', 'STANDARD', 'FREIGHT', 'INTERNATIONAL', 'ECOMMERCE', 'SAMEDAY'] as const),
  physical_carrier: z.string().optional(),
  physical_carrier_reference: z.string().optional(),
  weight_kg: z.number({ coerce: true }).positive().optional(),
  length_cm: z.number({ coerce: true }).positive().optional(),
  width_cm: z.number({ coerce: true }).positive().optional(),
  height_cm: z.number({ coerce: true }).positive().optional(),
  declared_value: z.number({ coerce: true }).min(0).optional(),
  contents_description: z.string().min(1),
  estimated_delivery: z.string().optional(),
  assigned_courier: z.string().optional(),
  internal_notes: z.string().optional(),
  is_test: z.boolean().default(false),
})

type FormData = z.infer<typeof schema>

export default function CreateShipmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { service_type: 'STANDARD', is_test: false },
  })

  async function onSubmit(data: FormData) {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/ship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed')
      setSuccess(json.trackingCode)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shipment')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Shipment Created!</h2>
        <p className="text-[#c9a84c] font-mono text-xl font-bold mb-4">{success}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push(`/admin/shipments`)} className="btn-gold">View All Shipments</button>
          <button onClick={() => setSuccess(null)} className="btn-outline">Create Another</button>
        </div>
      </div>
    )
  }

  const f = (err?: { message?: string }) => `input-field ${err ? 'border-red-500/60' : ''}`

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Create Shipment</h1>
        <p className="text-[#6a7a8a] text-sm mt-1">Manually create a new shipment record</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Sender */}
        <div className="card">
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-4">Sender</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Name *</label><input {...register('sender_name')} className={f(errors.sender_name)} />{errors.sender_name && <p className="text-red-400 text-xs mt-1">{errors.sender_name.message}</p>}</div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Email</label><input {...register('sender_email')} type="email" className="input-field" /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Phone</label><input {...register('sender_phone')} className="input-field" /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Postal Code</label><input {...register('sender_postal_code')} className="input-field" /></div>
            <div className="sm:col-span-2"><label className="block text-[#8899aa] text-xs mb-1.5">Address *</label><input {...register('sender_address')} className={f(errors.sender_address)} />{errors.sender_address && <p className="text-red-400 text-xs mt-1">{errors.sender_address.message}</p>}</div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">City *</label><input {...register('sender_city')} className={f(errors.sender_city)} /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Country *</label><input {...register('sender_country')} className={f(errors.sender_country)} /></div>
          </div>
        </div>

        {/* Recipient */}
        <div className="card">
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-4">Recipient</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Name *</label><input {...register('recipient_name')} className={f(errors.recipient_name)} /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Email</label><input {...register('recipient_email')} type="email" className="input-field" /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Phone</label><input {...register('recipient_phone')} className="input-field" /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Postal Code</label><input {...register('recipient_postal_code')} className="input-field" /></div>
            <div className="sm:col-span-2"><label className="block text-[#8899aa] text-xs mb-1.5">Address *</label><input {...register('recipient_address')} className={f(errors.recipient_address)} /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">City *</label><input {...register('recipient_city')} className={f(errors.recipient_city)} /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Country *</label><input {...register('recipient_country')} className={f(errors.recipient_country)} /></div>
          </div>
        </div>

        {/* Package & Service */}
        <div className="card">
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-4">Package & Service</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Service Type *</label><select {...register('service_type')} className="input-field">{(Object.entries(SERVICE_LABELS) as [ServiceType, string][]).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Physical Carrier</label><input {...register('physical_carrier')} className="input-field" placeholder="FedEx / UPS / Own Fleet" /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Carrier Reference</label><input {...register('physical_carrier_reference')} className="input-field" placeholder="Internal carrier tracking #" /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Est. Delivery Date</label><input {...register('estimated_delivery')} type="date" className="input-field" /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Weight (kg)</label><input {...register('weight_kg')} type="number" step="0.1" className="input-field" /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Declared Value (USD)</label><input {...register('declared_value')} type="number" step="0.01" className="input-field" /></div>
            <div className="sm:col-span-2"><label className="block text-[#8899aa] text-xs mb-1.5">Contents *</label><input {...register('contents_description')} className={f(errors.contents_description)} placeholder="Package contents description" /></div>
            <div><label className="block text-[#8899aa] text-xs mb-1.5">Assigned Courier</label><input {...register('assigned_courier')} className="input-field" /></div>
            <div className="flex items-center gap-2 pt-5"><input {...register('is_test')} type="checkbox" id="is_test" className="w-4 h-4 rounded" /><label htmlFor="is_test" className="text-[#8899aa] text-sm">Mark as test shipment</label></div>
            <div className="sm:col-span-2"><label className="block text-[#8899aa] text-xs mb-1.5">Internal Notes</label><textarea {...register('internal_notes')} className="input-field resize-none min-h-[60px]" /></div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>}

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
          <button type="submit" className="btn-gold" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Package size={16} />}
            {loading ? 'Creating...' : 'Create Shipment'}
          </button>
        </div>
      </form>
    </div>
  )
}
