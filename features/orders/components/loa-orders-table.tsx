import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ORDER_STATUS_COLORS } from '@/lib/constants/status'
import { formatDateRange } from '@/lib/utils/format'
import { FileText, ChevronRight, Eye } from 'lucide-react'
import type { OrderWithLead } from '@/types/domain'

interface LoaOrdersTableProps {
  orders: OrderWithLead[]
  /** Map booking_id (order.id) → status LoA (loa_status_enum). Order tanpa entri = belum ada LoA. */
  loaStatusByOrder: Map<string, string>
}

// Label + warna badge per status LoA (loa_status_enum)
const LOA_LABEL: Record<string, string> = {
  draft: 'Draft',
  pending_approval: 'Menunggu Approval',
  approved: 'Disetujui',
  sent: 'Terkirim',
  final: 'Final',
  revised: 'Revisi',
}
const LOA_BADGE: Record<string, string> = {
  draft: 'border-amber-200 bg-amber-50 text-amber-700',
  pending_approval: 'border-blue-200 bg-blue-50 text-blue-700',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  sent: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  final: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  revised: 'border-orange-200 bg-orange-50 text-orange-700',
}

/**
 * Tabel daftar order sebagai titik masuk pembuatan LoA.
 * Menggabungkan daftar order + status dokumen LoA dalam satu tampilan.
 */
export function LoaOrdersTable({ orders, loaStatusByOrder }: LoaOrdersTableProps) {
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
          {orders.map((order) => {
            const loaStatus = loaStatusByOrder.get(order.id)
            const loaLabel = loaStatus ? LOA_LABEL[loaStatus] ?? loaStatus : 'Belum dibuat'
            const loaBadgeCls = loaStatus
              ? LOA_BADGE[loaStatus] ?? 'border-slate-200 bg-slate-50 text-slate-600'
              : 'border-slate-200 bg-slate-50 text-slate-500'
            const actionLabel = !loaStatus
              ? 'Buat LoA'
              : loaStatus === 'draft'
                ? 'Lanjut LoA'
                : 'Lihat LoA'
            return (
            <tr key={order.id} className="transition-colors hover:bg-slate-50/60">
              <td className="px-4 py-3">
                <Link href={`/orders/${order.id}`} className="group block w-fit">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-900 underline decoration-slate-300 decoration-dashed underline-offset-4 transition-colors group-hover:text-indigo-600 group-hover:decoration-indigo-400">
                    {order.event_name || order.order_no}
                    <Eye className="h-3.5 w-3.5 text-slate-300 transition-colors group-hover:text-indigo-500" />
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
                {formatDateRange(order.event_date, order.event_date_end)}
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className={ORDER_STATUS_COLORS[order.status]}>
                  {order.status}
                </Badge>
              </td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <Badge variant="outline" className={loaBadgeCls}>
                  {loaLabel}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Detail
                  </Link>
                  <Link
                    href={`/orders/${order.id}/loa`}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {actionLabel}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
