import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { BookingForm } from '@/features/bookings/components/booking-form'

export default async function NewBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ lead_id?: string }>
}) {
  const { lead_id } = await searchParams
  const user = await getAppUser()
  if (!user?.permissions['bookings.create']) redirect('/bookings')

  const supabase = await createClient()
  const { data: leads } = await supabase
    .from('leads')
    .select('id, company_name')
    .order('company_name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Buat Booking</h1>
        <p className="text-sm text-slate-500 mt-1">Daftarkan booking event baru</p>
      </div>
      <BookingForm leads={leads ?? []} defaultLeadId={lead_id} />
    </div>
  )
}
