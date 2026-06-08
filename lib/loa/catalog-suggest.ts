import type { MenuCatalog, HeaderDraft, SubGroupDraft, MenuItemDraft } from '@/features/loa/types'

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

/** Petakan paket katalog → HeaderDraft (sub-grup dari kategori komponen + item default). pax/amount=0. */
export function packageToHeader(catalog: MenuCatalog, packageId: string): HeaderDraft | null {
  const pkg = catalog.packages.find((p) => p.id === packageId)
  if (!pkg) return null
  const subGroups: SubGroupDraft[] = []
  for (const comp of pkg.components) {
    const cats = catalog.categoriesByComponentType[comp.componentType] ?? []
    for (const cat of cats) {
      const items: MenuItemDraft[] = cat.items.map((it) => ({
        key: crypto.randomUUID(),
        name: it.nama,
        keterangan: '',
      }))
      subGroups.push({ key: crypto.randomUUID(), name: cat.nama, keterangan: '', items })
    }
  }
  return { key: crypto.randomUUID(), name: pkg.namaPaket, keterangan: '', pax: 0, amount: 0, subGroups, items: [] }
}
