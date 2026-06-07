import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ShipmentStatus } from '@/types/database'

const STEPS = [
  { key: 'LABEL_CREATED', label: 'Label Created', short: 'Created' },
  { key: 'PICKED_UP', label: 'Picked Up', short: 'Picked Up' },
  { key: 'IN_TRANSIT', label: 'In Transit', short: 'In Transit' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', short: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered', short: 'Delivered' },
]

const STATUS_STEP_INDEX: Partial<Record<ShipmentStatus, number>> = {
  PENDING_REVIEW: -1,
  LABEL_CREATED: 0,
  PICKED_UP: 1,
  ARRIVED_AT_HUB: 1,
  IN_TRANSIT: 2,
  CUSTOMS_CLEARANCE: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERY_ATTEMPTED: 3,
  DELIVERED: 4,
}

interface Props {
  status: ShipmentStatus
}

export default function TrackingStepper({ status }: Props) {
  const isException = status === 'EXCEPTION' || status === 'ON_HOLD' || status === 'RETURNED_TO_SENDER' || status === 'CANCELLED'
  const activeIndex = isException ? -1 : (STATUS_STEP_INDEX[status] ?? 0)

  return (
    <div className="w-full">
      {isException && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
          ⚠ Shipment status: {status.replace(/_/g, ' ')}
        </div>
      )}
      <div className="relative flex items-center justify-between">
        {/* Connector line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#2d4058] z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-[#c9a84c] z-0 transition-all duration-700"
          style={{
            width: activeIndex >= 0 ? `${(activeIndex / (STEPS.length - 1)) * 100}%` : '0%',
          }}
        />

        {STEPS.map((step, i) => {
          const completed = i < activeIndex
          const active = i === activeIndex
          const pending = i > activeIndex

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 flex-1">
              <div
                className={cn(
                  'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                  completed && 'step-completed',
                  active && 'step-active animate-pulse-gold',
                  pending && 'step-pending'
                )}
              >
                {completed ? (
                  <Check size={16} strokeWidth={2.5} />
                ) : active ? (
                  <span className="w-3 h-3 rounded-full bg-current" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-current opacity-40" />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] sm:text-xs font-medium text-center leading-tight max-w-[60px] sm:max-w-none',
                  completed && 'text-[#c9a84c]',
                  active && 'text-[#c9a84c] font-bold',
                  pending && 'text-[#4a5a6a]'
                )}
              >
                <span className="sm:hidden">{step.short}</span>
                <span className="hidden sm:block">{step.label}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
