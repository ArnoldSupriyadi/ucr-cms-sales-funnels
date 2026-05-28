import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { SEGMEN_COLORS } from '@/lib/constants/segmen'
import { BOOKING_STATUS_COLORS } from '@/lib/constants/status'
import { formatDate } from '@/lib/utils/format'
import { CalendarDays, Users, Building2 } from 'lucide-react'
import type { BookingWithLead } from '@/types/domain'

interface PipelineCardProps {
  booking: BookingWithLead
}

export function PipelineCard({ booking }: PipelineCardProps) {
  return (
    <Link href={`/bookings/${booking.id}`}>
      <div className="group bg-white rounded-xl border border-slate-200/80 p-4 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/8 transition-all duration-200 cursor-pointer">

        {/* Event name */}
        <p className="font-semibold text-sm text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
          {booking.event_name || booking.leads.company_name}
        </p>

        {/* Booking no */}
        <p className="text-[11px] font-mono text-slate-400 mt-0.5">{booking.booking_no}</p>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {formatDate(booking.event_date)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {booking.pax} pax
          </span>
        </div>

        {/* Company + segmen */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
          <p className="text-xs text-slate-600 font-medium truncate">
            {booking.leads.company_name}
          </p>
          {booking.leads.segmen && (
            <Badge
              variant="outline"
              className={`ml-auto shrink-0 text-[10px] py-0 px-1.5 ${SEGMEN_COLORS[booking.leads.segmen]}`}
            >
              {booking.leads.segmen}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  )
}
