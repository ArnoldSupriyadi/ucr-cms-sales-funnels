import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { PipelineCard } from '@/features/bookings/components/pipeline-card'
import { Button } from '@/components/ui/button'
import { Plus, CalendarDays, TrendingUp } from 'lucide-react'
import type { BookingWithLead, BookingStatus } from '@/types/domain'

const PIPELINE_COLUMNS: {
  status: BookingStatus
  label: string
  bg: string
  border: string
  dot: string
  count_bg: string
}[] = [
  {
    status: 'Tentative',
    label: 'Tentative',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
    count_bg: 'bg-amber-100 text-amber-700',
  },
  {
    status: 'Definite',
    label: 'Definite',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-400',
    count_bg: 'bg-blue-100 text-blue-700',
  },
  {
    status: 'Actual',
    label: 'Actual',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
    count_bg: 'bg-emerald-100 text-emerald-700',
  },
  {
    status: 'Cancel',
    label: 'Cancel',
    bg: 'bg-red-50',
    border: 'border-red-200',
    dot: 'bg-red-400',
    count_bg: 'bg-red-100 text-red-700',
  },
]

export default async function BookingsPage() {
  const [supabase, user] = await Promise.all([createClient(), getAppUser()])
  if (!user) return null

  const { data } = await supabase
    .from('bookings')
    .select('*, leads(id, company_name, segmen), users(id, name)')
    .order('event_date', { ascending: true })

  const bookings = (data ?? []) as BookingWithLead[]
  const totalActive = bookings.filter((b) => b.status !== 'Cancel').length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pipeline Booking</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {totalActive} booking aktif · {bookings.length} total
          </p>
        </div>
        {user.permissions['bookings.create'] && (
          <Link href="/bookings/new">
            <Button className="gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20">
              <Plus className="h-4 w-4" />
              Buat Booking
            </Button>
          </Link>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {PIPELINE_COLUMNS.map(({ status, label, dot, count_bg }) => {
          const count = bookings.filter((b) => b.status === status).length
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

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {PIPELINE_COLUMNS.map(({ status, label, bg, border, dot, count_bg }) => {
          const col = bookings.filter((b) => b.status === status)
          return (
            <div key={status} className="flex flex-col gap-3">
              {/* Column header */}
              <div className={`flex items-center justify-between rounded-xl border px-4 py-2.5 ${bg} ${border}`}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  <span className="text-sm font-bold text-slate-700">{label}</span>
                </div>
                <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${count_bg}`}>
                  {col.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2 min-h-[120px]">
                {col.length === 0 ? (
                  <div className={`rounded-xl border-2 border-dashed ${border} p-6 text-center`}>
                    <p className="text-xs text-slate-400">Tidak ada booking</p>
                  </div>
                ) : (
                  col.map((booking) => (
                    <PipelineCard key={booking.id} booking={booking} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
