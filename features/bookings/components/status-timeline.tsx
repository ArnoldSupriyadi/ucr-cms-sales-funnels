'use client'

import { formatDateTime } from '@/lib/utils/format'
import { BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS } from '@/lib/constants/status'
import type { BookingStatusLog } from '@/types/domain'
import { cn } from '@/lib/utils'

interface StatusTimelineProps {
  logs: BookingStatusLog[]
}

export function StatusTimeline({ logs }: StatusTimelineProps) {
  const sorted = [...logs].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  return (
    <div className="space-y-0">
      {sorted.map((log, i) => {
        const isLast = i === sorted.length - 1
        return (
          <div key={log.id} className="flex gap-3">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'mt-1 h-3 w-3 rounded-full border-2 shrink-0',
                  isLast
                    ? 'border-slate-900 bg-slate-900'
                    : 'border-slate-300 bg-white'
                )}
              />
              {!isLast && (
                <div className="w-px flex-1 bg-slate-200 my-1" />
              )}
            </div>

            {/* Content */}
            <div className={cn('pb-4', isLast && 'pb-0')}>
              <div className="flex items-center gap-2 flex-wrap">
                {log.from_status && (
                  <>
                    <span
                      className={cn(
                        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
                        BOOKING_STATUS_COLORS[log.from_status]
                      )}
                    >
                      {BOOKING_STATUS_LABELS[log.from_status]}
                    </span>
                    <span className="text-slate-400 text-xs">→</span>
                  </>
                )}
                <span
                  className={cn(
                    'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
                    BOOKING_STATUS_COLORS[log.to_status]
                  )}
                >
                  {BOOKING_STATUS_LABELS[log.to_status]}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatDateTime(log.created_at)}
              </p>
              {log.note && (
                <p className="text-xs text-slate-600 mt-1 italic">{log.note}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
