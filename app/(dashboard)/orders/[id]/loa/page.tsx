import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { loadMenuCatalog } from '@/lib/loa/catalog'
import { getLoaForEdit } from '@/features/loa/actions'
import { LoaForm } from '@/features/loa/components/loa-form'
import { DEFAULT_PRICING, type InitialLoaData, type LoaPricingDraft, type SalesUser } from '@/features/loa/types'
import { serviceChargePctForType } from '@/lib/constants/order-type'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

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
        id, order_no, event_name, event_date, event_time, venue, pax, sales_id, order_type,
        leads(company_name, segmen, address, lead_contacts(name, phone, is_primary))
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
    address: string | null
    lead_contacts: LeadContact[]
  }
  const lead = order.leads as unknown as LeadEmbed | null
  const primary =
    (lead?.lead_contacts ?? []).find((c) => c.is_primary) ?? lead?.lead_contacts?.[0]
  // Segmen mengikuti order form: hanya leads.segmen (tanpa line_business)
  const segmen = lead?.segmen ?? ''

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

  // Service Charge selalu di-override dari tipe order (single source of truth), bukan dari LoA tersimpan.
  const scPct = serviceChargePctForType(order.order_type)
  const initialPricing: LoaPricingDraft = {
    ...(saved?.pricing ?? DEFAULT_PRICING),
    scPct,
  }
  const orderTypeMissing = !order.order_type

  return (
    <>
      {orderTypeMissing && (
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <span>
              <b>Tipe Order belum diisi.</b> Service Charge tidak bisa ditentukan &amp; LoA tidak
              bisa disimpan sampai tipe order dipilih.
            </span>
          </div>
          <Link href={`/orders/${id}/edit`}>
            <Button size="sm" variant="outline" className="border-amber-300">
              Isi Tipe Order
            </Button>
          </Link>
        </div>
      )}
      <LoaForm
        orderId={id}
        initial={initial}
        salesUsers={salesUsers}
        catalog={catalog}
        initialItems={saved?.items}
        initialPricing={initialPricing}
      />
    </>
  )
}
