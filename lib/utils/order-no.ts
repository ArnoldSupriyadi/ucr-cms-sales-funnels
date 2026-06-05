import { createAdminClient } from '@/lib/supabase/server'
import { formatDocNo } from '@/lib/utils/doc-number'

/**
 * Generate nomor order: UCR-YYYY-NNNN (running per tahun pembuatan, kontinu, reset tiap tahun).
 * Nomor diambil dari counter atomik DB (fungsi next_doc_seq) → aman dari race condition
 * & RLS (tak lagi baca MAX(order_no)). Dipanggil via admin client (service_role).
 */
export async function generateOrderNo(refDate: Date = new Date()): Promise<string> {
  const year = refDate.getFullYear()
  const supabase = createAdminClient()
  const { data, error } = await supabase.rpc('next_doc_seq', { p_prefix: `UCR-${year}` })
  if (error || data == null) {
    throw new Error(`Gagal generate order_no: ${error?.message ?? 'no sequence returned'}`)
  }
  return formatDocNo('UCR', year, data)
}
