import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ContactCard } from '@/features/leads/components/contact-card'
import { SEGMEN_COLORS } from '@/lib/constants/segmen'
import { formatDate } from '@/lib/utils/format'
import { Pencil, MapPin, Briefcase, CalendarDays } from 'lucide-react'
import type { LeadWithContacts, OrderWithLead } from '@/types/domain'
import { ORDER_STATUS_COLORS } from '@/lib/constants/status'

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [supabase, user] = await Promise.all([createClient(), getAppUser()])
  if (!user) return null

  const [{ data: lead }, { data: orders }] = await Promise.all([
    supabase
      .from('leads')
      .select('*, lead_contacts(*), users(id, name)')
      .eq('id', id)
      .single(),
    supabase
      .from('orders')
      .select('*, leads(id, company_name, segmen), users(id, name)')
      .eq('lead_id', id)
      .order('event_date', { ascending: false }),
  ])

  if (!lead) notFound()

  const canEdit = user.permissions['leads.edit'] === true

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">
              {lead.company_name}
            </h1>
            {lead.segmen && (
              <Badge variant="outline" className={SEGMEN_COLORS[lead.segmen]}>
                {lead.segmen}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
            {lead.address && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {lead.address}
              </span>
            )}
            {lead.line_business && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                {lead.line_business}
              </span>
            )}
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              Ditambahkan {formatDate(lead.created_at)}
            </span>
          </div>
        </div>
        {canEdit && (
          <Link href={`/leads/${id}/edit`}>
            <Button size="sm" variant="outline">
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts */}
        <div className="lg:col-span-1">
          <ContactCard
            leadId={id}
            contacts={(lead as LeadWithContacts).lead_contacts ?? []}
            canEdit={canEdit}
          />
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">
                Orders ({orders?.length ?? 0})
              </CardTitle>
              {user.permissions['orders.create'] && (
                <Link href={`/orders/new?lead_id=${id}`}>
                  <Button size="sm" variant="outline">
                    Buat Order
                  </Button>
                </Link>
              )}
            </CardHeader>
            <CardContent>
              {!orders || orders.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">
                  Belum ada order
                </p>
              ) : (
                <div className="space-y-2">
                  {(orders as OrderWithLead[]).map((order) => (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {order.event_name || order.order_no}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.order_no} · {formatDate(order.event_date)} · {order.pax} pax
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={ORDER_STATUS_COLORS[order.status]}
                      >
                        {order.status}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
