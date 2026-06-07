-- ============================================================
-- Crownport Logistics — Seed Data
-- Run AFTER 001_schema.sql and 002_rls.sql
-- From a UK/Europe hub assumption for transit times
-- ============================================================

-- ============================================================
-- DESTINATIONS (76 countries, grouped by region)
-- ============================================================
DELETE FROM destinations;

INSERT INTO destinations (country_name, country_code, region, flag_emoji, transit_time_min, transit_time_max, transit_unit, special_notes, sort_order) VALUES

-- ── AFRICA ──────────────────────────────────────────────────
('Nigeria',            'NG', 'Africa', '🇳🇬',  7, 14, 'business days', 'Express and Standard available — Lagos hub served directly',                        1),
('Ghana',              'GH', 'Africa', '🇬🇭',  7, 14, 'business days', 'Express and Standard available',                                                   2),
('Kenya',              'KE', 'Africa', '🇰🇪',  7, 14, 'business days', 'Express and Standard available — Nairobi hub served directly',                       3),
('South Africa',       'ZA', 'Africa', '🇿🇦',  7, 12, 'business days', 'Express and Standard available — Johannesburg hub served directly',                  4),
('Ethiopia',           'ET', 'Africa', '🇪🇹', 10, 18, 'business days', 'Standard only — additional documentation may be required',                          5),
('Egypt',              'EG', 'Africa', '🇪🇬',  5, 10, 'business days', 'Express and Standard available — customs pre-clearance recommended',                  6),
('Tanzania',           'TZ', 'Africa', '🇹🇿', 10, 18, 'business days', 'Standard only — remote areas may take longer',                                      7),
('Uganda',             'UG', 'Africa', '🇺🇬', 10, 18, 'business days', 'Standard only — remote areas may take longer',                                      8),
('Senegal',            'SN', 'Africa', '🇸🇳', 10, 18, 'business days', 'Standard only',                                                                    9),
('Cameroon',           'CM', 'Africa', '🇨🇲', 10, 18, 'business days', 'Standard only — customs documentation required',                                   10),
('Côte d''Ivoire',     'CI', 'Africa', '🇨🇮', 10, 18, 'business days', 'Standard only',                                                                   11),
('Rwanda',             'RW', 'Africa', '🇷🇼', 10, 18, 'business days', 'Standard only',                                                                   12),
('Zimbabwe',           'ZW', 'Africa', '🇿🇼', 10, 18, 'business days', 'Standard only — import restrictions apply on some goods',                          13),
('Zambia',             'ZM', 'Africa', '🇿🇲', 10, 18, 'business days', 'Standard only — remote areas may take longer',                                     14),
('Mozambique',         'MZ', 'Africa', '🇲🇿', 12, 21, 'business days', 'Standard only — remote areas may take significantly longer',                       15),

-- ── AMERICAS ────────────────────────────────────────────────
('United States',      'US', 'Americas', '🇺🇸',  5,  8, 'business days', 'Express and Standard available — all major cities served',                       1),
('Canada',             'CA', 'Americas', '🇨🇦',  5,  8, 'business days', 'Express and Standard available',                                                  2),
('Brazil',             'BR', 'Americas', '🇧🇷',  8, 15, 'business days', 'Express and Standard available — customs clearance may add 1–3 days',             3),
('Mexico',             'MX', 'Americas', '🇲🇽',  7, 12, 'business days', 'Express and Standard available',                                                  4),
('Argentina',          'AR', 'Americas', '🇦🇷', 10, 18, 'business days', 'Standard only — customs documentation required, delays possible',                 5),
('Colombia',           'CO', 'Americas', '🇨🇴', 10, 15, 'business days', 'Express and Standard available',                                                  6),
('Chile',              'CL', 'Americas', '🇨🇱', 10, 18, 'business days', 'Express and Standard available',                                                  7),
('Peru',               'PE', 'Americas', '🇵🇪', 10, 18, 'business days', 'Standard only — customs documentation required',                                  8),
('Ecuador',            'EC', 'Americas', '🇪🇨', 10, 18, 'business days', 'Standard only',                                                                   9),
('Jamaica',            'JM', 'Americas', '🇯🇲', 10, 15, 'business days', 'Standard only — island surcharge may apply',                                     10),
('Trinidad and Tobago','TT', 'Americas', '🇹🇹', 10, 18, 'business days', 'Standard only — island surcharge may apply',                                     11),
('Panama',             'PA', 'Americas', '🇵🇦',  8, 14, 'business days', 'Standard only',                                                                  12),
('Costa Rica',         'CR', 'Americas', '🇨🇷',  8, 14, 'business days', 'Standard only',                                                                  13),
('Dominican Republic', 'DO', 'Americas', '🇩🇴', 10, 15, 'business days', 'Standard only — island surcharge may apply',                                     14),
('Uruguay',            'UY', 'Americas', '🇺🇾', 10, 18, 'business days', 'Standard only',                                                                  15),

-- ── ASIA PACIFIC ────────────────────────────────────────────
('China',              'CN', 'Asia Pacific', '🇨🇳',  5, 10, 'business days', 'Express and Standard available — additional customs checks apply',              1),
('Japan',              'JP', 'Asia Pacific', '🇯🇵',  4,  8, 'business days', 'Express and Standard available',                                                2),
('Australia',          'AU', 'Asia Pacific', '🇦🇺',  5, 10, 'business days', 'Express and Standard available — strict biosecurity checks apply',              3),
('India',              'IN', 'Asia Pacific', '🇮🇳',  5, 10, 'business days', 'Express and Standard available — customs documentation required',               4),
('South Korea',        'KR', 'Asia Pacific', '🇰🇷',  4,  8, 'business days', 'Express and Standard available',                                                5),
('Singapore',          'SG', 'Asia Pacific', '🇸🇬',  4,  8, 'business days', 'Express and Standard available — Asia Pacific gateway hub',                     6),
('Malaysia',           'MY', 'Asia Pacific', '🇲🇾',  5, 10, 'business days', 'Express and Standard available',                                                7),
('Indonesia',          'ID', 'Asia Pacific', '🇮🇩',  7, 14, 'business days', 'Express and Standard available — remote islands may take longer',                8),
('Thailand',           'TH', 'Asia Pacific', '🇹🇭',  5, 10, 'business days', 'Express and Standard available',                                                9),
('Philippines',        'PH', 'Asia Pacific', '🇵🇭',  7, 14, 'business days', 'Express and Standard available — island surcharge for provincial areas',       10),
('Vietnam',            'VN', 'Asia Pacific', '🇻🇳',  7, 12, 'business days', 'Express and Standard available',                                               11),
('New Zealand',        'NZ', 'Asia Pacific', '🇳🇿',  7, 12, 'business days', 'Express and Standard available — strict biosecurity checks apply',             12),
('Hong Kong',          'HK', 'Asia Pacific', '🇭🇰',  4,  7, 'business days', 'Express and Standard available',                                               13),
('Pakistan',           'PK', 'Asia Pacific', '🇵🇰',  7, 14, 'business days', 'Standard only — customs documentation required',                               14),
('Bangladesh',         'BD', 'Asia Pacific', '🇧🇩', 10, 18, 'business days', 'Standard only — customs clearance may add delays',                             15),
('Sri Lanka',          'LK', 'Asia Pacific', '🇱🇰', 10, 18, 'business days', 'Standard only — island surcharge may apply',                                   16),

-- ── EUROPE ──────────────────────────────────────────────────
('United Kingdom',     'GB', 'Europe', '🇬🇧',  2,  4, 'business days', 'Express and Standard available — domestic hub, fastest service',                    1),
('Germany',            'DE', 'Europe', '🇩🇪',  3,  5, 'business days', 'Express and Standard available',                                                    2),
('France',             'FR', 'Europe', '🇫🇷',  3,  5, 'business days', 'Express and Standard available',                                                    3),
('Netherlands',        'NL', 'Europe', '🇳🇱',  3,  5, 'business days', 'Express and Standard available',                                                    4),
('Belgium',            'BE', 'Europe', '🇧🇪',  3,  5, 'business days', 'Express and Standard available',                                                    5),
('Spain',              'ES', 'Europe', '🇪🇸',  4,  6, 'business days', 'Express and Standard available',                                                    6),
('Italy',              'IT', 'Europe', '🇮🇹',  4,  6, 'business days', 'Express and Standard available',                                                    7),
('Portugal',           'PT', 'Europe', '🇵🇹',  4,  6, 'business days', 'Express and Standard available',                                                    8),
('Sweden',             'SE', 'Europe', '🇸🇪',  4,  7, 'business days', 'Express and Standard available',                                                    9),
('Norway',             'NO', 'Europe', '🇳🇴',  4,  7, 'business days', 'Express and Standard available — non-EU customs apply',                             10),
('Denmark',            'DK', 'Europe', '🇩🇰',  4,  6, 'business days', 'Express and Standard available',                                                   11),
('Poland',             'PL', 'Europe', '🇵🇱',  4,  7, 'business days', 'Express and Standard available',                                                   12),
('Switzerland',        'CH', 'Europe', '🇨🇭',  3,  5, 'business days', 'Express and Standard available — non-EU customs apply',                             13),
('Austria',            'AT', 'Europe', '🇦🇹',  4,  6, 'business days', 'Express and Standard available',                                                   14),
('Ireland',            'IE', 'Europe', '🇮🇪',  2,  4, 'business days', 'Express and Standard available',                                                   15),
('Greece',             'GR', 'Europe', '🇬🇷',  5,  8, 'business days', 'Express and Standard available — island deliveries may take longer',                16),
('Finland',            'FI', 'Europe', '🇫🇮',  4,  7, 'business days', 'Express and Standard available',                                                   17),
('Czech Republic',     'CZ', 'Europe', '🇨🇿',  4,  6, 'business days', 'Express and Standard available',                                                   18),
('Romania',            'RO', 'Europe', '🇷🇴',  5,  8, 'business days', 'Standard available — express limited to major cities',                              19),
('Hungary',            'HU', 'Europe', '🇭🇺',  4,  7, 'business days', 'Express and Standard available',                                                   20),

-- ── MIDDLE EAST ─────────────────────────────────────────────
('United Arab Emirates','AE', 'Middle East', '🇦🇪',  4,  7, 'business days', 'Express and Standard available — Dubai gateway hub',                           1),
('Saudi Arabia',        'SA', 'Middle East', '🇸🇦',  5,  9, 'business days', 'Express and Standard available — customs documentation required',               2),
('Qatar',               'QA', 'Middle East', '🇶🇦',  4,  8, 'business days', 'Express and Standard available',                                                3),
('Kuwait',              'KW', 'Middle East', '🇰🇼',  5,  9, 'business days', 'Express and Standard available',                                                4),
('Bahrain',             'BH', 'Middle East', '🇧🇭',  5,  9, 'business days', 'Express and Standard available',                                                5),
('Oman',                'OM', 'Middle East', '🇴🇲',  5,  9, 'business days', 'Express and Standard available',                                                6),
('Jordan',              'JO', 'Middle East', '🇯🇴',  5,  9, 'business days', 'Express and Standard available',                                                7),
('Lebanon',             'LB', 'Middle East', '🇱🇧',  5,  9, 'business days', 'Standard only — please check current restrictions before shipping',             8),
('Turkey',              'TR', 'Middle East', '🇹🇷',  4,  7, 'business days', 'Express and Standard available — customs documentation required',               9),
('Israel',              'IL', 'Middle East', '🇮🇱',  5,  9, 'business days', 'Express and Standard available — additional security checks may apply',        10);

-- ============================================================
-- LOCATIONS (7 global hubs)
-- ============================================================
DELETE FROM locations;

INSERT INTO locations (name, address, city, country, phone, email, hours, services, sort_order) VALUES
(
  'Lagos — West Africa Hub',
  '14 Crown Business Park, Victoria Island',
  'Lagos',
  'Nigeria',
  '+234 1 700 5000',
  'lagos@crownportlogistics.site',
  'Mon–Fri 8:00am–6:00pm WAT, Sat 9:00am–1:00pm WAT',
  ARRAY['Parcel Drop-off', 'Pickup Scheduling', 'Customs Assistance', 'Express Processing', 'Packing Services'],
  1
),
(
  'London — Europe Headquarters',
  '88 Crownport House, Canary Wharf',
  'London',
  'United Kingdom',
  '+44 20 7946 0800',
  'london@crownportlogistics.site',
  'Mon–Fri 8:00am–6:00pm GMT, Sat 9:00am–1:00pm GMT',
  ARRAY['Parcel Drop-off', 'Pickup Scheduling', 'Customs Support', 'Express Processing', 'International Dispatch', 'Customer Service', 'Freight Handling'],
  2
),
(
  'Dubai — Middle East & Asia Gateway',
  '22 Logistics Tower, Dubai Airport Free Zone',
  'Dubai',
  'United Arab Emirates',
  '+971 4 890 4400',
  'dubai@crownportlogistics.site',
  'Mon–Thu 8:00am–6:00pm GST, Fri 8:00am–12:00pm GST, Sat 9:00am–1:00pm GST',
  ARRAY['Parcel Drop-off', 'Pickup Scheduling', 'Customs Assistance', 'Express Processing', 'International Transit', 'Freight Handling'],
  3
),
(
  'New York — North America Operations',
  '350 Seventh Avenue, Suite 1200',
  'New York',
  'United States',
  '+1 212 555 0190',
  'newyork@crownportlogistics.site',
  'Mon–Fri 8:00am–6:00pm EST, Sat 9:00am–1:00pm EST',
  ARRAY['Parcel Drop-off', 'Express Delivery', 'Freight Handling', 'Customer Service'],
  4
),
(
  'Johannesburg — Southern Africa Hub',
  '9 Crown Road, Sandton Business District',
  'Johannesburg',
  'South Africa',
  '+27 11 555 0200',
  'joburg@crownportlogistics.site',
  'Mon–Fri 8:00am–6:00pm SAST, Sat 9:00am–1:00pm SAST',
  ARRAY['Parcel Drop-off', 'Pickup Scheduling', 'Standard Delivery', 'Express Delivery', 'Packing Services'],
  5
),
(
  'Nairobi — East Africa Hub',
  '5 Crown Plaza, Westlands Business Park',
  'Nairobi',
  'Kenya',
  '+254 20 555 0300',
  'nairobi@crownportlogistics.site',
  'Mon–Fri 8:00am–6:00pm EAT, Sat 9:00am–1:00pm EAT',
  ARRAY['Parcel Drop-off', 'Pickup Scheduling', 'Standard Delivery', 'Customer Service'],
  6
),
(
  'Singapore — Asia Pacific Gateway',
  '1 Changi Business Park, #12-01 Crown Tower',
  'Singapore',
  'Singapore',
  '+65 6223 8800',
  'singapore@crownportlogistics.site',
  'Mon–Fri 8:00am–6:00pm SGT, Sat 9:00am–1:00pm SGT',
  ARRAY['Parcel Drop-off', 'Pickup Scheduling', 'Customs Assistance', 'Express Processing', 'International Transit', 'Freight Handling', 'eCommerce Fulfilment'],
  7
);

-- ============================================================
-- RATE TABLE (base rates + regional zone rates)
-- ============================================================
DELETE FROM rate_table;

-- Global fallback rates (Worldwide → Worldwide)
INSERT INTO rate_table (origin_zone, destination_zone, service_type, base_fee, per_kg_rate, min_weight, currency) VALUES
  ('Worldwide', 'Worldwide', 'EXPRESS',       35.00,  8.00, 0.1, 'USD'),
  ('Worldwide', 'Worldwide', 'STANDARD',      18.00,  4.00, 0.1, 'USD'),
  ('Worldwide', 'Worldwide', 'INTERNATIONAL', 22.00,  5.00, 0.1, 'USD'),
  ('Worldwide', 'Worldwide', 'FREIGHT',       50.00,  3.00, 5.0, 'USD'),
  ('Worldwide', 'Worldwide', 'ECOMMERCE',     10.00,  2.50, 0.1, 'USD'),
  ('Worldwide', 'Worldwide', 'SAMEDAY',       75.00, 12.00, 0.1, 'USD');

-- Africa zone (×1.2 regional multiplier baked in)
INSERT INTO rate_table (origin_zone, destination_zone, service_type, base_fee, per_kg_rate, min_weight, currency) VALUES
  ('Worldwide', 'Africa', 'EXPRESS',       42.00,  9.60, 0.1, 'USD'),
  ('Worldwide', 'Africa', 'STANDARD',      21.60,  4.80, 0.1, 'USD'),
  ('Worldwide', 'Africa', 'INTERNATIONAL', 26.40,  6.00, 0.1, 'USD'),
  ('Worldwide', 'Africa', 'FREIGHT',       60.00,  3.60, 5.0, 'USD'),
  ('Worldwide', 'Africa', 'ECOMMERCE',     12.00,  3.00, 0.1, 'USD');

-- Americas zone (×1.1 regional multiplier)
INSERT INTO rate_table (origin_zone, destination_zone, service_type, base_fee, per_kg_rate, min_weight, currency) VALUES
  ('Worldwide', 'Americas', 'EXPRESS',       38.50,  8.80, 0.1, 'USD'),
  ('Worldwide', 'Americas', 'STANDARD',      19.80,  4.40, 0.1, 'USD'),
  ('Worldwide', 'Americas', 'INTERNATIONAL', 24.20,  5.50, 0.1, 'USD'),
  ('Worldwide', 'Americas', 'FREIGHT',       55.00,  3.30, 5.0, 'USD'),
  ('Worldwide', 'Americas', 'ECOMMERCE',     11.00,  2.75, 0.1, 'USD');

-- Asia Pacific zone (×1.15 regional multiplier)
INSERT INTO rate_table (origin_zone, destination_zone, service_type, base_fee, per_kg_rate, min_weight, currency) VALUES
  ('Worldwide', 'Asia Pacific', 'EXPRESS',       40.25,  9.20, 0.1, 'USD'),
  ('Worldwide', 'Asia Pacific', 'STANDARD',      20.70,  4.60, 0.1, 'USD'),
  ('Worldwide', 'Asia Pacific', 'INTERNATIONAL', 25.30,  5.75, 0.1, 'USD'),
  ('Worldwide', 'Asia Pacific', 'FREIGHT',       57.50,  3.45, 5.0, 'USD'),
  ('Worldwide', 'Asia Pacific', 'ECOMMERCE',     11.50,  2.88, 0.1, 'USD');

-- Middle East zone (×1.05 regional multiplier)
INSERT INTO rate_table (origin_zone, destination_zone, service_type, base_fee, per_kg_rate, min_weight, currency) VALUES
  ('Worldwide', 'Middle East', 'EXPRESS',       36.75,  8.40, 0.1, 'USD'),
  ('Worldwide', 'Middle East', 'STANDARD',      18.90,  4.20, 0.1, 'USD'),
  ('Worldwide', 'Middle East', 'INTERNATIONAL', 23.10,  5.25, 0.1, 'USD'),
  ('Worldwide', 'Middle East', 'FREIGHT',       52.50,  3.15, 5.0, 'USD'),
  ('Worldwide', 'Middle East', 'ECOMMERCE',     10.50,  2.63, 0.1, 'USD');

-- Europe zone (×1.0, no multiplier)
INSERT INTO rate_table (origin_zone, destination_zone, service_type, base_fee, per_kg_rate, min_weight, currency) VALUES
  ('Worldwide', 'Europe', 'EXPRESS',       35.00,  8.00, 0.1, 'USD'),
  ('Worldwide', 'Europe', 'STANDARD',      18.00,  4.00, 0.1, 'USD'),
  ('Worldwide', 'Europe', 'INTERNATIONAL', 22.00,  5.00, 0.1, 'USD'),
  ('Worldwide', 'Europe', 'FREIGHT',       50.00,  3.00, 5.0, 'USD'),
  ('Worldwide', 'Europe', 'ECOMMERCE',     10.00,  2.50, 0.1, 'USD');
