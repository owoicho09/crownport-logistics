import type { Metadata } from 'next'
import PickupForm from '@/components/public/PickupForm'

export const metadata: Metadata = {
  title: 'Schedule a Pickup',
  description: 'Schedule a courier pickup with Crownport Logistics at your location.',
}

export default function PickupPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-10">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-3">We Come to You</p>
        <h1 className="text-4xl font-bold text-white mb-4">Schedule a Pickup</h1>
        <p className="text-[#6a7a8a]">
          Fill in your details and preferred pickup window. Our team will confirm shortly.
        </p>
      </div>
      <PickupForm />
    </div>
  )
}
