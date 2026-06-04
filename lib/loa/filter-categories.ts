import type { CatalogCategory } from '@/features/loa/types'

/**
 * Filter kategori untuk tampilan search per-sesi. Kembalikan hanya kategori
 * yang punya >=1 item cocok (nama item mengandung query, case-insensitive),
 * dengan items dipersempit ke yang cocok. Query kosong/whitespace → utuh.
 * Tidak memutasi input.
 */
export function filterCategoriesByQuery(
  categories: CatalogCategory[],
  query: string
): CatalogCategory[] {
  const q = query.trim().toLowerCase()
  if (q === '') return categories
  const out: CatalogCategory[] = []
  for (const cat of categories) {
    const items = cat.items.filter((it) => it.nama.toLowerCase().includes(q))
    if (items.length > 0) out.push({ ...cat, items })
  }
  return out
}
