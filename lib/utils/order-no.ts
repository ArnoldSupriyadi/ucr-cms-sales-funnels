import { createClient } from '@/lib/supabase/server'

export async function generateOrderNo(eventDate: string): Promise<string> {
  const date = new Date(eventDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  // Format: UCR-YYYY-MM-DD-XXX (seq reset per-hari berdasarkan event_date)
  const prefix = `UCR-${year}-${month}-${day}-`

  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('order_no')
    .like('order_no', `${prefix}%`)
    .order('order_no', { ascending: false })
    .limit(1)

  let seq = 1
  if (data && data.length > 0) {
    const last = data[0].order_no
    const parts = last.split('-')
    const lastSeq = parseInt(parts[parts.length - 1], 10)
    if (!isNaN(lastSeq)) seq = lastSeq + 1
  }

  return `${prefix}${String(seq).padStart(3, '0')}`
}
