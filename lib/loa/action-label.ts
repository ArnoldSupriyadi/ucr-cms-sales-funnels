/**
 * Label tombol aksi LOA pada halaman order, berdasar status LOA (loa_status_enum).
 * Belum ada LOA → "Buat LOA"; draft → "Lanjut LOA"; status lain (sudah final/terkirim/dll) → "Lihat LOA".
 * Satu sumber kebenaran agar list order & detail order tidak berbeda wording.
 */
export function loaActionLabel(status?: string | null): string {
  if (!status) return 'Buat LOA'
  return status === 'draft' ? 'Lanjut LOA' : 'Lihat LOA'
}
