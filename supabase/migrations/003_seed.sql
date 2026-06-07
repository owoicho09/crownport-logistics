-- ============================================================
-- Optional seed data for testing and demonstration
-- Run this AFTER 001_schema.sql and 002_rls.sql
-- ============================================================

-- Sample destinations
INSERT INTO destinations (country_name, country_code, region, flag_emoji, transit_time_min, transit_time_max, transit_unit) VALUES
  ('United States', 'US', 'Americas', '🇺🇸', 1, 3, 'business days'),
  ('United Kingdom', 'GB', 'Europe', '🇬🇧', 2, 5, 'business days'),
  ('Germany', 'DE', 'Europe', '🇩🇪', 3, 6, 'business days'),
  ('France', 'FR', 'Europe', '🇫🇷', 3, 6, 'business days'),
  ('Australia', 'AU', 'Asia Pacific', '🇦🇺', 5, 10, 'business days'),
  ('Canada', 'CA', 'Americas', '🇨🇦', 2, 5, 'business days'),
  ('Nigeria', 'NG', 'Africa', '🇳🇬', 5, 12, 'business days'),
  ('South Africa', 'ZA', 'Africa', '🇿🇦', 5, 10, 'business days'),
  ('Japan', 'JP', 'Asia Pacific', '🇯🇵', 4, 8, 'business days'),
  ('Singapore', 'SG', 'Asia Pacific', '🇸🇬', 3, 7, 'business days'),
  ('United Arab Emirates', 'AE', 'Middle East', '🇦🇪', 3, 7, 'business days'),
  ('Saudi Arabia', 'SA', 'Middle East', '🇸🇦', 4, 8, 'business days'),
  ('Brazil', 'BR', 'Americas', '🇧🇷', 7, 15, 'business days'),
  ('India', 'IN', 'Asia Pacific', '🇮🇳', 5, 12, 'business days'),
  ('China', 'CN', 'Asia Pacific', '🇨🇳', 5, 10, 'business days'),
  ('Kenya', 'KE', 'Africa', '🇰🇪', 7, 14, 'business days'),
  ('Ghana', 'GH', 'Africa', '🇬🇭', 7, 14, 'business days'),
  ('Netherlands', 'NL', 'Europe', '🇳🇱', 3, 6, 'business days'),
  ('Spain', 'ES', 'Europe', '🇪🇸', 4, 7, 'business days'),
  ('Italy', 'IT', 'Europe', '🇮🇹', 4, 7, 'business days')
ON CONFLICT (country_code) DO NOTHING;

-- Sample rate table entries
INSERT INTO rate_table (origin_zone, destination_zone, service_type, base_fee, per_kg_rate, min_weight, currency) VALUES
  ('Worldwide', 'Worldwide', 'STANDARD', 15.00, 3.50, 0.1, 'USD'),
  ('Worldwide', 'Worldwide', 'EXPRESS', 35.00, 8.00, 0.1, 'USD'),
  ('Worldwide', 'Worldwide', 'INTERNATIONAL', 25.00, 5.00, 0.1, 'USD'),
  ('Worldwide', 'Worldwide', 'FREIGHT', 50.00, 2.00, 5.0, 'USD'),
  ('Worldwide', 'Worldwide', 'ECOMMERCE', 12.00, 4.00, 0.1, 'USD'),
  ('Worldwide', 'Worldwide', 'SAMEDAY', 75.00, 12.00, 0.1, 'USD'),
  ('United States', 'United Kingdom', 'EXPRESS', 45.00, 10.00, 0.1, 'USD'),
  ('United States', 'United Kingdom', 'STANDARD', 20.00, 4.00, 0.1, 'USD'),
  ('United Kingdom', 'United States', 'EXPRESS', 45.00, 10.00, 0.1, 'USD'),
  ('United Kingdom', 'United States', 'STANDARD', 20.00, 4.00, 0.1, 'USD');

-- Sample Crownport office locations
INSERT INTO locations (name, address, city, country, phone, email, hours, services) VALUES
  ('Crownport Global HQ', '100 Logistics Way', 'Global City', 'United States', '+1 800 000 0000', 'hq@crownportlogistics.site', 'Mon–Fri 8am–6pm EST', ARRAY['Drop-off', 'Pickup', 'Packing', 'Customer Service']),
  ('Crownport London Hub', '25 Courier Lane', 'London', 'United Kingdom', '+44 20 0000 0000', 'london@crownportlogistics.site', 'Mon–Fri 8am–6pm GMT', ARRAY['Drop-off', 'Pickup', 'Customs Support']),
  ('Crownport Lagos Office', '10 Trade Centre Road', 'Lagos', 'Nigeria', '+234 1 000 0000', 'lagos@crownportlogistics.site', 'Mon–Fri 8am–5pm WAT', ARRAY['Drop-off', 'Pickup', 'Packing']);
