'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Send, CheckCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(3, 'Required'),
  message: z.string().min(10, 'Please write at least 10 characters'),
})

type FormData = z.infer<typeof schema>

export default function ContactForm() {
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
      const res = await fetch('/api/contact', {
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
        <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
        <h3 className="text-white font-bold text-lg mb-2">Message Sent!</h3>
        <p className="text-[#6a7a8a]">Thank you for reaching out. We'll respond within 24 hours.</p>
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
            <input {...register('name')} className={f(errors.name)} placeholder="Full name" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-[#8899aa] text-xs mb-1.5">Email *</label>
            <input {...register('email')} type="email" className={f(errors.email)} placeholder="your@email.com" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-[#8899aa] text-xs mb-1.5">Subject *</label>
          <input {...register('subject')} className={f(errors.subject)} placeholder="How can we help?" />
          {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
        </div>
        <div>
          <label className="block text-[#8899aa] text-xs mb-1.5">Message *</label>
          <textarea
            {...register('message')}
            className={`${f(errors.message)} min-h-[140px] resize-none`}
            placeholder="Tell us about your enquiry..."
          />
          {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
        </div>

        {serverError && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {serverError}
          </p>
        )}

        <button type="submit" className="btn-gold w-full py-3" disabled={loading}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
