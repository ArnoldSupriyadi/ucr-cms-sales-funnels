import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ORDER_STATUS_COLORS } from '@/lib/constants/status'
import { formatDate } from '@/lib/utils/format'
import { FileText, ChevronRight } from 'lucide-react'
import type { OrderWithLead } from '@/types/domain'

interface LoaOrdersTableProps {
  orders: OrderWithLead[]
}

/**
 * Tabel daftar order sebagai titik masuk pembuatan LoA.
 * Menggabungkan daftar order + status dokumen LoA dalam satu tampilan.
 */
export function LoaOrdersTable({ orders }: LoaOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-400">Belum ada order.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">No Order</th>
            <th className="px-4 py-3">Klien</th>
            <th className="hidden px-4 py-3 md:table-cell">Tgl Event</th>
            <th className="px-4 py-3">Status</th>
            <th className="hidden px-4 py-3 sm:table-cell">LoA</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order.id} className="transition-colors hover:bg-slate-50/60">
              <td className="px-4 py-3">
                <Link href={`/orders/${order.id}`} className="block">
                  <span className="font-medium text-slate-900 hover:text-indigo-600">
                    {order.event_name || order.order_no}
                  </span>
                  <span className="mt-0.5 block font-mono text-xs text-slate-400">
                    {order.order_no}
                  </span>
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {order.leads?.company_name ?? '-'}
              </td>
              <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                {formatDate(order.event_date)}
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className={ORDER_STATUS_COLORS[order.status]}>
                  {order.status}
                </Badge>
              </td>
              <td className="hidden px-4 py-3 sm:table-cell">
                {/* Status LoA — placeholder hingga persistence DB siap */}
                <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-500">
                  Belum dibuat
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/orders/${order.id}/loa`}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Buat LoA
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
