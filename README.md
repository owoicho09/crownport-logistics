# Crownport Logistics

Production-grade courier and shipment tracking web application for **crownportlogistics.site**.

## Tech Stack

- **Framework**: Next.js 16 App Router (TypeScript)
- **Database**: Supabase (PostgreSQL + Storage)
- **Email**: Resend
- **Styling**: Tailwind CSS v4
- **Hosting**: Vercel

## Project Structure

```
app/
├── page.tsx              # Homepage (/)
├── (public)/             # Public route group (Header/Footer layout)
│   ├── track/            # /track and /track/[code]
│   ├── ship/             # /ship — shipment submission form
│   ├── services/         # /services
│   ├── rates/            # /rates — rate calculator
│   ├── destinations/     # /destinations
│   ├── locations/        # /locations
│   ├── pickup/           # /pickup — pickup request form
│   ├── about/            # /about
│   └── contact/          # /contact
├── admin/                # /admin — protected admin panel
│   ├── page.tsx          # Dashboard
│   ├── shipments/        # Shipment list + detail
│   ├── create/           # Create shipment manually
│   ├── exceptions/       # Exceptions queue
│   ├── pickups/          # Pickup requests
│   ├── notifications/    # Notification templates
│   ├── reports/          # Analytics
│   ├── rates/            # Rate table CRUD
│   ├── destinations/     # Destinations CRUD
│   ├── locations/        # Locations CRUD
│   ├── settings/         # Company settings
│   ├── users/            # Admin user management
│   ├── audit/            # Audit log
│   └── test/             # Test mode / sandbox
├── api/                  # API routes
│   ├── ship/             # POST /api/ship
│   ├── pickup/           # POST /api/pickup
│   ├── contact/          # POST /api/contact
│   ├── track/[code]/     # GET /api/track/[code]
│   ├── rates/calculate/  # POST /api/rates/calculate
│   └── admin/            # Admin API routes
components/
├── public/               # Public-facing components
└── admin/                # Admin panel components
lib/
├── supabase/             # Supabase clients (browser, server, admin)
├── email.ts              # Resend email utilities
├── tracking-code.ts      # Tracking code generation
├── logger.ts             # Structured server-side logger
├── audit.ts              # Audit log writer
└── utils.ts              # General utilities
types/
├── database.ts           # TypeScript types for all DB tables
└── declarations.d.ts     # Module declarations
supabase/migrations/
├── 001_schema.sql        # Full database schema
├── 002_rls.sql           # Row Level Security policies
└── 003_seed.sql          # Optional sample data
```

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd crownport-logistics
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `RESEND_API_KEY` | Your Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender email for Resend |
| `RESEND_FROM_NAME` | Sender display name |
| `ADMIN_ALERT_EMAIL` | Email for admin alerts (new shipments, pickups, etc.) |
| `NEXT_PUBLIC_SITE_URL` | Production URL, e.g. `https://crownportlogistics.site` |
| `NEXT_PUBLIC_COMPANY_NAME` | Company display name |

### 3. Run database migrations

In your Supabase project's SQL editor, run the migration files in order:

```
supabase/migrations/001_schema.sql
supabase/migrations/002_rls.sql
supabase/migrations/003_seed.sql   ← optional sample data
```

Or use the Supabase CLI:
```bash
supabase db push
```

### 4. Create the first admin user

In the Supabase dashboard:
1. Go to **Authentication → Users** and create a new user (email + password)
2. In the **SQL editor**, insert their admin profile:

```sql
INSERT INTO admin_profiles (id, full_name, email, role, is_active)
VALUES (
  '<user-uuid-from-auth>',
  'Your Name',
  'your@email.com',
  'admin',
  true
);
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in Vercel
3. Add all environment variables from `.env.local`
4. Deploy

The project is pre-configured for Vercel with `next.config.ts`.

## Key Features

### Public Site
- Homepage with live tracking input
- Tracking page (`/track/[code]`) with stepper, timeline, auto-polls every 30s
- Multi-step ship form — creates shipment + sends confirmation email
- Rate calculator using the admin-managed rate table
- Destinations, locations, pickup request, about, contact

### Admin Panel (`/admin`)
- Dashboard with KPI tiles and recent shipments
- Full shipment table with filters, search, pagination
- Shipment detail with event timeline, status updates, notifications, POD upload
- Tracking event creation with automatic status transitions
- Email notification system with editable templates
- Exceptions queue, pickup request management
- Rate table CRUD, destinations CRUD, locations CRUD
- Reports with charts (status distribution, top countries, by service)
- Settings (company info, stats, email config)
- User management (create/deactivate admin users)
- Audit log (all mutations logged with actor + diff)
- Test Mode sandbox (create/simulate test shipments, preview notifications)

## Tracking Code Format

`{SERVICE_PREFIX}{8-DIGIT-SERIAL}{CHECK_CHAR}{COUNTRY_CODE}`

Examples:
- `EX00000001CGBR` — Express to Great Britain, serial #1
- `ST00000045CUSA` — Standard to USA, serial #45

Service prefixes: `EX` Express · `ST` Standard · `FR` Freight · `IN` International · `EC` eCommerce · `SD` Same-Day

## Notes

- FedEx and UPS are **not integrated** — they appear only as a `physical_carrier` text field on shipments
- All tracking codes, notifications, and data are owned by Crownport
- Test shipments are completely invisible on public tracking pages and live dashboard counts
- All email notifications are sent via Resend; test emails are prefixed with `[TEST]`
