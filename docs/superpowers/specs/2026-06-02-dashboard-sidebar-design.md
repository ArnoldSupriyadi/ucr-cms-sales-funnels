# Dashboard Page + Sidebar Redesign — Design Spec
**Date:** 2026-06-02
**Status:** Approved

---

## Overview

Tambah halaman `/dashboard` sebagai landing page setelah login, rewrite sidebar menjadi light theme mengikuti gaya TailAdmin, dan ubah semua redirect post-login dari `/orders` ke `/dashboard`.

---

## Goals

- User langsung melihat ringkasan bisnis setelah login (bukan pipeline orders)
- Sidebar lebih clean dan modern dengan light theme TailAdmin
- Dashboard menampilkan KPI cards + tabel order terbaru + greeting personal

---

## File Changes

### Baru
```
app/(dashboard)/dashboard/page.tsx
features/dashboard/components/kpi-cards.tsx
features/dashboard/components/recent-orders.tsx
```

### Dimodifikasi
```
components/layout/sidebar.tsx          — rewrite total, light theme
components/layout/header.tsx           — tambah /dashboard ke PAGE_TITLES
proxy.ts                               — redirect /orders → /dashboard setelah login
app/(auth)/login/page.tsx              — router.push('/orders') → /dashboard
```

### Tidak berubah
```
app/(dashboard)/layout.tsx
features/dashboard/actions.ts          — tidak dibuat, data fetch langsung di page.tsx
```

---

## Architecture

`dashboard/page.tsx` adalah Server Component. Fetch semua data (leads count, orders count, recent orders) dalam satu fungsi async menggunakan `Promise.all` — konsisten dengan pola `leads/page.tsx` dan `orders/page.tsx`. Tidak ada client-side hooks untuk dashboard.

---

## Component Design

### 1. `app/(dashboard)/dashboard/page.tsx`

Server Component. Fetch:
- `COUNT(*)` dari tabel `leads` → total leads
- `COUNT(*)` dari tabel `orders` → total orders
- `COUNT(*)` dari tabel `orders` WHERE status != 'Cancel' → order aktif (Tentative + Definite + Actual)
- `COUNT(*)` dari tabel `leads` WHERE `created_at >= awal bulan ini` → leads bulan ini
- 10 orders terbaru dengan join ke `leads(company_name)` dan `users(name)` → recent orders

Render:
```tsx
<div>
  {/* Greeting area */}
  <div>
    <p>{tanggal hari ini — format panjang Indonesia}</p>
    <h1>Selamat datang, {firstName} 👋</h1>
  </div>

  <KpiCards data={kpiData} />
  <RecentOrders orders={recentOrders} />
</div>
```

`firstName` = kata pertama dari `user.name` (split by space, take [0]).

Tanggal format: `new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })` → "Senin, 2 Juni 2026"

### 2. `features/dashboard/components/kpi-cards.tsx`

Client Component (`'use client'` tidak diperlukan — murni presentational, bisa Server Component).

4 kartu dalam grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`:

| Kartu | Nilai | Ikon | Warna accent |
|---|---|---|---|
| Total Leads | totalLeads | Users | Blue |
| Total Orders | totalOrders | CalendarDays | Indigo |
| Order Aktif | activeOrders | TrendingUp | Green |
| Leads Bulan Ini | leadsThisMonth | UserPlus | Orange |

Setiap kartu:
- Background putih, rounded-xl, shadow-sm, border border-gray-100
- Angka besar (`text-3xl font-bold text-gray-800`)
- Label kecil di bawah angka (`text-sm text-gray-500`)
- Ikon di pojok kanan dalam circle berwarna sesuai accent

Props:
```ts
interface KpiCardsProps {
  totalLeads: number
  totalOrders: number
  activeOrders: number
  leadsThisMonth: number
}
```

### 3. `features/dashboard/components/recent-orders.tsx`

Tabel 10 order terbaru. Server Component (presentational).

Kolom:
| Kolom | Data |
|---|---|
| Klien / Acara | `leads.company_name` |
| Status | Badge warna per status (pakai SEGMEN_COLORS pattern) |
| Tanggal Event | `event_date` (format: "2 Jun 2026") |
| Sales | `users.name` |
| Ditambahkan | `created_at` (formatDate) |

Empty state: ilustrasi sederhana + teks "Belum ada order".

Props:
```ts
interface RecentOrdersProps {
  orders: Array<{
    id: string
    event_date: string | null
    status: OrderStatus
    created_at: string
    leads: { company_name: string }
    users: { name: string } | null
  }>
}
```

---

## Sidebar Redesign

### Struktur

```
┌─────────────────────────┐
│  [Logo]  Umara           │
│          Sales Funnel    │
├─────────────────────────┤
│  MAIN MENU               │
│  Dashboard               │
│  Orders                  │
│  Leads                   │
│                          │
│  MANAGEMENT              │
│  Reports                 │
│  Targets                 │
│  Master Data             │
│  Settings                │
├─────────────────────────┤
│  [A]  Arnold Supriyadi   │
│       Super Admin        │
└─────────────────────────┘
```

### Styling

| Element | Class |
|---|---|
| Container | `bg-white border-r border-gray-200 w-[260px]` |
| Logo area | `border-b border-gray-100 h-16 px-5` |
| Section label | `text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1 mt-4` |
| Inactive item | `text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg` |
| Active item | `bg-indigo-50 text-indigo-700 border-l-2 border-indigo-600 rounded-r-lg font-semibold` |
| User area | `border-t border-gray-100 p-3` |

### Nav Groups

```ts
const NAV_GROUPS = [
  {
    label: 'MAIN MENU',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: null },
      { href: '/orders',    label: 'Orders',    icon: CalendarDays,     permission: null },
      { href: '/leads',     label: 'Leads',     icon: Users,            permission: null },
    ]
  },
  {
    label: 'MANAGEMENT',
    items: [
      { href: '/reports',           label: 'Reports',     icon: BarChart3,  permission: 'reports.view' },
      { href: '/targets',           label: 'Targets',     icon: Target,     permission: 'targets.manage' },
      { href: '/master-data/recipes',label: 'Master Data', icon: Database,  permission: 'master_data.manage' },
      { href: '/settings/users',    label: 'Settings',    icon: Settings,   permission: 'users.manage' },
    ]
  }
]
```

---

## Redirect Changes

### `proxy.ts`
```ts
// Sebelum
return NextResponse.redirect(new URL('/orders', request.url))
// Sesudah
return NextResponse.redirect(new URL('/dashboard', request.url))
```

### `app/(auth)/login/page.tsx`
```ts
// Sebelum
router.push('/orders')
// Sesudah
router.push('/dashboard')
```

### `components/layout/header.tsx`
Tambahkan ke `PAGE_TITLES`:
```ts
'/dashboard': 'Dashboard',
```

---

## Non-Goals

- Grafik/chart (line chart, bar chart) — tidak termasuk scope ini
- Filter by date range di dashboard
- Real-time auto-refresh KPI
- Export data dari dashboard
