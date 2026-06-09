import { createAdminClient } from '@/lib/supabase/server'
import { formatDocNo } from '@/lib/utils/doc-number'

/**
 * Generate nomor dokumen LOA: LOA-YYYY-NNNN (running per tahun, kontinu, reset tiap tahun).
 * Nomor diambil dari counter atomik DB (fungsi next_doc_seq) → aman dari race condition & RLS.
 */
export async function generateLoaDocNo(refDate: Date = new Date()): Promise<string> {
  const year = refDate.getFullYear()
  const supabase = createAdminClient()
  const { data, error } = await supabase.rpc('next_doc_seq', { p_prefix: `LOA-${year}` })
  if (error || data == null) {
    throw new Error(`Gagal generate doc_no LOA: ${error?.message ?? 'no sequence returned'}`)
  }
  return formatDocNo('LOA', year, data)
}
