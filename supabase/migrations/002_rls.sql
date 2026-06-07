-- ============================================================
-- Crownport Logistics - Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper function: is_admin()
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SETTINGS - public read, admin write
-- ============================================================
CREATE POLICY "settings_public_read" ON settings
  FOR SELECT USING (TRUE);

CREATE POLICY "settings_admin_write" ON settings
  FOR ALL USING (is_admin());

-- ============================================================
-- ADMIN PROFILES - admin only
-- ============================================================
CREATE POLICY "admin_profiles_admin_read" ON admin_profiles
  FOR SELECT USING (is_admin());

CREATE POLICY "admin_profiles_admin_write" ON admin_profiles
  FOR ALL USING (is_admin());

-- ============================================================
-- SHIPMENTS - public can read non-test, admin can do all
-- ============================================================
CREATE POLICY "shipments_public_read" ON shipments
  FOR SELECT USING (is_test = FALSE);

CREATE POLICY "shipments_admin_all" ON shipments
  FOR ALL USING (is_admin());

-- ============================================================
-- TRACKING EVENTS - public can read for non-test shipments
-- ============================================================
CREATE POLICY "tracking_events_public_read" ON tracking_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shipments
      WHERE shipments.id = tracking_events.shipment_id
      AND shipments.is_test = FALSE
    )
  );

CREATE POLICY "tracking_events_admin_all" ON tracking_events
  FOR ALL USING (is_admin());

-- ============================================================
-- NOTIFICATION TEMPLATES - admin only
-- ============================================================
CREATE POLICY "notification_templates_admin_all" ON notification_templates
  FOR ALL USING (is_admin());

-- ============================================================
-- NOTIFICATIONS LOG - admin only
-- ============================================================
CREATE POLICY "notifications_log_admin_all" ON notifications_log
  FOR ALL USING (is_admin());

-- ============================================================
-- PICKUP REQUESTS - public insert, admin all
-- ============================================================
CREATE POLICY "pickup_requests_public_insert" ON pickup_requests
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "pickup_requests_admin_all" ON pickup_requests
  FOR ALL USING (is_admin());

-- ============================================================
-- RATE TABLE - public read, admin write
-- ============================================================
CREATE POLICY "rate_table_public_read" ON rate_table
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "rate_table_admin_all" ON rate_table
  FOR ALL USING (is_admin());

-- ============================================================
-- DESTINATIONS - public read active, admin all
-- ============================================================
CREATE POLICY "destinations_public_read" ON destinations
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "destinations_admin_all" ON destinations
  FOR ALL USING (is_admin());

-- ============================================================
-- LOCATIONS - public read active, admin all
-- ============================================================
CREATE POLICY "locations_public_read" ON locations
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "locations_admin_all" ON locations
  FOR ALL USING (is_admin());

-- ============================================================
-- AUDIT LOG - admin read only
-- ============================================================
CREATE POLICY "audit_log_admin_read" ON audit_log
  FOR SELECT USING (is_admin());

CREATE POLICY "audit_log_service_insert" ON audit_log
  FOR INSERT WITH CHECK (TRUE);
