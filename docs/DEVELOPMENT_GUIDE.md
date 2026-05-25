# UCR Sales Funnel — Development Guide
**Versi:** 1.1.0 | **Tanggal:** 2026-05-25  
**Stack:** Next.js 14 (App Router) + Supabase + VPS (Hetzner)

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
- [ ] Setup VPS Hetzner CX22 (Ubuntu 22.04, region Singapura)
- [ ] Install Node.js 20, PM2, Nginx, Certbot
- [ ] Setup GitHub Actions deploy workflow (`.github/workflows/deploy.yml`)
- [ ] Setup SSL via Certbot + domain
- [ ] Deploy ke VPS — ikuti Section 6 di guide ini

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

## 6. Deploy ke VPS (Tanpa Coolify)

Stack: **Hetzner VPS** + **Nginx** + **PM2** + **GitHub Actions**

### 6.1 Spesifikasi VPS yang Direkomendasikan
- Provider: **Hetzner** (hetzner.com) — paling worth it harga/performa
- Plan: **CX22** — 2 vCPU, 4GB RAM, 40GB SSD = €4/bulan
- OS: **Ubuntu 22.04 LTS**
- Region: **Singapura** (paling dekat Indonesia)

---

### 6.2 Setup VPS (Lakukan Sekali)

**a) Login ke VPS dan install dependencies:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot (SSL gratis dari Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
```

**b) Buat user deploy (jangan pakai root):**
```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo su - deploy
```

**c) Setup SSH key untuk GitHub Actions:**
```bash
# Di VPS, generate SSH key
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# Tambahkan public key ke authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Copy private key — ini yang akan dimasukkan ke GitHub Secrets
cat ~/.ssh/github_actions
```

---

### 6.3 Setup Nginx

Buat config untuk domain kamu (contoh: `app.umaracatering.com`):

```bash
sudo nano /etc/nginx/sites-available/ucr-sales-funnel
```

Isi dengan:
```nginx
server {
    listen 80;
    server_name app.umaracatering.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan dan test:
```bash
sudo ln -s /etc/nginx/sites-available/ucr-sales-funnel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Setup SSL (HTTPS):**
```bash
sudo certbot --nginx -d app.umaracatering.com
# Certbot akan auto-renew setiap 90 hari
```

---

### 6.4 Setup Environment Variables di VPS

```bash
# Di VPS, buat file .env.production
nano /home/deploy/ucr-sales-funnel/.env.production
```

Isi:
```env
NEXT_PUBLIC_SUPABASE_URL=https://mtpzxtqalqqghwokqkkf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production
```

---

### 6.5 PM2 Config

Buat file `ecosystem.config.js` di root Next.js project:

```js
module.exports = {
  apps: [
    {
      name: 'ucr-sales-funnel',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/home/deploy/ucr-sales-funnel',
      instances: 1,
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
```

Jalankan pertama kali manual:
```bash
cd /home/deploy/ucr-sales-funnel
npm install
npm run build
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup  # agar PM2 auto-start saat VPS reboot
```

---

### 6.6 GitHub Actions — Auto Deploy (CI/CD)

Buat file `.github/workflows/deploy.yml` di repo Next.js:

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main  # deploy otomatis setiap push ke main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: deploy
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /home/deploy/ucr-sales-funnel
            git pull origin main
            npm ci --production
            npm run build
            pm2 restart ucr-sales-funnel
            echo "Deploy selesai!"
```

**GitHub Secrets yang perlu ditambahkan:**

Pergi ke GitHub repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret Name | Value |
|---|---|
| `VPS_HOST` | IP address VPS kamu |
| `VPS_SSH_KEY` | Private key dari step 6.2c |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

---

### 6.7 Flow Deploy Setelah Setup

Setelah semua setup selesai, workflow harian kamu:

```
Code di lokal → git push origin main → GitHub Actions build & test
→ SSH ke VPS → git pull → npm build → pm2 restart → selesai
```

Waktu deploy: sekitar **2–3 menit** per push.

---

### 6.8 Monitoring Sederhana

```bash
# Lihat status app
pm2 status

# Lihat logs real-time
pm2 logs ucr-sales-funnel

# Lihat penggunaan CPU/RAM
pm2 monit

# Restart manual kalau ada masalah
pm2 restart ucr-sales-funnel
```

---

## 7. File-file di Folder docs/

| File | Keterangan |
|---|---|
| `PROJECT_BRIEF_UCR.md` | Master reference — baca ini dulu |
| `DEVELOPMENT_GUIDE.md` | File ini |
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
| `flowchart_ucr_v2.png` | Flowchart happy path + exception path |
