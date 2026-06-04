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
                  Dibuat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-gray-50/50">
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
                  <td className="px-4 py-3.5 text-xs text-gray-400">
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
