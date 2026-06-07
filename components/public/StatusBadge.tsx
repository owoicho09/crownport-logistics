import { cn } from '@/lib/utils'
import { STATUS_LABELS, type ShipmentStatus } from '@/types/database'

const variants: Record<string, string> = {
  PENDING_REVIEW: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  LABEL_CREATED: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  PICKED_UP: 'bg-blue-400/10 text-blue-300 border border-blue-400/20',
  ARRIVED_AT_HUB: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  IN_TRANSIT: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  CUSTOMS_CLEARANCE: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  OUT_FOR_DELIVERY: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  DELIVERY_ATTEMPTED: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  DELIVERED: 'bg-green-500/10 text-green-400 border border-green-500/20',
  RETURNED_TO_SENDER: 'bg-red-500/10 text-red-400 border border-red-500/20',
  EXCEPTION: 'bg-red-500/10 text-red-400 border border-red-500/20',
  ON_HOLD: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  CANCELLED: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
}

interface Props {
  status: ShipmentStatus | string
  className?: string
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, className, size = 'md' }: Props) {
  const label = STATUS_LABELS[status as ShipmentStatus] ?? status
  const variant = variants[status] ?? 'bg-gray-500/10 text-gray-400'

  return (
    <span
      className={cn(
        'badge',
        variant,
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1',
        className
      )}
    >
      {label}
    </span>
  )
}
