'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Zap, Trash2, ExternalLink, Bell, ChevronRight } from 'lucide-react'
import StatusBadge from '@/components/public/StatusBadge'
import { formatDateTime } from '@/lib/utils'
import {
  EVENT_LABELS, STATUS_LABELS, type Shipment, type EventType, type ShipmentStatus, type NotificationType
} from '@/types/database'

interface Props {
  testShipments: Shipment[]
  testEmail: string
}

const SIMULATION_STEPS: EventType[] = [
  'LABEL_CREATED', 'PICKED_UP', 'ARRIVED_AT_HUB', 'IN_TRANSIT',
  'CUSTOMS_CLEARANCE', 'OUT_FOR_DELIVERY', 'DELIVERED',
]

const NOTIFICATION_TYPES: [NotificationType, string][] = [
  ['SHIPMENT_CONFIRMED', 'Shipment Confirmed'],
  ['PICKED_UP', 'Picked Up'],
  ['IN_TRANSIT', 'In Transit'],
  ['OUT_FOR_DELIVERY', 'Out for Delivery'],
  ['DELIVERED', 'Delivered'],
  ['EXCEPTION', 'Exception'],
]

export default function TestModePanel({ testShipments, testEmail }: Props) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [simulating, setSimulating] = useState<string | null>(null)
  const [sendingPreview, setSendingPreview] = useState<NotificationType | null>(null)
  const [previewEmail, setPreviewEmail] = useState(testEmail)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [error, setError] = useState('')

  async function createTestShipment() {
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/ship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: 'Test Sender',
          sender_email: testEmail || 'test@example.com',
          sender_phone: '+1 555 000 0000',
          sender_address: '100 Test Street',
          sender_city: 'New York',
          sender_country: 'United States',
          recipient_name: 'Test Recipient',
          recipient_email: testEmail || 'test@example.com',
          recipient_phone: '+44 20 0000 0000',
          recipient_address: '200 Test Road',
          recipient_city: 'London',
          recipient_country: 'United Kingdom',
          service_type: 'EXPRESS',
          weight_kg: 2.5,
          contents_description: 'Test package contents',
          is_test: true,
        }),
      })
      if (!res.ok) throw new Error('Failed to create test shipment')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setCreating(false)
    }
  }

  async function simulateNextStep(shipment: Shipment) {
    // Find current step index and advance
    const currentStatusIndex = SIMULATION_STEPS.findIndex((step) => {
      const status = step.replace(/_/g, '_') as ShipmentStatus
      return shipment.current_status === status
    })

    const nextEventIndex = currentStatusIndex + 1
    if (nextEventIndex >= SIMULATION_STEPS.length) {
      alert('Shipment is already at final state.')
      return
    }

    const nextEvent = SIMULATION_STEPS[nextEventIndex]
    setSimulating(shipment.id)
    try {
      await fetch(`/api/admin/shipments/${shipment.id}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: nextEvent,
          location_text: 'Test Location Hub',
          description: `Simulation step: ${EVENT_LABELS[nextEvent]}`,
        }),
      })
      router.refresh()
    } catch { alert('Simulation failed') }
    finally { setSimulating(null) }
  }

  async function sendPreview(type: NotificationType) {
    if (!selectedShipment) { alert('Select a test shipment first.'); return }
    setSendingPreview(type)
    try {
      const res = await fetch(`/api/admin/shipments/${selectedShipment.id}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_type: type }),
      })
      const json = await res.json()
      if (json.success) {
        alert(`[TEST] ${type} notification sent to ${previewEmail}`)
      } else {
        alert('Failed: ' + (json.error ?? 'Unknown error'))
      }
    } catch { alert('Failed') }
    finally { setSendingPreview(null) }
  }

  async function clearTestData() {
    if (!confirm('Delete ALL test shipments, events, and notifications? This cannot be undone.')) return
    setClearing(true)
    try {
      await fetch('/api/admin/test/clear', { method: 'DELETE' })
      setSelectedShipment(null)
      router.refresh()
    } catch { alert('Failed to clear test data') }
    finally { setClearing(false) }
  }

  return (
    <div className="space-y-5">
      {/* Create & Clear */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4 text-sm">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={createTestShipment} disabled={creating} className="btn-gold text-sm py-2 px-5">
            {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Create Test Shipment
          </button>
          <button onClick={clearTestData} disabled={clearing} className="btn-danger text-sm py-2 px-5 flex items-center gap-1.5">
            {clearing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Clear All Test Data
          </button>
        </div>
        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Test Shipments List */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 text-sm">
            Test Shipments ({testShipments.length})
          </h3>
          {testShipments.length === 0 ? (
            <p className="text-[#4a5a6a] text-sm text-center py-6">No test shipments. Create one above.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {testShipments.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedShipment(s)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedShipment?.id === s.id
                      ? 'border-[#c9a84c40] bg-[#c9a84c08]'
                      : 'border-[#2d4058] hover:border-[#3d5068]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[#c9a84c] text-xs font-semibold">{s.tracking_code}</span>
                    <StatusBadge status={s.current_status} size="sm" />
                  </div>
                  <p className="text-[#5a6a7a] text-xs mt-0.5">{formatDateTime(s.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Simulation Panel */}
        <div className="card">
          <h3 className="text-white font-semibold mb-4 text-sm">
            Simulation
            {selectedShipment && (
              <span className="ml-2 text-[#c9a84c] font-mono text-xs font-normal">{selectedShipment.tracking_code}</span>
            )}
          </h3>

          {!selectedShipment ? (
            <p className="text-[#4a5a6a] text-sm text-center py-6">Select a test shipment from the list to simulate it.</p>
          ) : (
            <div className="space-y-4">
              {/* Advance status */}
              <div>
                <p className="text-[#8899aa] text-xs mb-2">Current: <span className="text-white">{STATUS_LABELS[selectedShipment.current_status]}</span></p>
                <div className="space-y-1.5">
                  {SIMULATION_STEPS.map((step, i) => {
                    const stepStatus = step as ShipmentStatus
                    const isCurrent = selectedShipment.current_status === stepStatus
                    const isPast = SIMULATION_STEPS.indexOf(selectedShipment.current_status as EventType) > i
                    const isNext = SIMULATION_STEPS.indexOf(selectedShipment.current_status as EventType) + 1 === i

                    return (
                      <div key={step} className={`flex items-center gap-2 p-2.5 rounded-lg text-xs transition-colors ${isCurrent ? 'bg-[#c9a84c15] border border-[#c9a84c30]' : isPast ? 'opacity-40' : ''}`}>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-[#c9a84c]' : isPast ? 'bg-green-400' : 'bg-[#2d4058]'}`} />
                        <span className={isCurrent ? 'text-[#c9a84c] font-medium' : isPast ? 'text-[#4a5a6a]' : 'text-[#6a7a8a]'}>
                          {EVENT_LABELS[step]}
                        </span>
                        {isNext && (
                          <button
                            onClick={() => simulateNextStep(selectedShipment)}
                            disabled={!!simulating}
                            className="ml-auto flex items-center gap-1 text-[#c9a84c] hover:text-white text-xs"
                          >
                            {simulating === selectedShipment.id ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                            Advance
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <a href={`/track/${selectedShipment.tracking_code}`} target="_blank" className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1">
                  <ExternalLink size={12} /> Public View
                </a>
                <a href={`/admin/shipments/${selectedShipment.id}`} className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1">
                  Detail <ChevronRight size={12} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Preview */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4 text-sm">Notification Preview</h3>
        <div className="flex items-center gap-3 mb-4">
          <input
            type="email"
            value={previewEmail}
            onChange={(e) => setPreviewEmail(e.target.value)}
            placeholder="Send test preview to..."
            className="input-field text-sm py-2 flex-1 max-w-sm"
          />
        </div>
        <p className="text-[#5a6a7a] text-xs mb-3">
          Select a test shipment above first. All previews are sent with [TEST] prefix.
        </p>
        <div className="flex flex-wrap gap-2">
          {NOTIFICATION_TYPES.map(([type, label]) => (
            <button
              key={type}
              onClick={() => sendPreview(type)}
              disabled={!selectedShipment || !!sendingPreview}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded bg-[#1e2d3d] border border-[#2d4058] text-[#8899aa] hover:text-white hover:border-[#3d5068] disabled:opacity-40 transition-colors"
            >
              {sendingPreview === type ? <Loader2 size={12} className="animate-spin" /> : <Bell size={12} />}
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
