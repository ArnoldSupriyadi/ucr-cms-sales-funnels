import type { MenuCatalog, HeaderDraft, SectionDraft, SubGroupDraft, MenuItemDraft } from '@/features/loa/types'

const uid = () => crypto.randomUUID()
const SAMPLE = 3 // jumlah item contoh per sub-kategori saat prefill

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

/** Daftar nama paket cocok query (opsional difilter per kategori). Query kosong → semua (bila kategori diset). Maks 20. */
export function searchPackages(catalog: MenuCatalog, query: string, kategori?: string): string[] {
  const q = query.trim().toLowerCase()
  const pkgs = kategori ? catalog.packages.filter((p) => p.kategori === kategori) : catalog.packages
  if (!q && !kategori) return []
  const names = new Set<string>()
  for (const p of pkgs) if (!q || p.namaPaket.toLowerCase().includes(q)) names.add(p.namaPaket)
  return [...names].slice(0, 20)
}

/** Daftar nama kategori daun unik dari katalog yang cocok query. Query kosong → []. Maks 20. */
export function searchCategories(catalog: MenuCatalog, query: string): string[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const names = new Set<string>()
  for (const cats of Object.values(catalog.categoriesByComponentType)) {
    for (const c of cats) if (c.nama.toLowerCase().includes(q)) names.add(c.nama)
  }
  return [...names].slice(0, 20)
}

/** Buat SubGroupDraft dari kategori katalog (match nama) + SAMPLE item contoh. */
export function categoryToSubGroup(catalog: MenuCatalog, categoryName: string): SubGroupDraft {
  let items: MenuItemDraft[] = []
  for (const cats of Object.values(catalog.categoriesByComponentType)) {
    const cat = cats.find((c) => c.nama === categoryName)
    if (cat) {
      items = cat.items.slice(0, SAMPLE).map((it) => ({ key: uid(), name: it.nama, keterangan: '' }))
      break
    }
  }
  return { key: uid(), name: categoryName, keterangan: '', items }
}

/** Paket → HeaderDraft 3-level: section per komponen (qty>1 bernomor), sub-kategori daun, SAMPLE item contoh. */
export function packageToHeader(catalog: MenuCatalog, packageId: string): HeaderDraft | null {
  const pkg = catalog.packages.find((p) => p.id === packageId)
  if (!pkg) return null
  const sections: SectionDraft[] = []
  for (const comp of pkg.components) {
    const cats = catalog.categoriesByComponentType[comp.componentType] ?? []
    for (let o = 1; o <= comp.qty; o++) {
      const subGroups: SubGroupDraft[] = cats.map((c) => ({
        key: uid(),
        name: c.nama,
        keterangan: '',
        items: c.items.slice(0, SAMPLE).map((it) => ({ key: uid(), name: it.nama, keterangan: '' })),
      }))
      sections.push({
        key: uid(),
        name: comp.qty > 1 ? `${comp.nama} ${o}` : comp.nama,
        keterangan: '',
        items: [],
        subGroups,
      })
    }
  }
  return { key: uid(), name: pkg.namaPaket, keterangan: '', pax: 0, amount: 0, items: [], sections }
}
