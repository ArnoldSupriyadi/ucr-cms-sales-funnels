import { createClient } from '@/lib/supabase/server'

/** Generate nomor dokumen LoA format LOA-YYYYMM-XXX (urut per bulan berjalan). */
export async function generateLoaDocNo(refDate: Date = new Date()): Promise<string> {
  const year = refDate.getFullYear()
  const month = String(refDate.getMonth() + 1).padStart(2, '0')
  const prefix = `LOA-${year}${month}-`

  const supabase = await createClient()
  const { data } = await supabase
    .from('loa')
    .select('doc_no')
    .like('doc_no', `${prefix}%`)
    .order('doc_no', { ascending: false })
    .limit(1)

  let seq = 1
  if (data && data.length > 0) {
    const parts = data[0].doc_no.split('-')
    const lastSeq = parseInt(parts[parts.length - 1], 10)
    if (!isNaN(lastSeq)) seq = lastSeq + 1
  }
  return `${prefix}${String(seq).padStart(3, '0')}`
}
