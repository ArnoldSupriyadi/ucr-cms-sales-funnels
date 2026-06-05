import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { OrderForm } from '@/features/orders/components/order-form'

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getAppUser()
  if (!user?.permissions['orders.edit']) redirect('/orders')

  const supabase = await createClient()
  const [{ data: order }, { data: leads }] = await Promise.all([
    supabase.from('orders').select('*').eq('id', id).single(),
    supabase.from('leads').select('id, company_name, segmen').order('company_name'),
  ])

  if (!order) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Edit Order</h1>
        <p className="text-sm text-slate-500 font-mono mt-1">{order.order_no}</p>
      </div>
      <OrderForm order={order} leads={leads ?? []} />
    </div>
  )
}
