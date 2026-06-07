import type { Metadata } from 'next'
import ShipForm from '@/components/public/ShipForm'

export const metadata: Metadata = {
  title: 'Ship a Package',
  description: 'Submit a shipment request with Crownport Logistics. Get a tracking code instantly.',
}

export default function ShipPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-10">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-3">Ship with Us</p>
        <h1 className="text-4xl font-bold text-white mb-4">Create a New Shipment</h1>
        <p className="text-[#6a7a8a]">
          Fill out the form below to submit your shipment. You&apos;ll receive a tracking code by email instantly.
        </p>
      </div>
      <ShipForm />
    </div>
  )
}
