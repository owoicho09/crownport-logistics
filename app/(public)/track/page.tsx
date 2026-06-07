import type { Metadata } from 'next'
import TrackingInput from '@/components/public/TrackingInput'
import { Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Track Your Shipment',
  description: 'Enter your Crownport tracking number to get real-time shipment status updates.',
}

export default function TrackPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#c9a84c15] border border-[#c9a84c30] flex items-center justify-center mx-auto mb-6">
          <Package size={32} className="text-[#c9a84c]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Track Your Shipment</h1>
        <p className="text-[#6a7a8a] mb-8">
          Enter your Crownport tracking code below for real-time status updates.
        </p>
        <TrackingInput size="large" />
        <p className="text-[#4a5a6a] text-xs mt-4">
          Your tracking code was included in your confirmation email.
        </p>
      </div>
    </div>
  )
}
