# UCR Sales Funnel — Development Guide
**Versi:** 1.1.0 | **Tanggal:** 25 Mei 2026
**Stack:** Next.js 14 (App Router) + Supabase + VPS Hetzner

---

## 1. Urutan Setup (Lakukan Sekali)

### Step 1 — Supabase: Jalankan Migration
```
Supabase Dashboard → SQL Editor → New Query
Paste: docs/migration_001_init.sql → Run
Paste: docs/seeder.sql → Run
Paste: docs/seeder_leads.sql → Run
```

### Step 2 — Buat First Super Admin
```sql
-- Di Supabase SQL Editor, setelah daftar via Auth:
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'Super Admin')
WHERE email = 'superadminucr@gmail.com';
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
npx shadcn@latest add button input select textarea label
npx shadcn@latest add table card badge dialog sheet
npx shadcn@latest add form
npx shadcn@latest add tabs
npx shadcn@latest add dropdown-menu command popover
npx shadcn@latest add alert-dialog
npx shadcn@latest add separator skeleton
npx shadcn@latest add sonner
```

### Step 5 — Install Dependencies Tambahan
```bash
# Core Supabase
npm install @supabase/supabase-js @supabase/ssr

# Document generation
npm install docx pdf-lib

# Charts
npm install chart.js react-chartjs-2

# Icons (sudah include via shadcn)
npm install lucide-react

# Form handling (sudah include via shadcn form)
npm install react-hook-form zod @hookform/resolvers

# Date
npm install date-fns
```

### Step 6 — Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://mtpzxtqalqqghwokqkkf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NODE_ENV=development
```

### Step 7 — Generate TypeScript Types dari Supabase
```bash
npx supabase login
npx supabase gen types typescript \
  --project-id mtpzxtqalqqghwokqkkf \
  > src/types/database.ts
```
Jalankan ulang setiap kali ada perubahan schema database.

---

## 2. Struktur Folder (Feature-Based)

```
ucr-sales-funnel/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx              # Sidebar + header wrapper
│   │   │   ├── leads/
│   │   │   │   ├── page.tsx            # List leads
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx        # Detail lead + contacts
│   │   │   │       └── edit/page.tsx
│   │   │   │
│   │   │   ├── bookings/
│   │   │   │   ├── page.tsx            # Pipeline view
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx        # Detail + status timeline
│   │   │   │       ├── loa/page.tsx
│   │   │   │       ├── ib/page.tsx     # CC only
│   │   │   │       └── beo/page.tsx
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx            # Default: P&L
│   │   │   │   ├── top-accounts/page.tsx
│   │   │   │   ├── top-sales/page.tsx
│   │   │   │   ├── mtd/page.tsx
│   │   │   │   ├── variance/page.tsx
│   │   │   │   └── forecast/page.tsx
│   │   │   │
│   │   │   ├── targets/page.tsx        # GM only
│   │   │   ├── master-data/
│   │   │   │   ├── recipes/page.tsx
│   │   │   │   ├── packages/page.tsx
│   │   │   │   └── overhead/page.tsx
│   │   │   └── settings/
│   │   │       ├── users/page.tsx
│   │   │       └── roles/page.tsx      # Super Admin only
│   │   │
│   │   ├── api/
│   │   │   ├── loa/
│   │   │   │   ├── approve/route.ts    # Token approval handler
│   │   │   │   └── pdf/route.ts        # Generate PDF + stamp signature
│   │   │   └── notifications/
│   │   │       └── send/route.ts       # WA/Telegram
│   │   │
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Redirect ke /login atau /bookings
│   │
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components (auto-generated)
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── nav-item.tsx
│   │   └── charts/
│   │       ├── bar-chart.tsx
│   │       ├── line-chart.tsx
│   │       └── donut-chart.tsx
│   │
│   ├── features/
│   │   ├── leads/
│   │   │   ├── components/             # LeadForm, LeadTable, ContactCard
│   │   │   ├── hooks/                  # useLeads, useLead, useLeadContacts
│   │   │   └── actions.ts              # Server Actions
│   │   ├── bookings/
│   │   │   ├── components/             # BookingForm, StatusTimeline, PipelineCard
│   │   │   ├── hooks/
│   │   │   └── actions.ts
│   │   ├── loa/
│   │   │   ├── components/             # LoaForm, LoaPreview, ApprovalBanner
│   │   │   ├── hooks/
│   │   │   └── actions.ts              # createLoa, submitForApproval, approveLoa
│   │   ├── ib/
│   │   │   ├── components/             # IbForm, FoodCostTable, OverheadTable, GpSummary
│   │   │   ├── hooks/
│   │   │   └── actions.ts
│   │   ├── beo/
│   │   │   ├── components/             # BeoForm, BeoPreview
│   │   │   ├── hooks/
│   │   │   └── actions.ts
│   │   └── reports/
│   │       ├── components/             # PnlTable, TopAccountsChart, dll
│   │       ├── hooks/
│   │       └── queries.ts              # SQL/RPC queries untuk reports
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # createBrowserClient
│   │   │   ├── server.ts               # createServerClient
│   │   │   └── middleware.ts
│   │   ├── auth/
│   │   │   └── permissions.ts          # checkPermission(user, 'leads.create')
│   │   ├── documents/
│   │   │   ├── loa-pdf.ts              # pdf-lib: generate + stamp signature
│   │   │   └── loa-docx.ts             # docx: generate Word
│   │   ├── notifications/
│   │   │   └── whatsapp.ts             # WA Business API / Telegram Bot
│   │   ├── utils/
│   │   │   ├── format.ts               # formatRupiah, formatDate
│   │   │   ├── booking-no.ts           # Generate UCR-YYYYMM-XXX
│   │   │   └── cn.ts                   # clsx + tailwind-merge
│   │   └── constants/
│   │       ├── segmen.ts               # ['Wedding','Private','Corporate','BUMN','Government']
│   │       └── status.ts               # Booking/LoA status colors & labels
│   │
│   ├── types/
│   │   ├── database.ts                 # Auto-generated dari Supabase
│   │   ├── domain.ts                   # Business domain types
│   │   └── api.ts                      # API request/response types
│   │
│   └── middleware.ts                   # Auth session + role guard
│
├── .github/
│   └── workflows/
│       └── deploy.yml                  # CI/CD ke VPS
├── ecosystem.config.js                 # PM2 config
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 3. Urutan Development (6 Bulan)

### Bulan 1 — Foundation
- [ ] Setup project (Step 1–7 di atas)
- [ ] Buat Supabase client helper (browser + server)
- [ ] Setup middleware auth (redirect ke login kalau belum login)
- [ ] Layout dashboard: sidebar, header, nav
- [ ] Halaman login (Supabase Auth email/password)
- [ ] Role guard: cek permissions di middleware

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
- [ ] Suggest selling price block (conditional — null = hidden)
- [ ] Form BEO + BEO Darurat flag
- [ ] Version history untuk semua dokumen (revision_no)

### Bulan 5 — Reports & Targets
- [ ] Target management (GM sets monthly target)
- [ ] P&L report (Chart.js bar chart + table)
- [ ] Top 10 Spending Account
- [ ] Top Sales per person
- [ ] MTD (Month to Date)
- [ ] Variance (Actual vs Target)
- [ ] Forecasting (pipeline Tentative + Definite)
- [ ] Export Excel + PDF untuk P&L dan Top 10

### Bulan 6 — Deploy & Polish
- [ ] Error handling, loading states, empty states
- [ ] Settings: user management, role management UI
- [ ] Master data UI: update price_per_pax untuk NULL recipes
- [ ] Testing end-to-end semua flow
- [ ] Setup VPS Hetzner CX22 (Ubuntu 22.04, region Singapura)
- [ ] Install Node.js 20, PM2, Nginx, Certbot
- [ ] Setup GitHub Actions deploy workflow
- [ ] Setup SSL via Certbot + domain
- [ ] Deploy ke VPS — ikuti Section 5 di guide ini

---

## 4. Konvensi Penting

### Naming
- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Hooks: file `use-leads.ts`, export `useLeads`
- Server Actions: file `actions.ts` per feature, export named functions
- Constants: `SCREAMING_SNAKE_CASE` untuk values, `camelCase` untuk arrays/objects

### Supabase Patterns
```typescript
// Server Component (read data)
import { createServerClient } from '@/lib/supabase/server'
const supabase = await createServerClient()
const { data } = await supabase.from('leads').select('*, lead_contacts(*)')

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
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(n)
```

### Permission Check
```typescript
// Gunakan permissions jsonb dari roles
const canApprove = user.role.permissions['loa.approve'] === true
```

### Perubahan Schema Database
Jangan edit `migration_001_init.sql` yang sudah dijalankan. Buat file baru:
```
docs/migration_002_nama_perubahan.sql
```
Ini standar — setiap perubahan schema adalah migration baru yang di-append.

---

## 5. Deploy ke VPS (Hetzner + Nginx + PM2 + GitHub Actions)

### 5.1 Spesifikasi VPS
- Provider: **Hetzner** (hetzner.com)
- Plan: **CX22** — 2 vCPU, 4GB RAM, 40GB SSD = €4/bulan
- OS: **Ubuntu 22.04 LTS**
- Region: **Singapura**

---

### 5.2 Setup VPS (Lakukan Sekali)

**Install dependencies:**
```bash
sudo apt update && sudo apt upgrade -y

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2
sudo npm install -g pm2

# Nginx
sudo apt install -y nginx

# Certbot (SSL gratis)
sudo apt install -y certbot python3-certbot-nginx
```

**Buat user deploy (jangan pakai root):**
```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo su - deploy
```

**Setup SSH key untuk GitHub Actions:**
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Copy private key ini ke GitHub Secrets (VPS_SSH_KEY)
cat ~/.ssh/github_actions
```

---

### 5.3 Nginx Config

```bash
sudo nano /etc/nginx/sites-available/ucr-sales-funnel
```

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

```bash
sudo ln -s /etc/nginx/sites-available/ucr-sales-funnel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL
sudo certbot --nginx -d app.umaracatering.com
```

---

### 5.4 Environment Variables di VPS

```bash
nano /home/deploy/ucr-sales-funnel/.env.production
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://mtpzxtqalqqghwokqkkf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production
PORT=3000
```

---

### 5.5 PM2 Config

Buat `ecosystem.config.js` di root Next.js project:

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

Deploy pertama kali (manual):
```bash
cd /home/deploy/ucr-sales-funnel
git clone https://github.com/username/ucr-sales-funnel.git .
npm install
npm run build
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

---

### 5.6 GitHub Actions — CI/CD

Buat `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main

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

      - name: Install & Build
        run: |
          npm ci
          npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Deploy ke VPS
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: deploy
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /home/deploy/ucr-sales-funnel
            git pull origin main
            npm ci --omit=dev
            npm run build
            pm2 restart ucr-sales-funnel
            echo "Deploy selesai!"
```

**GitHub Secrets yang perlu ditambahkan:**
(GitHub repo → Settings → Secrets and variables → Actions)

| Secret | Value |
|---|---|
| `VPS_HOST` | IP address VPS |
| `VPS_SSH_KEY` | Private key dari step 5.2 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

---

### 5.7 Flow Deploy Setelah Setup

```
git push origin main
→ GitHub Actions: install + build + test
→ SSH ke VPS: git pull + build + pm2 restart
→ Selesai dalam ~2-3 menit
```

### 5.8 Monitoring

```bash
pm2 status                        # status app
pm2 logs ucr-sales-funnel         # logs real-time
pm2 monit                         # CPU + RAM usage
pm2 restart ucr-sales-funnel      # restart manual
```

---

## 6. File-file di Folder docs/

| File | Keterangan |
|---|---|
| `PROJECT_BRIEF_UCR.md` | Master reference — baca ini dulu di Claude Code |
| `DEVELOPMENT_GUIDE.md` | File ini — setup, struktur, roadmap, deploy |
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

---

*Terakhir diupdate: 25 Mei 2026 — Arnold Supriyadi / PT Umara Cipta Rasa*
*Versi: 1.1.0 — Final, siap development*
