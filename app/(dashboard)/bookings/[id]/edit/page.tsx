import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { BookingForm } from '@/features/bookings/components/booking-form'

export default async function EditBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getAppUser()
  if (!user?.permissions['bookings.edit']) redirect('/bookings')

  const supabase = await createClient()
  const [{ data: booking }, { data: leads }] = await Promise.all([
    supabase.from('bookings').select('*').eq('id', id).single(),
    supabase.from('leads').select('id, company_name').order('company_name'),
  ])

  if (!booking) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Edit Booking</h1>
        <p className="text-sm text-slate-500 font-mono mt-1">{booking.booking_no}</p>
      </div>
      <BookingForm booking={booking} leads={leads ?? []} />
    </div>
  )
}
