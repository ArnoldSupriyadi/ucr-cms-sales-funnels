# Dashboard + Sidebar Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tambah halaman `/dashboard` sebagai landing page setelah login dengan KPI cards + tabel order terbaru + greeting, rewrite sidebar menjadi light theme bergaya TailAdmin dengan nav groups, dan ubah semua redirect post-login ke `/dashboard`.

**Architecture:** `dashboard/page.tsx` adalah Server Component yang fetch semua data sekaligus via `Promise.all`, konsisten dengan pola `leads/page.tsx`. Sidebar direwrite total menggunakan grouped nav structure dengan dua section (MAIN MENU, MANAGEMENT). Tidak ada client-side hooks baru untuk dashboard.

**Tech Stack:** Next.js 16 App Router, Supabase SSR, Tailwind CSS, shadcn/ui Badge, Lucide icons.

---

## File Map

| Action | File |
|--------|------|
| **REWRITE** | `components/layout/sidebar.tsx` |
| **MODIFY** | `components/layout/header.tsx` |
| **CREATE** | `features/dashboard/components/kpi-cards.tsx` |
| **CREATE** | `features/dashboard/components/recent-orders.tsx` |
| **CREATE** | `app/(dashboard)/dashboard/page.tsx` |
| **MODIFY** | `proxy.ts` |
| **MODIFY** | `app/(auth)/login/page.tsx` |

---

## Task 1: Rewrite sidebar.tsx — light theme, grouped nav

**Files:**
- Rewrite: `components/layout/sidebar.tsx`

- [ ] **Step 1: Baca file saat ini**

Baca `components/layout/sidebar.tsx` untuk memahami struktur yang ada sebelum diubah.

- [ ] **Step 2: Tulis ulang `components/layout/sidebar.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  Target,
  Database,
  Settings,
  ChefHat,
} from 'lucide-react'
import type { AppUser } from '@/types/domain'
import type { Permissions } from '@/types/domain'

const NAV_GROUPS: {
  label: string
  items: {
    href: string
    label: string
    icon: React.ElementType
    permission: keyof Permissions | null
  }[]
}[] = [
  {
    label: 'MAIN MENU',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: null },
      { href: '/orders',    label: 'Orders',    icon: CalendarDays,    permission: null },
      { href: '/leads',     label: 'Leads',     icon: Users,           permission: null },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { href: '/reports',              label: 'Reports',     icon: BarChart3, permission: 'reports.view' },
      { href: '/targets',              label: 'Targets',     icon: Target,    permission: 'targets.manage' },
      { href: '/master-data/recipes',  label: 'Master Data', icon: Database,  permission: 'master_data.manage' },
      { href: '/settings/users',       label: 'Settings',    icon: Settings,  permission: 'users.manage' },
    ],
  },
]

interface SidebarProps {
  user: AppUser
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-500/30">
          <ChefHat className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 tracking-wide">Umara</p>
          <p className="text-[10px] text-gray-400 -mt-0.5">Sales Funnel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (!item.permission) return true
            return user.permissions[item.permission] === true
          })
          if (visibleItems.length === 0) return null

          return (
            <div key={group.label} className="mb-4">
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon
                  const active =
                    pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                        active
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0',
                          active ? 'text-indigo-600' : 'text-gray-400'
                        )}
                      />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-gray-100 p-3">
        <Link
          href="/settings/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="truncate text-[11px] text-gray-400">{user.role.name}</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Verifikasi tidak ada TypeScript error**

```bash
npx tsc --noEmit 2>&1 | grep sidebar
```

Expected: tidak ada output (no errors).

- [ ] **Step 4: Commit**

```bash
git add components/layout/sidebar.tsx
git commit -m "feat: rewrite sidebar — light theme, grouped nav, tambah Dashboard"
```

---

## Task 2: Update header.tsx — tambah /dashboard

**Files:**
- Modify: `components/layout/header.tsx`

- [ ] **Step 1: Baca file saat ini**

Baca `components/layout/header.tsx` untuk melihat `PAGE_TITLES`.

- [ ] **Step 2: Tambahkan `/dashboard` ke `PAGE_TITLES`**

Cari objek `PAGE_TITLES` dan tambahkan entry pertama:

```typescript
const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',   // ← tambahkan ini di paling atas
  '/orders': 'Orders',
  '/leads': 'Leads',
  '/reports': 'Reports',
  '/targets': 'Targets',
  '/master-data/recipes': 'Master Data',
  '/settings/users': 'Settings',
}
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/header.tsx
git commit -m "feat: tambah /dashboard ke PAGE_TITLES header"
```

---

## Task 3: Buat KpiCards component

**Files:**
- Create: `features/dashboard/components/kpi-cards.tsx`

- [ ] **Step 1: Buat folder**

```bash
mkdir -p features/dashboard/components
```

- [ ] **Step 2: Buat `features/dashboard/components/kpi-cards.tsx`**

```typescript
import { Users, CalendarDays, TrendingUp, UserPlus } from 'lucide-react'

interface KpiCardsProps {
  totalLeads: number
  totalOrders: number
  activeOrders: number
  leadsThisMonth: number
}

interface KpiCardProps {
  label: string
  value: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

function KpiCard({ label, value, icon: Icon, iconBg, iconColor }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {value.toLocaleString('id-ID')}
          </p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}

export function KpiCards({ totalLeads, totalOrders, activeOrders, leadsThisMonth }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Total Leads"
        value={totalLeads}
        icon={Users}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />
      <KpiCard
        label="Total Orders"
        value={totalOrders}
        icon={CalendarDays}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
      />
      <KpiCard
        label="Order Aktif"
        value={activeOrders}
        icon={TrendingUp}
        iconBg="bg-green-50"
        iconColor="text-green-600"
      />
      <KpiCard
        label="Leads Bulan Ini"
        value={leadsThisMonth}
        icon={UserPlus}
        iconBg="bg-orange-50"
        iconColor="text-orange-600"
      />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add features/dashboard/components/kpi-cards.tsx
git commit -m "feat: buat KpiCards component untuk dashboard"
```

---

## Task 4: Buat RecentOrders component

**Files:**
- Create: `features/dashboard/components/recent-orders.tsx`

- [ ] **Step 1: Buat `features/dashboard/components/recent-orders.tsx`**

```typescript
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils/format'
import { CalendarDays } from 'lucide-react'
import type { OrderStatus } from '@/types/domain'

const STATUS_STYLES: Record<OrderStatus, string> = {
  Tentative: 'border-amber-200 bg-amber-50 text-amber-700',
  Definite:  'border-blue-200 bg-blue-50 text-blue-700',
  Actual:    'border-green-200 bg-green-50 text-green-700',
  Cancel:    'border-red-200 bg-red-50 text-red-700',
}

interface RecentOrder {
  id: string
  status: OrderStatus
  event_date: string
  event_name: string | null
  created_at: string
  leads: { company_name: string } | null
  users: { name: string } | null
}

interface RecentOrdersProps {
  orders: RecentOrder[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-base font-semibold text-gray-800">Order Terbaru</h2>
        <p className="mt-0.5 text-xs text-gray-400">10 order yang baru ditambahkan</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
          <CalendarDays className="h-8 w-8 opacity-30" />
          <p className="text-sm">Belum ada order</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Klien / Acara
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Tgl Event
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Sales
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Ditambahkan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3.5">
                    <p className="font-semibold text-gray-800">
                      {order.leads?.company_name ?? '—'}
                    </p>
                    {order.event_name && (
                      <p className="mt-0.5 text-xs text-gray-400">{order.event_name}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">
                    {formatDate(order.event_date)}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">
                    {order.users?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3.5 text-gray-400 text-xs">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add features/dashboard/components/recent-orders.tsx
git commit -m "feat: buat RecentOrders component untuk dashboard"
```

---

## Task 5: Buat dashboard/page.tsx

Server Component yang fetch semua data dan render KpiCards + RecentOrders.

**Files:**
- Create: `app/(dashboard)/dashboard/page.tsx`

- [ ] **Step 1: Buat folder**

```bash
mkdir -p "app/(dashboard)/dashboard"
```

- [ ] **Step 2: Buat `app/(dashboard)/dashboard/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { KpiCards } from '@/features/dashboard/components/kpi-cards'
import { RecentOrders } from '@/features/dashboard/components/recent-orders'
import type { OrderStatus } from '@/types/domain'

export default async function DashboardPage() {
  const [supabase, user] = await Promise.all([createClient(), getAppUser()])
  if (!user) return null

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const firstName = user.name.split(' ')[0]
  const today = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const [
    { count: totalLeads },
    { count: totalOrders },
    { count: activeOrders },
    { count: leadsThisMonth },
    { data: recentOrdersRaw },
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'Cancel'),
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth),
    supabase
      .from('orders')
      .select('id, status, event_date, event_name, created_at, leads(company_name), users(name)')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const recentOrders = (recentOrdersRaw ?? []).map((o) => ({
    id: o.id as string,
    status: o.status as OrderStatus,
    event_date: o.event_date as string,
    event_name: o.event_name as string | null,
    created_at: o.created_at as string,
    leads: Array.isArray(o.leads) ? o.leads[0] ?? null : (o.leads as { company_name: string } | null),
    users: Array.isArray(o.users) ? o.users[0] ?? null : (o.users as { name: string } | null),
  }))

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <p className="text-sm text-gray-400">{today}</p>
        <h1 className="mt-0.5 text-2xl font-bold text-gray-800">
          Selamat datang, {firstName} 👋
        </h1>
      </div>

      {/* KPI Cards */}
      <KpiCards
        totalLeads={totalLeads ?? 0}
        totalOrders={totalOrders ?? 0}
        activeOrders={activeOrders ?? 0}
        leadsThisMonth={leadsThisMonth ?? 0}
      />

      {/* Recent Orders */}
      <RecentOrders orders={recentOrders} />
    </div>
  )
}
```

- [ ] **Step 3: Verifikasi tidak ada TypeScript error**

```bash
npx tsc --noEmit 2>&1 | grep -i "dashboard\|kpi\|recent"
```

Expected: tidak ada output.

- [ ] **Step 4: Commit**

```bash
git add "app/(dashboard)/dashboard/page.tsx"
git commit -m "feat: buat dashboard page — greeting, KPI cards, recent orders"
```

---

## Task 6: Update redirects post-login

Ubah semua redirect dari `/orders` → `/dashboard` di proxy.ts dan login/page.tsx.

**Files:**
- Modify: `proxy.ts`
- Modify: `app/(auth)/login/page.tsx`

- [ ] **Step 1: Baca kedua file**

Baca `proxy.ts` dan `app/(auth)/login/page.tsx` untuk memastikan lokasi redirect yang tepat.

- [ ] **Step 2: Update `proxy.ts`**

Cari baris:
```typescript
return NextResponse.redirect(new URL('/orders', request.url))
```

Ganti dengan:
```typescript
return NextResponse.redirect(new URL('/dashboard', request.url))
```

- [ ] **Step 3: Update `app/(auth)/login/page.tsx`**

Cari baris:
```typescript
router.push('/orders')
```

Ganti dengan:
```typescript
router.push('/dashboard')
```

- [ ] **Step 4: Commit**

```bash
git add proxy.ts "app/(auth)/login/page.tsx"
git commit -m "feat: ubah redirect post-login ke /dashboard"
```

---

## Task 7: Verifikasi akhir

- [ ] **Step 1: Pastikan tidak ada import yang rusak**

```bash
npx tsc --noEmit 2>&1
```

Expected: tidak ada error.

- [ ] **Step 2: Test manual di browser**

Buka `http://localhost:3000` dan verifikasi:
- [ ] Login → langsung diarahkan ke `/dashboard`
- [ ] Dashboard tampil dengan tanggal hari ini + greeting nama user
- [ ] 4 KPI cards tampil dengan angka (tidak ada NaN atau undefined)
- [ ] Tabel "Order Terbaru" tampil dengan data atau empty state yang benar
- [ ] Badge status order berwarna sesuai (Tentative=amber, Definite=blue, Actual=green, Cancel=red)
- [ ] Sidebar light theme tampil dengan benar — background putih, border kanan abu
- [ ] Menu Dashboard aktif (bg-indigo-50) saat di halaman `/dashboard`
- [ ] Group label "MAIN MENU" dan "MANAGEMENT" tampil di sidebar
- [ ] Navigasi ke halaman lain (Orders, Leads) tetap berfungsi
- [ ] Active state sidebar berubah saat berpindah halaman
- [ ] User info di bawah sidebar tampil dengan nama dan role

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: selesai dashboard page + sidebar light theme redesign"
```
