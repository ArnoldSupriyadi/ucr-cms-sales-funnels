import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ORDER_STATUS_COLORS } from '@/lib/constants/status'
import { formatDate } from '@/lib/utils/format'
import { FileText, ChevronRight, CalendarDays } from 'lucide-react'
import type { OrderWithLead } from '@/types/domain'

export default async function LoaListPage() {
  const [supabase, user] = await Promise.all([createClient(), getAppUser()])
  if (!user) return null

  const { data } = await supabase
    .from('orders')
    .select('*, leads(id, company_name, segmen)')
    .order('event_date', { ascending: true })

  const orders = (data ?? []) as OrderWithLead[]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
          <FileText className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dokumen LoA</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pilih order untuk membuat atau melengkapi LoA · {orders.length} order
          </p>
        </div>
      </div>

      {/* Order list */}
      <Card>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-slate-400">Belum ada order.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/orders/${order.id}/loa`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900">
                          {order.event_name || order.order_no}
                        </span>
                        <Badge variant="outline" className={ORDER_STATUS_COLORS[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {order.leads?.company_name ?? '-'}
                        <span className="mx-1.5 text-slate-300">·</span>
                        <span className="font-mono text-xs">{order.order_no}</span>
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-1.5 text-sm text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                      {formatDate(order.event_date)}
                    </div>
                    {/* Status LoA — placeholder hingga persistence DB siap */}
                    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-500">
                      Belum dibuat
                    </Badge>
                    <span className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                      Buat LoA
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 sm:hidden" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
