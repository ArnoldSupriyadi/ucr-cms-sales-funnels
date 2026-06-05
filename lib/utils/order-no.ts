import { createClient } from '@/lib/supabase/server'
import { formatDocNo, nextSeqFromLast } from '@/lib/utils/doc-number'

/**
 * Generate nomor order: UCR-YYYY-NNNN (running per tahun pembuatan, kontinu, reset tiap tahun).
 * Tidak lagi berbasis event_date — supaya nomor berurutan & tahun tidak ikut tanggal acara.
 */
export async function generateOrderNo(refDate: Date = new Date()): Promise<string> {
  const year = refDate.getFullYear()
  const prefix = `UCR-${year}-`

  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('order_no')
    .like('order_no', `${prefix}%`)
    .order('order_no', { ascending: false })
    .limit(1)

  const seq = nextSeqFromLast(data?.[0]?.order_no)
  return formatDocNo('UCR', year, seq)
}
