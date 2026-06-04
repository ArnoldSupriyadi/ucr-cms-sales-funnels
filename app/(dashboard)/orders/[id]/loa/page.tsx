import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { loadMenuCatalog } from '@/lib/loa/catalog'
import { getLoaForEdit } from '@/features/loa/actions'
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
  if (!user.permissions['loa.create']) redirect(`/orders/${id}`)

  const [{ data: order }, catalog, { data: usersRaw }, saved] = await Promise.all([
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
    getLoaForEdit(id),
  ])

  if (!order) notFound()

  // Sales = user aktif yang punya permission orders.create
  type SalesRow = {
    id: string
    name: string
    phone: string | null
    email: string
    is_active: boolean
    roles: { permissions: Record<string, boolean> } | null
  }
  const salesUsers: SalesUser[] = ((usersRaw ?? []) as unknown as SalesRow[])
    .filter((u) => u.is_active && u.roles?.permissions?.['orders.create'] === true)
    .map((u) => ({ id: u.id, name: u.name, phone: u.phone ?? '', email: u.email }))

  type LeadContact = { name: string; phone: string | null; is_primary: boolean }
  type LeadEmbed = {
    company_name: string | null
    segmen: string | null
    line_business: string | null
    address: string | null
    lead_contacts: LeadContact[]
  }
  const lead = order.leads as unknown as LeadEmbed | null
  const primary =
    (lead?.lead_contacts ?? []).find((c) => c.is_primary) ?? lead?.lead_contacts?.[0]
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
      setupLocation: saved?.setupLocation ?? '',
      salesId: order.sales_id ?? '',
    },
  }

  return (
    <LoaForm
      orderId={id}
      initial={initial}
      salesUsers={salesUsers}
      catalog={catalog}
      initialItems={saved?.items}
      initialPricing={saved?.pricing}
    />
  )
}
