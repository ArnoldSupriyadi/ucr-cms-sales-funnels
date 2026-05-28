import { notFound } from 'next/navigation'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Construction } from 'lucide-react'

export default async function IbPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [supabase, user] = await Promise.all([createClient(), getAppUser()])
  if (!user) return null
  if (!user.permissions['ib.view_all'] && !user.permissions['ib.create']) {
    redirect(`/bookings/${id}`)
  }

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, booking_no')
    .eq('id', id)
    .single()

  if (!booking) notFound()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Internal Breakdown</h1>
        <p className="text-sm text-slate-500 font-mono mt-1">{booking.booking_no}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-slate-500">
            <Construction className="h-5 w-5" />
            Dalam Pengembangan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Fitur IB akan dibangun pada Bulan 4. Tersedia hanya untuk Cost Controller
            setelah LoA berstatus Final.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
