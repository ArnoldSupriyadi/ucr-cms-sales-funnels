import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { SEGMEN_COLORS } from '@/lib/constants/segmen'
import { ORDER_STATUS_COLORS } from '@/lib/constants/status'
import { formatDate } from '@/lib/utils/format'
import { CalendarDays, Users, Building2 } from 'lucide-react'
import type { OrderWithLead } from '@/types/domain'

interface PipelineCardProps {
  order: OrderWithLead
}

export function PipelineCard({ order }: PipelineCardProps) {
  return (
    <Link href={`/orders/${order.id}`}>
      <div className="group bg-white rounded-xl border border-slate-200/80 p-4 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/8 transition-all duration-200 cursor-pointer">

        {/* Event name */}
        <p className="font-semibold text-sm text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
          {order.event_name || order.leads.company_name}
        </p>

        {/* Order no */}
        <p className="text-[11px] font-mono text-slate-400 mt-0.5">{order.order_no}</p>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {formatDate(order.event_date)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {order.pax} pax
          </span>
        </div>

        {/* Company + segmen */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
          <p className="text-xs text-slate-600 font-medium truncate">
            {order.leads.company_name}
          </p>
          {order.leads.segmen && (
            <Badge
              variant="outline"
              className={`ml-auto shrink-0 text-[10px] py-0 px-1.5 ${SEGMEN_COLORS[order.leads.segmen]}`}
            >
              {order.leads.segmen}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  )
}
