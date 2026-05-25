# UCR Sales Funnel — Development Guide
**Versi:** 1.0.0 | **Tanggal:** 2026-05-25  
**Stack:** Next.js 14 (App Router) + Supabase + Vercel

---

## 1. Urutan Setup (Lakukan Sekali)

### Step 1 — Supabase: Jalankan Migration
```
Supabase Dashboard → SQL Editor → New Query
Paste: migration_001_init.sql → Run
Paste: seeder.sql → Run
Paste: seeder_leads.sql → Run
```

### Step 2 — Buat First Super Admin
```sql
-- Di Supabase SQL Editor, setelah daftar via Auth:
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'Super Admin')
WHERE email = 'arnoldsupriyadi@gmail.com';
```

### Step 3 — Init Next.js Project
```bash
npx create-next-app@latest ucr-sales-funnel \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd ucr-sales-funnel
```

### Step 4 — Setup shadcn/ui
```bash
# Init shadcn/ui (jalankan setelah create-next-app)
npx shadcn@latest init
```
Pilih saat prompted:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

Lalu install komponen yang dibutuhkan:
```bash
# Komponen utama dashboard
npx shadcn@latest add button input select textarea label
npx shadcn@latest add table card badge dialog sheet
npx shadcn@latest add form          # react-hook-form + zod integration
npx shadcn@latest add tabs          # untuk Reports (6 tab)
npx shadcn@latest add dropdown-menu command popover  # untuk filter + search
npx shadcn@latest add alert-dialog  # untuk konfirmasi status change
npx shadcn@latest add separator skeleton  # layout + loading state
npx shadcn@latest add sonner        # toast notifications
```

### Step 5 — Install Dependencies Tambahan
```bash
# Core
npm install @supabase/supabase-js @supabase/ssr

# Document generation
npm install docx pdf-lib

# Charts
npm install chart.js react-chartjs-2

# Utilities (sudah include clsx + tailwind-merge via shadcn)
npm install lucide-react

# Form handling (sudah include via shadcn form)
npm install react-hook-form zod @hookform/resolvers

# Date
npm install date-fns

# Dev tools
npm install -D @types/node
```

### Step 5 — Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://mtpzxtqalqqghwokqkkf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here  # server only
```

---

## 2. Struktur Folder (Feature-Based)

```
ucr-sales-funnel/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Route group: halaman login
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/              # Route group: semua halaman utama
│   │   │   ├── layout.tsx            # Sidebar + header wrapper
│   │   │   │
│   │   │   ├── leads/                # FEATURE: Leads
│   │   │   │   ├── page.tsx          # List leads
│   │   │   │   ├── new/page.tsx      # Form tambah lead
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # Detail lead + contacts
│   │   │   │       └── edit/page.tsx
│   │   │   │
│   │   │   ├── bookings/             # FEATURE: Bookings
│   │   │   │   ├── page.tsx          # List bookings (pipeline view)
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # Detail booking + status timeline
│   │   │   │       ├── loa/page.tsx  # LoA form
│   │   │   │       ├── ib/page.tsx   # IB form (CC only)
│   │   │   │       └── beo/page.tsx  # BEO form
│   │   │   │
│   │   │   ├── reports/              # FEATURE: Reports (6 tabs)
│   │   │   │   ├── page.tsx          # Default: P&L
│   │   │   │   ├── top-accounts/page.tsx
│   │   │   │   ├── top-sales/page.tsx
│   │   │   │   ├── mtd/page.tsx
│   │   │   │   ├── variance/page.tsx
│   │   │   │   └── forecast/page.tsx
│   │   │   │
│   │   │   ├── targets/              # FEATURE: Targets (GM only)
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── master-data/          # FEATURE: Master data
│   │   │   │   ├── recipes/page.tsx
│   │   │   │   ├── packages/page.tsx
│   │   │   │   └── overhead/page.tsx
│   │   │   │
│   │   │   └── settings/             # FEATURE: Settings (Super Admin)
│   │   │       ├── users/page.tsx
│   │   │       └── roles/page.tsx
│   │   │
│   │   ├── api/                      # API Routes (server-side only)
│   │   │   ├── loa/
│   │   │   │   ├── approve/route.ts  # GET: token link handler (GM approval)
│   │   │   │   └── pdf/route.ts      # POST: generate PDF with pdf-lib
│   │   │   ├── brd/
│   │   │   │   └── generate/route.ts # POST: generate Word doc with docx
│   │   │   └── notifications/
│   │   │       └── send/route.ts     # POST: WA/Telegram notification
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Redirect to /login or /bookings
│   │
│   ├── components/                   # Shared UI components
│   │   ├── ui/                       # Primitives (Button, Input, Modal, dll)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx             # Status badge (Tentative, Definite, dll)
│   │   │   └── card.tsx
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── nav-item.tsx
│   │   │
│   │   └── charts/                   # Chart.js wrappers
│   │       ├── bar-chart.tsx
│   │       ├── line-chart.tsx
│   │       └── donut-chart.tsx
│   │
│   ├── features/                     # Feature-specific logic
│   │   ├── leads/
│   │   │   ├── components/           # LeadForm, LeadTable, ContactCard
│   │   │   ├── hooks/                # useLeads, useLead, useLeadContacts
│   │   │   └── actions.ts            # Server Actions: createLead, updateLead
│   │   │
│   │   ├── bookings/
│   │   │   ├── components/           # BookingForm, StatusTimeline, PipelineCard
│   │   │   ├── hooks/                # useBookings, useBooking
│   │   │   └── actions.ts            # createBooking, updateStatus
│   │   │
│   │   ├── loa/
│   │   │   ├── components/           # LoaForm, LoaPreview, ApprovalBanner
│   │   │   ├── hooks/                # useLoa
│   │   │   └── actions.ts            # createLoa, submitForApproval, approveLoa
│   │   │
│   │   ├── ib/
│   │   │   ├── components/           # IbForm, FoodCostTable, OverheadTable, GpSummary
│   │   │   ├── hooks/                # useIb
│   │   │   └── actions.ts            # createIb, updateIb
│   │   │
│   │   ├── beo/
│   │   │   ├── components/           # BeoForm, BeoPreview
│   │   │   ├── hooks/                # useBeo
│   │   │   └── actions.ts            # createBeo, updateBeo
│   │   │
│   │   └── reports/
│   │       ├── components/           # PnlTable, TopAccountsChart, dll
│   │       ├── hooks/                # useReportPnl, useTopAccounts, dll
│   │       └── queries.ts            # SQL/RPC queries untuk reports
│   │
│   ├── lib/                          # Shared utilities & config
│   │   ├── supabase/
│   │   │   ├── client.ts             # createBrowserClient (untuk komponen)
│   │   │   ├── server.ts             # createServerClient (untuk Server Components)
│   │   │   └── middleware.ts         # Session refresh middleware
│   │   ├── auth/
│   │   │   └── permissions.ts        # checkPermission(user, 'leads.create')
│   │   ├── documents/
│   │   │   ├── loa-pdf.ts            # pdf-lib: generate + stamp signature
│   │   │   └── loa-docx.ts           # docx: generate Word version
│   │   ├── notifications/
│   │   │   └── whatsapp.ts           # WA Business API / Telegram Bot
│   │   ├── utils/
│   │   │   ├── format.ts             # formatRupiah, formatDate, dll
│   │   │   ├── booking-no.ts         # Generate UCR-YYYYMM-XXX
│   │   │   └── cn.ts                 # clsx + tailwind-merge helper
│   │   └── constants/
│   │       ├── segmen.ts             # ['Wedding','Private','Corporate','BUMN','Government']
│   │       └── status.ts             # Booking/LoA status colors, labels
│   │
│   ├── types/                        # TypeScript types
│   │   ├── database.ts               # Generated from Supabase (supabase gen types)
│   │   ├── domain.ts                 # Business domain types (Lead, Booking, dll)
│   │   └── api.ts                    # API request/response types
│   │
│   └── middleware.ts                 # Next.js middleware: auth session + role guard
│
├── supabase/
│   └── migrations/
│       └── 20260525000001_init.sql   # Copy dari migration_001_init.sql
│
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 3. Urutan Development (6 Bulan)

### Bulan 1 — Foundation
- [ ] Setup project (Step 1–5 di atas)
- [ ] Generate TypeScript types dari Supabase: `npx supabase gen types typescript`
- [ ] Buat Supabase client helper (browser + server)
- [ ] Setup middleware auth (redirect ke login kalau belum login)
- [ ] Layout dashboard: sidebar, header, nav
- [ ] Halaman login (Supabase Auth email/password)

### Bulan 2 — Core Data: Leads & Bookings
- [ ] CRUD Leads + Lead Contacts
- [ ] CRUD Bookings + status change flow
- [ ] Booking status timeline component
- [ ] Generate booking_no otomatis (UCR-YYYYMM-XXX)
- [ ] RLS test: sales hanya lihat lead sendiri

### Bulan 3 — Dokumen: LoA
- [ ] Form LoA (multi-item, auto-calculate pricing)
- [ ] Menu packages dropdown (dari tabel menu_packages)
- [ ] Generate LoA PDF dengan pdf-lib
- [ ] Approval flow: generate token → kirim WA/Telegram → GM approve via link
- [ ] Overlay signature GM ke PDF setelah approve

### Bulan 4 — Dokumen: IB & BEO
- [ ] Form IB: food cost dari master_recipes (autocomplete SKU)
- [ ] Overhead items + suggestions dari overhead_library
- [ ] Auto-calculate GP, GP%
- [ ] Suggest selling price block (conditional)
- [ ] Form BEO + BEO Darurat flag
- [ ] Version history untuk semua dokumen

### Bulan 5 — Reports & Targets
- [ ] Target management (GM sets monthly target)
- [ ] P&L report (Chart.js bar chart + table)
- [ ] Top 10 Spending Account
- [ ] Top Sales per person
- [ ] MTD (Month to Date)
- [ ] Variance (Actual vs Target)
- [ ] Forecasting (berdasarkan pipeline Tentative + Definite)
- [ ] Export Excel + PDF untuk P&L dan Top 10

### Bulan 6 — Polish & Production
- [ ] Settings: user management, role management UI
- [ ] Master data UI: update price_per_pax untuk NULL recipes
- [ ] Notifikasi real-time (Supabase Realtime untuk status changes)
- [ ] Error handling, loading states, empty states
- [ ] Testing end-to-end semua flow
- [ ] Deploy ke Vercel

---

## 4. Konvensi Penting

### Naming
- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Hooks: `use-camelCase` → file: `use-leads.ts`, export: `useLeads`
- Server Actions: file `actions.ts` per feature, export named functions
- Constants: `SCREAMING_SNAKE_CASE` untuk values, `camelCase` untuk arrays/objects

### Supabase Patterns
```typescript
// Server Component (read data)
import { createServerClient } from '@/lib/supabase/server'
const supabase = await createServerClient()
const { data, error } = await supabase.from('leads').select('*, lead_contacts(*)')

// Server Action (write data)
'use server'
import { createServerClient } from '@/lib/supabase/server'

// Client Component (realtime / interactive)
import { createBrowserClient } from '@/lib/supabase/client'
```

### Format Rupiah
```typescript
// lib/utils/format.ts
export const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
```

### Permission Check
```typescript
// Gunakan permissions jsonb dari roles
const canApprove = user.role.permissions['loa.approve'] === true
```

---

## 5. Generate TypeScript Types dari Supabase

Jalankan setelah migration berhasil:
```bash
npx supabase login
npx supabase gen types typescript \
  --project-id mtpzxtqalqqghwokqkkf \
  > src/types/database.ts
```

Ini generate tipe otomatis untuk semua 16 tabel — tidak perlu tulis manual.

---

## 6. File-file yang Tersedia di Folder Ini

| File | Keterangan |
|---|---|
| `migration_001_init.sql` | DDL 16 tabel + RLS + default roles. Jalankan pertama. |
| `seeder.sql` | master_recipes (30 SKU) + menu_packages (25 paket) |
| `seeder_leads.sql` | 1,054 leads + 1,079 lead_contacts dari data sales |
| `BRD_Sales_Dashboard_UCR_v3.docx` | Business Requirements Document final |
| `ERD_UCR_v1.docx` | Entity Relationship Diagram 16 tabel |
| `LoA_Struktur_Requirements_UCR_v1.docx` | Spesifikasi dokumen LoA |
| `IB_Struktur_Requirements_UCR_v1.docx` | Spesifikasi dokumen IB |
| `BEO_Struktur_Requirements_UCR_v1.docx` | Spesifikasi dokumen BEO |
| `Format_Reporting_UCR_v1.docx` | Spesifikasi 6 tab reports |
| `Permission_Matrix_UCR_v1.docx` | Matrix permission per role |
| `PROJECT_BRIEF_UCR.md` | Ringkasan seluruh project (untuk referensi cepat) |
