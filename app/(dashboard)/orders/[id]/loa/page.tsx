import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { loadMenuCatalog } from '@/lib/loa/catalog'
import { LoaForm } from '@/features/loa/components/loa-form'
import type { InitialLoaData, SalesUser } from '@/features/loa/types'

export default async function LoaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [supabase, user] = await Promise.all([createClient(), getAppUser()])
  if (!user) return null

  const [{ data: order }, catalog, { data: usersRaw }] = await Promise.all([
    supabase
      .from('orders')
      .select(`
        id, order_no, event_name, event_date, event_time, venue, pax, sales_id,
        leads(company_name, segmen, line_business, address, lead_contacts(name, phone, is_primary))
      `)
      .eq('id', id)
      .single(),
    loadMenuCatalog(),
    supabase.from('users').select('id, name, phone, email, is_active, roles(permissions)'),
  ])

  if (!order) notFound()

  // Sales = user aktif yang punya permission orders.create
  const salesUsers: SalesUser[] = (usersRaw ?? [])
    .filter((u: any) => u.is_active && u.roles?.permissions?.['orders.create'] === true)
    .map((u: any) => ({ id: u.id, name: u.name, phone: u.phone ?? '', email: u.email }))

  const lead: any = order.leads
  const primary = (lead?.lead_contacts ?? []).find((c: any) => c.is_primary) ?? lead?.lead_contacts?.[0]
  const segmen = [lead?.segmen, lead?.line_business].filter(Boolean).join(' / ')

  const initial: InitialLoaData = {
    orderNo: order.order_no,
    client: {
      name: lead?.company_name ?? '—',
      segmen: segmen || '—',
      address: lead?.address ?? '—',
      picName: primary?.name ?? '—',
      picPhone: primary?.phone ?? '—',
    },
    detail: {
      eventName: order.event_name ?? '',
      eventAddress: order.venue ?? '',
      eventDate: order.event_date ?? '',
      eventTime: order.event_time ?? '',
      pax: order.pax ?? 0,
      setupLocation: '',
      salesId: order.sales_id ?? '',
    },
  }

  return <LoaForm initial={initial} salesUsers={salesUsers} catalog={catalog} />
}
