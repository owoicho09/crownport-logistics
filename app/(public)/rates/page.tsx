import type { Metadata } from 'next'
import RateCalculator from '@/components/public/RateCalculator'

export const metadata: Metadata = {
  title: 'Rate Calculator',
  description: 'Calculate shipping costs with Crownport Logistics rate calculator.',
}

export default function RatesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-12">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-3">Rates</p>
        <h1 className="text-4xl font-bold text-white mb-4">Shipping Rate Calculator</h1>
        <p className="text-[#6a7a8a] text-lg max-w-xl mx-auto">
          Get an instant estimate for your shipment based on our current rate table.
        </p>
      </div>
      <RateCalculator />
    </div>
  )
}
