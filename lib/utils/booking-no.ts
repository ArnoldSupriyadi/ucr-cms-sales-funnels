import { createClient } from '@/lib/supabase/server'

export async function generateBookingNo(eventDate: string): Promise<string> {
  const date = new Date(eventDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const prefix = `UCR-${year}${month}-`

  const supabase = await createClient()
  const { data } = await supabase
    .from('bookings')
    .select('booking_no')
    .like('booking_no', `${prefix}%`)
    .order('booking_no', { ascending: false })
    .limit(1)

  let seq = 1
  if (data && data.length > 0) {
    const last = data[0].booking_no
    const parts = last.split('-')
    const lastSeq = parseInt(parts[parts.length - 1], 10)
    if (!isNaN(lastSeq)) seq = lastSeq + 1
  }

  return `${prefix}${String(seq).padStart(3, '0')}`
}
