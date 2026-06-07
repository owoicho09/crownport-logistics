import { MapPin, Clock } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { TrackingEvent, EVENT_LABELS } from '@/types/database'

interface Props {
  events: TrackingEvent[]
}

const EVENT_ICONS: Record<string, string> = {
  LABEL_CREATED: '📦',
  PICKED_UP: '🚚',
  ARRIVED_AT_HUB: '🏭',
  IN_TRANSIT: '✈️',
  CUSTOMS_CLEARANCE: '🛃',
  CUSTOMS_CLEARED: '✅',
  OUT_FOR_DELIVERY: '🛵',
  DELIVERY_ATTEMPTED: '🔔',
  DELIVERED: '🎉',
  RETURNED_TO_SENDER: '↩️',
  EXCEPTION: '⚠️',
  ON_HOLD: '⏸️',
  NOTE: '📝',
}

export default function TrackingTimeline({ events }: Props) {
  if (!events.length) {
    return (
      <div className="text-center py-10 text-[#4a5a6a] text-sm">
        No tracking events recorded yet.
      </div>
    )
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.event_time).getTime() - new Date(a.event_time).getTime()
  )

  return (
    <div className="space-y-0">
      {sorted.map((event, idx) => {
        const isFirst = idx === 0
        const icon = EVENT_ICONS[event.event_type] ?? '📌'
        const label = EVENT_LABELS[event.event_type] ?? event.event_type

        return (
          <div key={event.id} className="flex gap-4 group">
            {/* Timeline connector */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 z-10 ${
                  isFirst
                    ? 'bg-[#c9a84c] text-[#0f1923] shadow-lg shadow-[#c9a84c30]'
                    : 'bg-[#1e2d3d] border border-[#2d4058]'
                }`}
              >
                {icon}
              </div>
              {idx < sorted.length - 1 && (
                <div className="w-px h-full min-h-[24px] bg-[#2d4058] mt-1" />
              )}
            </div>

            {/* Content */}
            <div className="pb-6 flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                <p className={`font-semibold text-sm ${isFirst ? 'text-[#c9a84c]' : 'text-[#c0d0e0]'}`}>
                  {label}
                </p>
                <div className="flex items-center gap-1 text-[#5a6a7a] text-xs shrink-0">
                  <Clock size={11} />
                  {formatDateTime(event.event_time)}
                </div>
              </div>

              {event.location_text && (
                <div className="flex items-center gap-1 mt-1 text-[#6a7a8a] text-xs">
                  <MapPin size={11} className="shrink-0" />
                  <span>{event.location_text}</span>
                </div>
              )}

              {event.description && (
                <p className="mt-1.5 text-[#7a8a9a] text-sm leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
