'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/public/StatusBadge'
import TrackingTimeline from '@/components/public/TrackingTimeline'
import {
  formatDate, formatDateTime, formatWeight, formatDimensions
} from '@/lib/utils'
import {
  SERVICE_LABELS, EVENT_LABELS, STATUS_LABELS,
  type Shipment, type ShipmentStatus, type EventType, type NotificationType
} from '@/types/database'
import {
  ArrowLeft, Package, Plus, Bell, AlertTriangle, CheckCircle,
  X, Loader2, ExternalLink, Upload
} from 'lucide-react'

const STATUS_OPTIONS = Object.entries(STATUS_LABELS) as [ShipmentStatus, string][]
const EVENT_OPTIONS = Object.entries(EVENT_LABELS) as [EventType, string][]
const NOTIFICATION_TYPES: [NotificationType, string][] = [
  ['SHIPMENT_CONFIRMED', 'Shipment Confirmed'],
  ['PICKED_UP', 'Picked Up'],
  ['IN_TRANSIT', 'In Transit'],
  ['OUT_FOR_DELIVERY', 'Out for Delivery'],
  ['DELIVERED', 'Delivered'],
  ['EXCEPTION', 'Exception'],
]

interface Props { shipment: Shipment & { notifications_log?: unknown[] } }

export default function ShipmentDetailView({ shipment: initial }: Props) {
  const router = useRouter()
  const [shipment, setShipment] = useState(initial)
  const [activeTab, setActiveTab] = useState<'details' | 'events' | 'notifications'>('details')

  // Add event modal
  const [addEventOpen, setAddEventOpen] = useState(false)
  const [eventForm, setEventForm] = useState({
    event_type: 'NOTE' as EventType,
    event_time: new Date().toISOString().slice(0, 16),
    location_text: '',
    description: '',
  })
  const [addingEvent, setAddingEvent] = useState(false)

  // Status change
  const [changingStatus, setChangingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState<ShipmentStatus>(shipment.current_status)
  const [exceptionMessage, setExceptionMessage] = useState(shipment.exception_message ?? '')

  // Send notification
  const [sendingNotif, setSendingNotif] = useState<NotificationType | null>(null)

  // Exception mark
  const [markingException, setMarkingException] = useState(false)
  const [exceptionMsg, setExceptionMsg] = useState('')

  async function addEvent() {
    setAddingEvent(true)
    try {
      const res = await fetch(`/api/admin/shipments/${shipment.id}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      })
      if (!res.ok) throw new Error('Failed')
      setAddEventOpen(false)
      router.refresh()
    } catch {
      alert('Failed to add event')
    } finally {
      setAddingEvent(false)
    }
  }

  async function changeStatus() {
    setChangingStatus(true)
    try {
      const res = await fetch(`/api/admin/shipments/${shipment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_status: newStatus,
          exception_message: newStatus === 'EXCEPTION' ? exceptionMessage : null,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      router.refresh()
    } catch {
      alert('Failed to update status')
    } finally {
      setChangingStatus(false)
    }
  }

  async function sendNotification(type: NotificationType) {
    setSendingNotif(type)
    try {
      const res = await fetch(`/api/admin/shipments/${shipment.id}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_type: type }),
      })
      if (!res.ok) throw new Error('Failed')
      alert(`${type} notification sent!`)
    } catch {
      alert('Failed to send notification')
    } finally {
      setSendingNotif(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded text-[#6a7a8a] hover:text-white hover:bg-[#1e2d3d] transition-colors mt-1">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white font-mono">{shipment.tracking_code}</h1>
            <StatusBadge status={shipment.current_status} />
            {shipment.is_test && (
              <span className="badge bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">TEST</span>
            )}
          </div>
          <p className="text-[#6a7a8a] text-sm">
            Created {formatDateTime(shipment.created_at)} · {SERVICE_LABELS[shipment.service_type]}
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`/track/${shipment.tracking_code}`} target="_blank" className="btn-outline text-sm py-1.5 px-3">
            <ExternalLink size={14} /> Public View
          </a>
        </div>
      </div>

      {/* Exception banner */}
      {shipment.exception_message && (
        <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-semibold text-sm">Exception: {shipment.exception_message}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-[#1e2d3d]">
        {(['details', 'events', 'notifications'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-[#c9a84c] border-b-2 border-[#c9a84c]'
                : 'text-[#5a6a7a] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Details tab */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Info cards */}
          <div className="lg:col-span-2 space-y-5">
            {/* Sender / Recipient */}
            <div className="card">
              <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-4">Route</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-[#5a6a7a] text-xs mb-2">Sender</p>
                  <p className="text-white font-medium">{shipment.sender_name}</p>
                  {shipment.sender_email && <p className="text-[#6a7a8a] text-xs">{shipment.sender_email}</p>}
                  {shipment.sender_phone && <p className="text-[#6a7a8a] text-xs">{shipment.sender_phone}</p>}
                  <p className="text-[#6a7a8a] text-xs mt-1">{shipment.sender_address}, {shipment.sender_city}, {shipment.sender_country}</p>
                </div>
                <div>
                  <p className="text-[#5a6a7a] text-xs mb-2">Recipient</p>
                  <p className="text-white font-medium">{shipment.recipient_name}</p>
                  {shipment.recipient_email && <p className="text-[#6a7a8a] text-xs">{shipment.recipient_email}</p>}
                  {shipment.recipient_phone && <p className="text-[#6a7a8a] text-xs">{shipment.recipient_phone}</p>}
                  <p className="text-[#6a7a8a] text-xs mt-1">{shipment.recipient_address}, {shipment.recipient_city}, {shipment.recipient_country}</p>
                </div>
              </div>
            </div>

            {/* Package */}
            <div className="card">
              <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-4">Package</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {[
                  ['Service', SERVICE_LABELS[shipment.service_type]],
                  ['Carrier', shipment.physical_carrier ?? '—'],
                  ['Weight', formatWeight(shipment.weight_kg)],
                  ['Dimensions', formatDimensions(shipment.length_cm, shipment.width_cm, shipment.height_cm)],
                  ['Declared Value', shipment.declared_value ? `$${shipment.declared_value}` : '—'],
                  ['Est. Delivery', formatDate(shipment.estimated_delivery)],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <p className="text-[#5a6a7a] text-xs mb-0.5">{label}</p>
                    <p className="text-white">{value}</p>
                  </div>
                ))}
              </div>
              {shipment.contents_description && (
                <div className="mt-4 pt-4 border-t border-[#243448]">
                  <p className="text-[#5a6a7a] text-xs mb-1">Contents</p>
                  <p className="text-[#c0d0e0] text-sm">{shipment.contents_description}</p>
                </div>
              )}
            </div>

            {/* Internal notes */}
            {shipment.internal_notes && (
              <div className="card">
                <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-2">Internal Notes</h3>
                <p className="text-[#8899aa] text-sm">{shipment.internal_notes}</p>
              </div>
            )}

            {/* POD Photo */}
            {shipment.pod_photo_url && (
              <div className="card">
                <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-3">Proof of Delivery</h3>
                <img src={shipment.pod_photo_url} alt="POD" className="rounded-lg max-h-64 object-cover" />
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="space-y-4">
            {/* Status change */}
            <div className="card">
              <h3 className="text-white font-semibold text-sm mb-4">Update Status</h3>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ShipmentStatus)}
                className="input-field text-sm mb-3"
              >
                {STATUS_OPTIONS.map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              {newStatus === 'EXCEPTION' && (
                <textarea
                  value={exceptionMessage}
                  onChange={(e) => setExceptionMessage(e.target.value)}
                  placeholder="Exception message (shown publicly on tracking page)"
                  className="input-field text-sm resize-none min-h-[80px] mb-3"
                />
              )}
              <button
                onClick={changeStatus}
                className="btn-gold w-full text-sm py-2"
                disabled={changingStatus || newStatus === shipment.current_status}
              >
                {changingStatus ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                Update Status
              </button>
            </div>

            {/* Add tracking event */}
            <div className="card">
              <h3 className="text-white font-semibold text-sm mb-3">Add Tracking Event</h3>
              <button onClick={() => setAddEventOpen(true)} className="btn-outline w-full text-sm py-2">
                <Plus size={14} /> Add Event
              </button>
            </div>

            {/* Quick notifications */}
            <div className="card">
              <h3 className="text-white font-semibold text-sm mb-3">Send Notification</h3>
              <div className="space-y-1.5">
                {NOTIFICATION_TYPES.map(([type, label]) => (
                  <button
                    key={type}
                    onClick={() => sendNotification(type)}
                    disabled={!!sendingNotif}
                    className="w-full text-left text-xs px-3 py-2 rounded bg-[#1e2d3d] border border-[#2d4058] text-[#8899aa] hover:text-white hover:border-[#3d5068] transition-colors flex items-center justify-between"
                  >
                    {label}
                    {sendingNotif === type && <Loader2 size={12} className="animate-spin" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events tab */}
      {activeTab === 'events' && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <p className="text-[#6a7a8a] text-sm">{shipment.tracking_events?.length ?? 0} events</p>
            <button onClick={() => setAddEventOpen(true)} className="btn-gold text-sm py-2 px-4">
              <Plus size={14} /> Add Event
            </button>
          </div>
          <div className="card">
            <TrackingTimeline events={shipment.tracking_events ?? []} />
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === 'notifications' && (
        <div className="card">
          <h3 className="text-white font-semibold mb-4">Notification History</h3>
          {!shipment.notifications_log?.length ? (
            <p className="text-[#4a5a6a] text-sm text-center py-6">No notifications sent yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#243448] text-[#5a6a7a] text-xs uppercase tracking-wider">
                    <th className="text-left py-2 px-3">Type</th>
                    <th className="text-left py-2 px-3">Recipient</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-left py-2 px-3">Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {(shipment.notifications_log as { notification_type: string; recipient_email: string; status: string; sent_at: string; is_test: boolean }[]).map((n, i) => (
                    <tr key={i} className="border-b border-[#1e2d3d]">
                      <td className="py-2 px-3 text-[#c0d0e0]">{n.notification_type}</td>
                      <td className="py-2 px-3 text-[#6a7a8a]">{n.recipient_email}</td>
                      <td className="py-2 px-3">
                        <span className={`badge ${n.status === 'sent' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {n.status}
                        </span>
                        {n.is_test && <span className="ml-1 badge bg-yellow-500/10 text-yellow-400">TEST</span>}
                      </td>
                      <td className="py-2 px-3 text-[#5a6a7a] text-xs">{formatDateTime(n.sent_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Event Modal */}
      {addEventOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2535] border border-[#2d4058] rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Add Tracking Event</h3>
              <button onClick={() => setAddEventOpen(false)} className="text-[#5a6a7a] hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Event Type</label>
                <select
                  value={eventForm.event_type}
                  onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value as EventType })}
                  className="input-field text-sm"
                >
                  {EVENT_OPTIONS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Date & Time</label>
                <input
                  type="datetime-local"
                  value={eventForm.event_time}
                  onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Location (optional)</label>
                <input
                  type="text"
                  value={eventForm.location_text}
                  onChange={(e) => setEventForm({ ...eventForm, location_text: e.target.value })}
                  placeholder="e.g. London Heathrow Hub"
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-[#8899aa] text-xs mb-1.5">Description (optional)</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Additional details about this event"
                  className="input-field text-sm resize-none min-h-[80px]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setAddEventOpen(false)} className="btn-outline flex-1 text-sm py-2">Cancel</button>
                <button onClick={addEvent} className="btn-gold flex-1 text-sm py-2" disabled={addingEvent}>
                  {addingEvent ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
