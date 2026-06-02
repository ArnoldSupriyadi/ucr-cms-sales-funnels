import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { KpiCards } from '@/features/dashboard/components/kpi-cards'
import { RecentOrders } from '@/features/dashboard/components/recent-orders'
import type { OrderStatus } from '@/types/domain'

export default async function DashboardPage() {
  const [supabase, user] = await Promise.all([createClient(), getAppUser()])
  if (!user) redirect('/login')

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
    leads: Array.isArray(o.leads)
      ? (o.leads[0] ?? null)
      : (o.leads as { company_name: string } | null),
    users: Array.isArray(o.users)
      ? (o.users[0] ?? null)
      : (o.users as { name: string } | null),
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
