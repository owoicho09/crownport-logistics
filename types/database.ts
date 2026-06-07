export type ShipmentStatus =
  | 'PENDING_REVIEW'
  | 'LABEL_CREATED'
  | 'PICKED_UP'
  | 'ARRIVED_AT_HUB'
  | 'IN_TRANSIT'
  | 'CUSTOMS_CLEARANCE'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERY_ATTEMPTED'
  | 'DELIVERED'
  | 'RETURNED_TO_SENDER'
  | 'EXCEPTION'
  | 'ON_HOLD'
  | 'CANCELLED'

export type ServiceType = 'EXPRESS' | 'STANDARD' | 'FREIGHT' | 'INTERNATIONAL' | 'ECOMMERCE' | 'SAMEDAY'

export type EventType =
  | 'LABEL_CREATED'
  | 'PICKED_UP'
  | 'ARRIVED_AT_HUB'
  | 'IN_TRANSIT'
  | 'CUSTOMS_CLEARANCE'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERY_ATTEMPTED'
  | 'DELIVERED'
  | 'RETURNED_TO_SENDER'
  | 'EXCEPTION'
  | 'ON_HOLD'
  | 'NOTE'
  | 'CUSTOMS_CLEARED'

export type NotificationType =
  | 'SHIPMENT_CONFIRMED'
  | 'PICKED_UP'
  | 'ARRIVED_AT_HUB'
  | 'IN_TRANSIT'
  | 'CUSTOMS_HOLD'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERY_ATTEMPTED'
  | 'DELIVERED'
  | 'EXCEPTION'
  | 'RETURN_TO_SENDER'

export interface Shipment {
  id: string
  tracking_code: string
  current_status: ShipmentStatus
  service_type: ServiceType
  physical_carrier: string | null
  physical_carrier_reference: string | null
  sender_name: string
  sender_email: string | null
  sender_phone: string | null
  sender_address: string
  sender_city: string
  sender_country: string
  sender_postal_code: string | null
  recipient_name: string
  recipient_email: string | null
  recipient_phone: string | null
  recipient_address: string
  recipient_city: string
  recipient_country: string
  recipient_postal_code: string | null
  weight_kg: number | null
  length_cm: number | null
  width_cm: number | null
  height_cm: number | null
  declared_value: number | null
  contents_description: string | null
  estimated_delivery: string | null
  actual_delivery: string | null
  exception_message: string | null
  assigned_courier: string | null
  internal_notes: string | null
  pod_photo_url: string | null
  is_test: boolean
  notifications_enabled: boolean
  customer_notified_at: Record<string, string>
  created_by_admin_id: string | null
  created_at: string
  updated_at: string
  tracking_events?: TrackingEvent[]
}

export interface TrackingEvent {
  id: string
  shipment_id: string
  event_type: EventType
  event_time: string
  location_text: string | null
  description: string | null
  created_by_admin_id: string | null
  created_at: string
}

export interface NotificationTemplate {
  id: string
  notification_type: NotificationType
  label: string
  email_subject: string
  email_body: string
  is_enabled: boolean
  trigger_on_status: string | null
  updated_at: string
}

export interface NotificationLog {
  id: string
  shipment_id: string
  notification_type: string
  recipient_email: string
  recipient_name: string | null
  email_subject: string | null
  sent_at: string
  resend_message_id: string | null
  status: 'sent' | 'failed' | 'queued'
  error_message: string | null
  is_test: boolean
  sent_by_admin_id: string | null
}

export interface PickupRequest {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  contact_name: string
  contact_email: string | null
  contact_phone: string
  pickup_address: string
  pickup_city: string
  pickup_country: string
  preferred_date: string
  preferred_time_from: string | null
  preferred_time_to: string | null
  special_instructions: string | null
  assigned_driver: string | null
  confirmed_time: string | null
  internal_notes: string | null
  is_test: boolean
  created_at: string
  updated_at: string
}

export interface RateEntry {
  id: string
  origin_zone: string
  destination_zone: string
  service_type: ServiceType
  base_fee: number
  per_kg_rate: number
  min_weight: number
  max_weight: number | null
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Destination {
  id: string
  country_name: string
  country_code: string
  region: 'Africa' | 'Europe' | 'Americas' | 'Asia Pacific' | 'Middle East' | 'Oceania'
  flag_emoji: string | null
  transit_time_min: number | null
  transit_time_max: number | null
  transit_unit: string
  special_notes: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Location {
  id: string
  name: string
  address: string
  city: string
  country: string
  phone: string | null
  email: string | null
  hours: string | null
  services: string[] | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface AdminProfile {
  id: string
  full_name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuditLogEntry {
  id: string
  actor_id: string | null
  actor_email: string | null
  action: string
  entity_type: string
  entity_id: string | null
  before_data: Record<string, unknown> | null
  after_data: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface Setting {
  key: string
  value: string | null
  label: string | null
  description: string | null
  updated_at: string
}

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  PENDING_REVIEW: 'Pending Review',
  LABEL_CREATED: 'Label Created',
  PICKED_UP: 'Picked Up',
  ARRIVED_AT_HUB: 'Arrived at Hub',
  IN_TRANSIT: 'In Transit',
  CUSTOMS_CLEARANCE: 'Customs Clearance',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERY_ATTEMPTED: 'Delivery Attempted',
  DELIVERED: 'Delivered',
  RETURNED_TO_SENDER: 'Returned to Sender',
  EXCEPTION: 'Exception',
  ON_HOLD: 'On Hold',
  CANCELLED: 'Cancelled',
}

export const EVENT_LABELS: Record<EventType, string> = {
  LABEL_CREATED: 'Label Created',
  PICKED_UP: 'Picked Up',
  ARRIVED_AT_HUB: 'Arrived at Hub',
  IN_TRANSIT: 'In Transit',
  CUSTOMS_CLEARANCE: 'Customs Clearance',
  CUSTOMS_CLEARED: 'Customs Cleared',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERY_ATTEMPTED: 'Delivery Attempted',
  DELIVERED: 'Delivered',
  RETURNED_TO_SENDER: 'Returned to Sender',
  EXCEPTION: 'Exception',
  ON_HOLD: 'On Hold',
  NOTE: 'Note',
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  EXPRESS: 'Express',
  STANDARD: 'Standard Economy',
  FREIGHT: 'Freight',
  INTERNATIONAL: 'International',
  ECOMMERCE: 'eCommerce Fulfillment',
  SAMEDAY: 'Same-Day',
}

export const SERVICE_PREFIXES: Record<ServiceType, string> = {
  EXPRESS: 'EX',
  STANDARD: 'ST',
  FREIGHT: 'FR',
  INTERNATIONAL: 'IN',
  ECOMMERCE: 'EC',
  SAMEDAY: 'SD',
}

export const DELIVERY_STATUSES: ShipmentStatus[] = [
  'LABEL_CREATED',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
]

export const EXCEPTION_STATUSES: ShipmentStatus[] = ['EXCEPTION', 'ON_HOLD', 'DELIVERY_ATTEMPTED']
