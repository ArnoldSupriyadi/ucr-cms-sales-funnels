import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { LoaOrdersTable } from '@/features/orders/components/loa-orders-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { OrderWithLead, OrderStatus } from '@/types/domain'

const STATUS_SUMMARY: { status: OrderStatus; label: string; dot: string }[] = [
  { status: 'Tentative', label: 'Tentative', dot: 'bg-amber-400' },
  { status: 'Definite', label: 'Definite', dot: 'bg-blue-400' },
  { status: 'Actual', label: 'Actual', dot: 'bg-emerald-400' },
  { status: 'Cancel', label: 'Cancel', dot: 'bg-red-400' },
]

export default async function OrdersPage() {
  const [supabase, user] = await Promise.all([createClient(), getAppUser()])
  if (!user) return null

  const { data } = await supabase
    .from('orders')
    .select('*, leads(id, company_name, segmen)')
    .order('event_date', { ascending: true })

  const orders = (data ?? []) as OrderWithLead[]
  const totalActive = orders.filter((o) => o.status !== 'Cancel').length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">LOA Orders</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {totalActive} order aktif · {orders.length} total · pilih order untuk membuat LoA
          </p>
        </div>
        {user.permissions['orders.create'] && (
          <Link href="/orders/new">
            <Button className="gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20">
              <Plus className="h-4 w-4" />
              Buat Order
            </Button>
          </Link>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATUS_SUMMARY.map(({ status, label, dot }) => {
          const count = orders.filter((o) => o.status === status).length
          return (
            <div key={status} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{count}</p>
            </div>
          )
        })}
      </div>

      {/* Orders table */}
      <LoaOrdersTable orders={orders} />
    </div>
  )
}
