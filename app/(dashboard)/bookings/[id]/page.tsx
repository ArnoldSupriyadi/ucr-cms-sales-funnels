import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusTimeline } from '@/features/bookings/components/status-timeline'
import { StatusChangeActions } from '@/features/bookings/components/status-change-actions'
import { BOOKING_STATUS_COLORS, BOOKING_STATUS_TRANSITIONS } from '@/lib/constants/status'
import { SEGMEN_COLORS } from '@/lib/constants/segmen'
import { formatDate } from '@/lib/utils/format'
import { Pencil, CalendarDays, Users, MapPin, AlertTriangle } from 'lucide-react'
import type { BookingWithDetails } from '@/types/domain'

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [supabase, user] = await Promise.all([createClient(), getAppUser()])
  if (!user) return null

  const { data } = await supabase
    .from('bookings')
    .select(`
      *,
      leads(*, lead_contacts(*)),
      users(id, name),
      booking_status_logs(*)
    `)
    .eq('id', id)
    .single()

  if (!data) notFound()

  const booking = data as BookingWithDetails
  const canEdit = user.permissions['bookings.edit'] === true
  const nextStatuses = BOOKING_STATUS_TRANSITIONS[booking.status]

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-slate-900">
              {booking.event_name || booking.booking_no}
            </h1>
            <Badge
              variant="outline"
              className={BOOKING_STATUS_COLORS[booking.status]}
            >
              {booking.status}
            </Badge>
            {booking.is_exception && (
              <Badge variant="outline" className="bg-orange-100 text-orange-800 gap-1">
                <AlertTriangle className="h-3 w-3" />
                Pengecualian
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 font-mono mt-1">
            {booking.booking_no}
          </p>
        </div>
        {canEdit && nextStatuses.length > 0 && (
          <StatusChangeActions
            bookingId={booking.id}
            currentStatus={booking.status}
            nextStatuses={nextStatuses}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail Info */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Detail Booking</CardTitle>
                {canEdit && (
                  <Link href={`/bookings/${id}/edit`}>
                    <Button size="sm" variant="outline">
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">Klien</dt>
                  <dd className="font-medium mt-0.5">
                    <Link
                      href={`/leads/${booking.leads.id}`}
                      className="hover:underline text-slate-900"
                    >
                      {booking.leads.company_name}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Sales</dt>
                  <dd className="font-medium mt-0.5">
                    {booking.users?.name ?? '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Tanggal Event</dt>
                  <dd className="font-medium mt-0.5 flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    {formatDate(booking.event_date)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Jumlah Pax</dt>
                  <dd className="font-medium mt-0.5 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    {booking.pax} pax
                  </dd>
                </div>
                {booking.event_type && (
                  <div>
                    <dt className="text-slate-500">Jenis Event</dt>
                    <dd className="font-medium mt-0.5">{booking.event_type}</dd>
                  </div>
                )}
                {booking.segmen && (
                  <div>
                    <dt className="text-slate-500">Segmen</dt>
                    <dd className="mt-0.5">
                      <Badge
                        variant="outline"
                        className={SEGMEN_COLORS[booking.segmen]}
                      >
                        {booking.segmen}
                      </Badge>
                    </dd>
                  </div>
                )}
                {booking.venue && (
                  <div className="col-span-2">
                    <dt className="text-slate-500">Venue</dt>
                    <dd className="font-medium mt-0.5 flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                      {booking.venue}
                    </dd>
                  </div>
                )}
                {booking.is_exception && booking.exception_reason && (
                  <div className="col-span-2">
                    <dt className="text-slate-500 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                      Alasan Pengecualian
                    </dt>
                    <dd className="mt-0.5 text-orange-700">{booking.exception_reason}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Dokumen */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Dokumen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'LoA', href: `/bookings/${id}/loa`, desc: 'Letter of Agreement' },
                  { label: 'IB', href: `/bookings/${id}/ib`, desc: 'Internal Breakdown' },
                  { label: 'BEO', href: `/bookings/${id}/beo`, desc: 'Banquet Event Order' },
                ].map((doc) => (
                  <Link
                    key={doc.label}
                    href={doc.href}
                    className="rounded-lg border p-3 text-center hover:bg-slate-50 transition-colors"
                  >
                    <p className="font-semibold text-slate-900">{doc.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.desc}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Timeline */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Riwayat Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline
                logs={booking.booking_status_logs ?? []}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
