import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { OrderForm } from '@/features/orders/components/order-form'

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ lead_id?: string }>
}) {
  const { lead_id } = await searchParams
  const user = await getAppUser()
  if (!user?.permissions['orders.create']) redirect('/orders')

  const supabase = await createClient()
  const { data: leads } = await supabase
    .from('leads')
    .select('id, company_name, segmen')
    .order('company_name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Buat Order</h1>
        <p className="text-sm text-slate-500 mt-1">Daftarkan order event baru</p>
      </div>
      <OrderForm leads={leads ?? []} defaultLeadId={lead_id} />
    </div>
  )
}
