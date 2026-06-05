/**
 * Helper murni penomoran dokumen running-per-tahun: `PREFIX-YYYY-NNNN`.
 * Seq lari kontinu dalam satu tahun (pakai tahun pembuatan), reset tiap tahun.
 * I/O Supabase ditangani pemanggil (order-no.ts, doc-no.ts) — bagian ini bisa diuji.
 */

/** Bangun nomor dokumen: formatDocNo('UCR', 2026, 1) → 'UCR-2026-0001'. */
export function formatDocNo(prefix: string, year: number, seq: number): string {
  return `${prefix}-${year}-${String(seq).padStart(4, '0')}`
}

/** Nomor urut berikutnya dari nomor terakhir tahun ini; null/tak dikenal → 1. */
export function nextSeqFromLast(lastDocNo: string | null | undefined): number {
  if (!lastDocNo) return 1
  const m = lastDocNo.match(/-(\d+)$/)
  if (!m) return 1
  const n = parseInt(m[1], 10)
  return Number.isNaN(n) ? 1 : n + 1
}
