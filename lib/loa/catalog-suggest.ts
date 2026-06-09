import type { MenuCatalog } from '@/features/loa/types'

/** Daftar nama item unik dari katalog yang cocok query (case-insensitive). Query kosong → []. Maks 20. */
export function searchMenuItems(catalog: MenuCatalog, query: string): string[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const names = new Set<string>()
  for (const cats of Object.values(catalog.categoriesByComponentType)) {
    for (const cat of cats) {
      for (const it of cat.items) {
        if (it.nama.toLowerCase().includes(q)) names.add(it.nama)
      }
    }
  }
  return [...names].slice(0, 20)
}
