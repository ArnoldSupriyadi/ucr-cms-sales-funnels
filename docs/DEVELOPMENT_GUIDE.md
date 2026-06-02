# UCR Sales Funnel — Development Guide
**Versi:** 2.0.0 | **Tanggal:** 2 Juni 2026
**Stack:** Next.js 16 (App Router, `proxy.ts`) + React 19 + Supabase + shadcn/ui + Tailwind 4 + VPS Hetzner

---

## 1. Setup

### 1A — Setup di Laptop Baru (repo & database sudah ada)

Kasus paling umum sekarang. Project sudah jadi di GitHub dan Supabase sudah live —
tinggal clone, install, isi env, jalan.

```bash
git clone https://github.com/ArnoldSupriyadi/ucr-cms-sales-funnels.git
cd ucr-cms-sales-funnels
npm install
cp .env.example .env.local        # lalu isi 2 key (lihat di bawah)
npm run dev                        # http://localhost:3000
```

**Isi `.env.local`** — ambil dari Supabase Dashboard → Project Settings → API
(project `mtpzxtqalqqghwokqkkf`). `.env.example` sudah berisi URL + instruksinya:

| Variable | Sumber |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | sudah terisi di `.env.example` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project API keys → **anon public** |
| `SUPABASE_SERVICE_ROLE_KEY` | Project API keys → **service_role** (⚠️ rahasia) |

> **Database tidak perlu di-setup ulang.** Supabase itu cloud bersama dan semua
> migration sudah dijalankan di sana. Laptop baru cukup pakai key yang sama →
> langsung connect ke DB yang sama.

Perintah harian: `npm run dev` (jalankan), `npm run build` (build),
`npm run lint` (lint), `npm test` (unit test Vitest), `npm run test:watch` (watch mode).

---

### 1B — Setup Supabase dari Nol (hanya jika membuat project DB baru)

Hanya perlu kalau bikin instance Supabase baru (mis. environment staging terpisah).

**Step 1 — Jalankan migration + seed** (Supabase Dashboard → SQL Editor → New Query):
```
Paste: db/migrations/001_init.sql      → Run
Paste: db/migrations/002_loa_discount.sql → Run   (semua migration berurutan)
Paste: db/seeds/seeder.sql             → Run
Paste: db/seeds/seeder_leads.sql       → Run
```

**Step 2 — Buat first Super Admin** (setelah daftar user via Supabase Auth):
```sql
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'Super Admin')
WHERE email = 'superadmin@umara.co.id';
```

**Step 3 — (Opsional) Regenerate TypeScript types:**
```bash
npx supabase login
npx supabase gen types typescript --project-id <PROJECT_ID> > types/database.ts
```
Catatan: selama UAT, `types/database.ts` lebih sering di-edit manual mengikuti tiap
file migration baru (lihat §4 "Perubahan Schema Database").

---

## 2. Struktur Folder (Feature-Based)

> **Tanpa `src/`** — semua di root. **`proxy.ts`** (bukan `middleware.ts`) sesuai
> konvensi Next.js 16. Sebagian folder di bawah masih target (IB/BEO/reports belum dibangun).

```
ucr-cms-sales-funnels/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Sidebar + header wrapper
│   │   ├── leads/
│   │   │   ├── page.tsx                # List leads
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Detail lead + contacts
│   │   │       └── edit/page.tsx
│   │   │
│   │   ├── orders/                     # DB: tabel `bookings`
│   │   │   ├── page.tsx                # Pipeline view
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Detail + status timeline
│   │   │       ├── edit/page.tsx
│   │   │       ├── loa/page.tsx
│   │   │       ├── ib/page.tsx         # CC only
│   │   │       └── beo/page.tsx
│   │   │
│   │   ├── reports/                    # (target)
│   │   ├── targets/page.tsx            # GM only (target)
│   │   ├── master-data/               # recipes/packages/overhead (target)
│   │   └── settings/                   # users/roles (target)
│   │
│   ├── api/                            # loa/approve, loa/pdf, notifications (target)
│   ├── layout.tsx
│   └── page.tsx                        # Redirect ke /login atau /orders
│
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── layout/                         # sidebar, header, nav-item
│   └── charts/                         # bar/line/donut (target)
│
├── features/                           # per-domain: components/ + actions.ts
│   ├── leads/                          # LeadForm, LeadTable, ContactCard
│   ├── orders/                         # OrderForm, StatusTimeline, PipelineCard
│   ├── loa/                            # (Bulan 3 — sedang dibangun)
│   ├── ib/                             # (target)
│   ├── beo/                            # (target)
│   └── reports/                        # (target)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # createClient (browser)
│   │   └── server.ts                   # createClient (server, async)
│   ├── auth/
│   │   └── permissions.ts              # getAppUser(); user.permissions['loa.create']
│   ├── loa/                            # calculations, selection-rules, menu-detail, doc-no, catalog
│   ├── utils/
│   │   ├── format.ts                   # formatRupiah, formatDate
│   │   ├── order-no.ts                 # Generate UCR-YYYYMM-XXX (nomor Order)
│   │   └── cn.ts                       # clsx + tailwind-merge
│   ├── documents/                      # loa-pdf, loa-docx (target)
│   └── notifications/                  # whatsapp/telegram (target)
│
├── types/
│   ├── database.ts                     # Tipe Supabase (di-maintain manual selama UAT)
│   └── domain.ts                       # ActionResult<T> + business domain types
│
├── db/                                 # SQL (jalankan manual di Supabase — lihat §6)
│   ├── migrations/                     # 001_init.sql, 002_loa_discount.sql, ...
│   ├── seeds/
│   └── reset_database.sql
│
├── docs/                               # PROJECT_BRIEF, guide ini, specs/, superpowers/
├── proxy.ts                            # Auth session + role guard (Next.js 16)
├── vitest.config.ts
├── .env.example                        # template env (commit) — .env.local rahasia (gitignore)
├── next.config.ts
└── package.json
```

---

## 3. Urutan Development (6 Bulan)

### Bulan 1 — Foundation ✅
- [x] Setup project (lihat §1)
- [x] Buat Supabase client helper (browser + server)
- [x] Setup `proxy.ts` auth (redirect ke login kalau belum login) + single-session enforcement
- [x] Layout dashboard: sidebar (collapsible) , header, nav
- [x] Halaman login (Supabase Auth email/password)
- [x] Role guard: cek permissions di `proxy.ts`

### Bulan 2 — Core Data: Leads & Orders (DB: tabel `bookings`)
- [x] CRUD Leads + Lead Contacts
- [x] CRUD Orders + status change flow
- [x] Order status timeline component
- [x] Generate booking_no otomatis (UCR-YYYYMM-XXX) — util `lib/utils/order-no.ts`
- [ ] RLS test: sales hanya lihat lead sendiri

### Bulan 3 — Dokumen: LoA 🔄 (sedang dikerjakan)
> Plan detail: `docs/superpowers/plans/2026-06-02-loa-form.md` (17 task, 4 fase).
> Progres: Task 1–2 (Vitest + migration diskon) & Task 4 (kalkulasi harga, TDD) selesai.
- [ ] Form LoA wizard 4 langkah (multi-item, auto-calculate pricing) — *in progress*
- [ ] Menu drawer drill-down (dari menu_packages + katalog)
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
// Server Component / Server Action (read & write data)
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()   // catatan: async di server
const { data } = await supabase.from('leads').select('*, lead_contacts(*)')

// Server Action — tambahkan directive di atas file
'use server'
import { createClient } from '@/lib/supabase/server'

// Client Component (realtime / interactive)
import { createClient } from '@/lib/supabase/client'  // sync
```

### Auth & Permission
```typescript
import { getAppUser } from '@/lib/auth/permissions'
const user = await getAppUser()
if (!user?.permissions['loa.approve']) { /* tolak */ }
```

### Server Action Return Type
Pakai discriminated union `ActionResult<T>` dari `@/types/domain`:
```typescript
{ success: true; data: T } | { success: false; error: string }
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
Tidak ada migration tool (Drizzle/Prisma/Supabase CLI) — semua SQL dijalankan manual
paste di Supabase SQL Editor.

**Selama UAT** (sekarang): tiap perubahan schema = file baru berurutan
(`002_xxx.sql`, `003_...`) berisi `ALTER`/`CREATE`. Jalankan **file itu saja** di SQL Editor.
Jangan edit file yang sudah dijalankan, jangan reset — supaya data UAT tidak hilang.
Update `types/database.ts` manual mengikuti perubahan.

**Saat UAT selesai** (sebelum produksi): squash isi semua file `002+` ke dalam
`001_init.sql` di posisi yang tepat, lalu hapus file `002+` — agar baseline produksi
satu file bersih yang dijalankan dari nol.

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

## 6. Peta File Dokumentasi & Database

**`docs/` — dokumentasi naratif**
| File | Keterangan |
|---|---|
| `PROJECT_BRIEF_UCR.md` | Master reference — baca ini dulu di Claude Code |
| `DEVELOPMENT_GUIDE.md` | File ini — setup, struktur, roadmap, deploy |
| `BUG_TRACKER.md` | Catatan bug & solusi |
| `flowchart_ucr_v2.png` | Flowchart happy path + exception path |
| `specs/*.docx` | Requirement formal: BRD, ERD, LoA/IB/BEO, Permission Matrix, Format Reporting |

**`db/` — database (jalankan manual di Supabase SQL Editor)**
| File | Keterangan |
|---|---|
| `migrations/001_init.sql` | DDL 16 tabel + RLS + default roles. Jalankan pertama. |
| `migrations/002_loa_discount.sql` | Kolom diskon LoA (`discount_type` + `discount_value`). |
| `seeds/seeder.sql` | master_recipes (30 SKU) + menu_packages (25 paket) |
| `seeds/seeder_leads.sql` | 1,054 leads + 1,079 lead_contacts dari data sales |
| `seeds/seeder_menus.sql` | Seed menu tambahan |
| `reset_database.sql` | ⚠️ DESTRUKTIF — drop semua tabel. Hati-hati. |

---

*Terakhir diupdate: 2 Juni 2026 — Arnold Supriyadi / PT Umara Cipta Rasa*
*Versi: 2.0.0 — disesuaikan dengan kondisi codebase aktual (Next.js 16, tanpa src/, proxy.ts)*
