-- ============================================================
-- Crownport Logistics - Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- SETTINGS TABLE (key-value store for admin-configurable values)
-- ============================================================
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  label TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (key, value, label, description) VALUES
  ('company_name', 'Crownport Logistics', 'Company Name', 'Display name for the company'),
  ('company_tagline', 'Global Courier Services — Fast, Reliable, Trusted', 'Tagline', 'Hero section tagline'),
  ('company_email', 'info@crownportlogistics.site', 'Contact Email', 'Public contact email'),
  ('company_phone', '+1 (800) 000-0000', 'Phone Number', 'Public phone number'),
  ('company_address', '100 Logistics Way, Global City', 'Address', 'Company physical address'),
  ('social_twitter', '', 'Twitter URL', 'Twitter/X profile URL'),
  ('social_linkedin', '', 'LinkedIn URL', 'LinkedIn profile URL'),
  ('social_facebook', '', 'Facebook URL', 'Facebook page URL'),
  ('stat_countries', '150', 'Countries Served', 'Number of countries served (shown on homepage)'),
  ('stat_shipments', '2,000,000+', 'Shipments Delivered', 'Total shipments delivered (shown on homepage)'),
  ('stat_years', '15', 'Years Operating', 'Years in operation (shown on homepage)'),
  ('notification_sender_name', 'Crownport Logistics', 'Notification Sender Name', 'From name for transactional emails'),
  ('notification_sender_email', 'notifications@crownportlogistics.site', 'Notification Sender Email', 'From address for transactional emails'),
  ('admin_alert_email', 'admin@crownportlogistics.site', 'Admin Alert Email', 'Email that receives admin alerts'),
  ('test_notification_email', 'test@crownportlogistics.site', 'Test Notification Email', 'Email address used for test mode notifications');

-- ============================================================
-- TRACKING CODE SEQUENCE (atomic, collision-free)
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS tracking_code_seq START 1;

-- ============================================================
-- ADMIN USERS PROFILE TABLE
-- ============================================================
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DESTINATIONS TABLE
-- ============================================================
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_name TEXT NOT NULL,
  country_code TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL CHECK (region IN ('Africa', 'Europe', 'Americas', 'Asia Pacific', 'Middle East', 'Oceania')),
  flag_emoji TEXT,
  transit_time_min INTEGER,
  transit_time_max INTEGER,
  transit_unit TEXT DEFAULT 'business days',
  special_notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LOCATIONS TABLE
-- ============================================================
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  hours TEXT,
  services TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RATE TABLE
-- ============================================================
CREATE TABLE rate_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  origin_zone TEXT NOT NULL,
  destination_zone TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('EXPRESS', 'STANDARD', 'FREIGHT', 'INTERNATIONAL', 'ECOMMERCE', 'SAMEDAY')),
  base_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  per_kg_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_weight NUMERIC(10,3) DEFAULT 0,
  max_weight NUMERIC(10,3),
  currency TEXT NOT NULL DEFAULT 'USD',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SHIPMENTS TABLE
-- ============================================================
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_code TEXT NOT NULL UNIQUE,

  -- Status
  current_status TEXT NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (current_status IN (
    'PENDING_REVIEW', 'LABEL_CREATED', 'PICKED_UP', 'ARRIVED_AT_HUB',
    'IN_TRANSIT', 'CUSTOMS_CLEARANCE', 'OUT_FOR_DELIVERY',
    'DELIVERY_ATTEMPTED', 'DELIVERED', 'RETURNED_TO_SENDER',
    'EXCEPTION', 'ON_HOLD', 'CANCELLED'
  )),

  -- Service
  service_type TEXT NOT NULL CHECK (service_type IN ('EXPRESS', 'STANDARD', 'FREIGHT', 'INTERNATIONAL', 'ECOMMERCE', 'SAMEDAY')),
  physical_carrier TEXT DEFAULT 'Own Fleet',
  physical_carrier_reference TEXT,

  -- Sender
  sender_name TEXT NOT NULL,
  sender_email TEXT,
  sender_phone TEXT,
  sender_address TEXT NOT NULL,
  sender_city TEXT NOT NULL,
  sender_country TEXT NOT NULL,
  sender_postal_code TEXT,

  -- Recipient
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  recipient_phone TEXT,
  recipient_address TEXT NOT NULL,
  recipient_city TEXT NOT NULL,
  recipient_country TEXT NOT NULL,
  recipient_postal_code TEXT,

  -- Package
  weight_kg NUMERIC(10,3),
  length_cm NUMERIC(10,2),
  width_cm NUMERIC(10,2),
  height_cm NUMERIC(10,2),
  declared_value NUMERIC(10,2),
  contents_description TEXT,

  -- Dates
  estimated_delivery DATE,
  actual_delivery TIMESTAMPTZ,

  -- Exception handling
  exception_message TEXT,

  -- Internal
  assigned_courier TEXT,
  internal_notes TEXT,
  pod_photo_url TEXT,

  -- Test flag
  is_test BOOLEAN NOT NULL DEFAULT FALSE,

  -- Notifications
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  customer_notified_at JSONB DEFAULT '{}',

  -- Meta
  created_by_admin_id UUID REFERENCES admin_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shipments_tracking_code ON shipments(tracking_code);
CREATE INDEX idx_shipments_status ON shipments(current_status);
CREATE INDEX idx_shipments_is_test ON shipments(is_test);
CREATE INDEX idx_shipments_created_at ON shipments(created_at DESC);
CREATE INDEX idx_shipments_recipient_country ON shipments(recipient_country);
CREATE INDEX idx_shipments_service_type ON shipments(service_type);

-- ============================================================
-- TRACKING EVENTS TABLE
-- ============================================================
CREATE TABLE tracking_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'LABEL_CREATED', 'PICKED_UP', 'ARRIVED_AT_HUB', 'IN_TRANSIT',
    'CUSTOMS_CLEARANCE', 'OUT_FOR_DELIVERY', 'DELIVERY_ATTEMPTED',
    'DELIVERED', 'RETURNED_TO_SENDER', 'EXCEPTION', 'ON_HOLD',
    'NOTE', 'CUSTOMS_CLEARED'
  )),
  event_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location_text TEXT,
  description TEXT,
  created_by_admin_id UUID REFERENCES admin_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tracking_events_shipment_id ON tracking_events(shipment_id);
CREATE INDEX idx_tracking_events_event_time ON tracking_events(event_time DESC);

-- ============================================================
-- NOTIFICATION TEMPLATES TABLE
-- ============================================================
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_type TEXT NOT NULL UNIQUE CHECK (notification_type IN (
    'SHIPMENT_CONFIRMED', 'PICKED_UP', 'ARRIVED_AT_HUB', 'IN_TRANSIT',
    'CUSTOMS_HOLD', 'OUT_FOR_DELIVERY', 'DELIVERY_ATTEMPTED',
    'DELIVERED', 'EXCEPTION', 'RETURN_TO_SENDER'
  )),
  label TEXT NOT NULL,
  email_subject TEXT NOT NULL,
  email_body TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  trigger_on_status TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO notification_templates (notification_type, label, email_subject, email_body, trigger_on_status) VALUES
(
  'SHIPMENT_CONFIRMED',
  'Shipment Confirmed',
  'Your Crownport Shipment {{tracking_code}} is Confirmed',
  '<p>Dear {{sender_name}},</p><p>Your shipment has been received and is under review. Your tracking code is <strong>{{tracking_code}}</strong>.</p><p>You can track your shipment at: <a href="{{tracking_url}}">{{tracking_url}}</a></p><p>Estimated delivery: {{estimated_delivery}}</p><p>Thank you for choosing Crownport Logistics.</p>',
  'PENDING_REVIEW'
),
(
  'PICKED_UP',
  'Package Picked Up',
  'Your Crownport Package {{tracking_code}} Has Been Picked Up',
  '<p>Dear {{recipient_name}},</p><p>Great news! Your package ({{tracking_code}}) has been picked up and is on its way.</p><p>Track your shipment: <a href="{{tracking_url}}">{{tracking_url}}</a></p><p>Estimated delivery: {{estimated_delivery}}</p>',
  'PICKED_UP'
),
(
  'ARRIVED_AT_HUB',
  'Arrived at Hub',
  'Your Package {{tracking_code}} Has Arrived at Our Hub',
  '<p>Dear {{recipient_name}},</p><p>Your package ({{tracking_code}}) has arrived at our processing hub at {{event_location}}.</p><p>Track your shipment: <a href="{{tracking_url}}">{{tracking_url}}</a></p>',
  'ARRIVED_AT_HUB'
),
(
  'IN_TRANSIT',
  'In Transit',
  'Your Package {{tracking_code}} Is On Its Way',
  '<p>Dear {{recipient_name}},</p><p>Your package ({{tracking_code}}) is in transit and heading to its destination.</p><p>Current location: {{event_location}}</p><p>Estimated delivery: {{estimated_delivery}}</p><p>Track your shipment: <a href="{{tracking_url}}">{{tracking_url}}</a></p>',
  'IN_TRANSIT'
),
(
  'CUSTOMS_HOLD',
  'Customs Hold',
  'Action Required: Your Shipment {{tracking_code}} is in Customs',
  '<p>Dear {{recipient_name}},</p><p>Your shipment ({{tracking_code}}) is currently held in customs.</p><p>{{status_message}}</p><p>Please contact us if you need assistance: <a href="{{tracking_url}}">{{tracking_url}}</a></p>',
  'CUSTOMS_CLEARANCE'
),
(
  'OUT_FOR_DELIVERY',
  'Out for Delivery',
  'Your Package {{tracking_code}} Is Out for Delivery Today!',
  '<p>Dear {{recipient_name}},</p><p>Your package ({{tracking_code}}) is out for delivery today! Please ensure someone is available to receive it.</p><p>Carrier: {{carrier}}</p><p>Track your shipment: <a href="{{tracking_url}}">{{tracking_url}}</a></p>',
  'OUT_FOR_DELIVERY'
),
(
  'DELIVERY_ATTEMPTED',
  'Delivery Attempted',
  'Delivery Attempted for {{tracking_code}} — Redelivery Scheduled',
  '<p>Dear {{recipient_name}},</p><p>We attempted to deliver your package ({{tracking_code}}) but were unable to complete the delivery.</p><p>{{status_message}}</p><p>We will attempt redelivery. Track your shipment: <a href="{{tracking_url}}">{{tracking_url}}</a></p>',
  'DELIVERY_ATTEMPTED'
),
(
  'DELIVERED',
  'Delivered',
  'Your Package {{tracking_code}} Has Been Delivered!',
  '<p>Dear {{recipient_name}},</p><p>Your package ({{tracking_code}}) has been successfully delivered!</p><p>If you have any questions or concerns, please contact us at {{company_email}}.</p><p>Thank you for choosing Crownport Logistics.</p>',
  'DELIVERED'
),
(
  'EXCEPTION',
  'Exception / Attention Required',
  'Action Required: Issue with Your Shipment {{tracking_code}}',
  '<p>Dear {{recipient_name}},</p><p>There is an issue with your shipment ({{tracking_code}}) that requires attention.</p><p>{{status_message}}</p><p>Please contact us immediately: <a href="{{tracking_url}}">{{tracking_url}}</a></p>',
  'EXCEPTION'
),
(
  'RETURN_TO_SENDER',
  'Return to Sender',
  'Your Package {{tracking_code}} Is Being Returned',
  '<p>Dear {{sender_name}},</p><p>Your package ({{tracking_code}}) could not be delivered and is being returned to you.</p><p>{{status_message}}</p><p>Track your shipment: <a href="{{tracking_url}}">{{tracking_url}}</a></p>',
  'RETURNED_TO_SENDER'
);

-- ============================================================
-- NOTIFICATIONS LOG TABLE
-- ============================================================
CREATE TABLE notifications_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  email_subject TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  resend_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'queued')),
  error_message TEXT,
  is_test BOOLEAN NOT NULL DEFAULT FALSE,
  sent_by_admin_id UUID REFERENCES admin_profiles(id)
);

CREATE INDEX idx_notifications_log_shipment_id ON notifications_log(shipment_id);
CREATE INDEX idx_notifications_log_sent_at ON notifications_log(sent_at DESC);

-- ============================================================
-- PICKUP REQUESTS TABLE
-- ============================================================
CREATE TABLE pickup_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_city TEXT NOT NULL,
  pickup_country TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time_from TIME,
  preferred_time_to TIME,
  special_instructions TEXT,
  assigned_driver TEXT,
  confirmed_time TIMESTAMPTZ,
  internal_notes TEXT,
  is_test BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pickup_requests_status ON pickup_requests(status);
CREATE INDEX idx_pickup_requests_created_at ON pickup_requests(created_at DESC);

-- ============================================================
-- AUDIT LOG TABLE
-- ============================================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES admin_profiles(id),
  actor_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  before_data JSONB,
  after_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_actor_id ON audit_log(actor_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Function to generate tracking code
CREATE OR REPLACE FUNCTION generate_tracking_code(service_prefix TEXT, country_code TEXT)
RETURNS TEXT AS $$
DECLARE
  seq_val BIGINT;
  padded TEXT;
  check_char TEXT;
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT;
BEGIN
  SELECT nextval('tracking_code_seq') INTO seq_val;
  padded := LPAD(seq_val::TEXT, 8, '0');
  check_char := SUBSTRING(chars FROM ((seq_val % LENGTH(chars)) + 1)::INT FOR 1);
  code := UPPER(service_prefix) || padded || check_char || UPPER(country_code);
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pickup_requests_updated_at BEFORE UPDATE ON pickup_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rate_table_updated_at BEFORE UPDATE ON rate_table
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
