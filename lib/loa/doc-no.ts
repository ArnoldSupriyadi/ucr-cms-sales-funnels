import { createClient } from '@/lib/supabase/server'
import { formatDocNo, nextSeqFromLast } from '@/lib/utils/doc-number'

/**
 * Generate nomor dokumen LoA: LOA-YYYY-NNNN (running per tahun generate, kontinu, reset tiap tahun).
 */
export async function generateLoaDocNo(refDate: Date = new Date()): Promise<string> {
  const year = refDate.getFullYear()
  const prefix = `LOA-${year}-`

  const supabase = await createClient()
  const { data } = await supabase
    .from('loa')
    .select('doc_no')
    .like('doc_no', `${prefix}%`)
    .order('doc_no', { ascending: false })
    .limit(1)

  const seq = nextSeqFromLast(data?.[0]?.doc_no)
  return formatDocNo('LOA', year, seq)
}
