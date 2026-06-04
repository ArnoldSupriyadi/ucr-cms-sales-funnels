import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusTimeline } from '@/features/orders/components/status-timeline'
import { StatusChangeActions } from '@/features/orders/components/status-change-actions'
import { ORDER_STATUS_COLORS, ORDER_STATUS_TRANSITIONS } from '@/lib/constants/status'
import { SEGMEN_COLORS } from '@/lib/constants/segmen'
import { formatDate } from '@/lib/utils/format'
import {
  Pencil,
  CalendarDays,
  Users,
  MapPin,
  AlertTriangle,
  Clock,
  FileText,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import type { OrderWithDetails } from '@/types/domain'

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ created?: string }>
}) {
  const { id } = await params
  const { created } = await searchParams
  const [supabase, user] = await Promise.all([createClient(), getAppUser()])
  if (!user) return null

  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      leads(*, lead_contacts(*)),
      users!orders_sales_id_fkey(id, name),
      order_status_logs(*)
    `)
    .eq('id', id)
    .single()

  if (!data) notFound()

  const order = data as OrderWithDetails
  const canEdit = user.permissions['orders.edit'] === true
  const nextStatuses = ORDER_STATUS_TRANSITIONS[order.status]

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Banner: order baru dibuat → ajak buat LoA */}
      {created && (
        <div className="flex flex-col gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            <span>
              <b>Order berhasil dibuat.</b> Lanjut lengkapi dokumen LoA?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/orders/${id}/loa`}>
              <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700">
                <FileText className="h-3.5 w-3.5" />
                Buat LoA
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link
              href={`/orders/${id}`}
              className="text-sm font-medium text-green-700 hover:underline"
            >
              Nanti saja
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-slate-900">
              {order.event_name || order.order_no}
            </h1>
            <Badge
              variant="outline"
              className={ORDER_STATUS_COLORS[order.status]}
            >
              {order.status}
            </Badge>
            {order.is_exception && (
              <Badge variant="outline" className="bg-orange-100 text-orange-800 gap-1">
                <AlertTriangle className="h-3 w-3" />
                Pengecualian
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 font-mono mt-1">
            {order.order_no}
          </p>
        </div>
        {canEdit && nextStatuses.length > 0 && (
          <StatusChangeActions
            orderId={order.id}
            currentStatus={order.status}
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
                <CardTitle className="text-base">Detail Order</CardTitle>
                {canEdit && (
                  <Link href={`/orders/${id}/edit`}>
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
                      href={`/leads/${order.leads.id}`}
                      className="hover:underline text-slate-900"
                    >
                      {order.leads.company_name}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Sales</dt>
                  <dd className="font-medium mt-0.5">
                    {order.users?.name ?? '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Tanggal Event</dt>
                  <dd className="font-medium mt-0.5 flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    {formatDate(order.event_date)}
                  </dd>
                </div>
                {order.event_time && (
                  <div>
                    <dt className="text-slate-500">Waktu Kegiatan</dt>
                    <dd className="font-medium mt-0.5 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {order.event_time}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-slate-500">Jumlah Pax</dt>
                  <dd className="font-medium mt-0.5 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    {order.pax} pax
                  </dd>
                </div>
                {order.event_type && (
                  <div>
                    <dt className="text-slate-500">Jenis Event</dt>
                    <dd className="font-medium mt-0.5">{order.event_type}</dd>
                  </div>
                )}
                {order.segmen && (
                  <div>
                    <dt className="text-slate-500">Segmen</dt>
                    <dd className="mt-0.5">
                      <Badge
                        variant="outline"
                        className={SEGMEN_COLORS[order.segmen]}
                      >
                        {order.segmen}
                      </Badge>
                    </dd>
                  </div>
                )}
                {order.venue && (
                  <div className="col-span-2">
                    <dt className="text-slate-500">Venue</dt>
                    <dd className="font-medium mt-0.5 flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                      {order.venue}
                    </dd>
                  </div>
                )}
                {order.is_exception && order.exception_reason && (
                  <div className="col-span-2">
                    <dt className="text-slate-500 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                      Alasan Pengecualian
                    </dt>
                    <dd className="mt-0.5 text-orange-700">{order.exception_reason}</dd>
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
            <CardContent className="space-y-3">
              {/* LoA — aksi utama */}
              <Link
                href={`/orders/${id}/loa`}
                className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 transition-colors hover:bg-indigo-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">LoA</p>
                  <p className="text-xs text-slate-500">Letter of Agreement</p>
                </div>
                <Button size="sm" className="gap-1.5 bg-indigo-500 hover:bg-indigo-600">
                  Buat LoA
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>

              {/* IB & BEO — sekunder */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'IB', href: `/orders/${id}/ib`, desc: 'Internal Breakdown' },
                  { label: 'BEO', href: `/orders/${id}/beo`, desc: 'Banquet Event Order' },
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
                logs={order.order_status_logs ?? []}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
