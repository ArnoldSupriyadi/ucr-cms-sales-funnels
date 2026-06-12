import type { MenuCatalog, HeaderDraft, SubGroupDraft, MenuItemDraft } from '@/features/loa/types'

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

/** Ringkasan komponen paket untuk panduan (read-only) di bawah input Nama Header.
 *  Cari paket yang namanya COCOK PERSIS (case-insensitive, trim) dengan `name`.
 *  Return null bila: nama kosong, tak ada paket cocok, paket tanpa komponen, atau
 *  komponen tunggal qty 1 yang namanya sama dengan nama header (redundan, mis. "Coffee Break").
 *  Selain itu → "2× Coffee Break · 1× Asian Buffet" (format `qty× nama`, urut sortOrder). */
export function packageComponentsSummary(catalog: MenuCatalog, name: string): string | null {
  const target = name.trim().toLowerCase()
  if (!target) return null
  const pkg = catalog.packages.find((p) => p.namaPaket.trim().toLowerCase() === target)
  if (!pkg || pkg.components.length === 0) return null
  const comps = [...pkg.components].sort((a, b) => a.sortOrder - b.sortOrder)
  if (comps.length === 1 && comps[0].qty === 1 && comps[0].nama.trim().toLowerCase() === target) return null
  return comps.map((c) => `${c.qty}× ${c.nama}`).join(' · ')
}

/** Daftar nama kategori daun unik dari katalog (cari/browse). Query kosong → SEMUA (terurut). Maks 30. */
export function searchCategories(catalog: MenuCatalog, query: string): string[] {
  const q = query.trim().toLowerCase()
  const names = new Set<string>()
  for (const cats of Object.values(catalog.categoriesByComponentType)) {
    for (const c of cats) if (!q || c.nama.toLowerCase().includes(q)) names.add(c.nama)
  }
  return [...names].sort((a, b) => a.localeCompare(b)).slice(0, 30)
}

/** Item milik kategori bernama `categoryName` (digabung lintas component_type, dedup), difilter query.
 *  Query kosong → SEMUA item kategori itu. categoryName kosong → []. Maks 50. */
export function searchItemsInCategory(catalog: MenuCatalog, categoryName: string, query: string): string[] {
  const target = categoryName.trim().toLowerCase()
  if (!target) return []
  const q = query.trim().toLowerCase()
  const names = new Set<string>()
  for (const cats of Object.values(catalog.categoriesByComponentType)) {
    for (const c of cats) {
      if (c.nama.toLowerCase() !== target) continue
      for (const it of c.items) if (!q || it.nama.toLowerCase().includes(q)) names.add(it.nama)
    }
  }
  return [...names].slice(0, 50)
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

/** Paket → HeaderDraft: Jenis Menu (kategori daun unik dari semua komponen) + SAMPLE item contoh. */
export function packageToHeader(catalog: MenuCatalog, packageId: string): HeaderDraft | null {
  const pkg = catalog.packages.find((p) => p.id === packageId)
  if (!pkg) return null
  const seen = new Set<string>()
  const subGroups: SubGroupDraft[] = []
  for (const comp of pkg.components) {
    const cats = catalog.categoriesByComponentType[comp.componentType] ?? []
    for (const c of cats) {
      if (seen.has(c.nama)) continue
      seen.add(c.nama)
      subGroups.push({
        key: uid(),
        name: c.nama,
        keterangan: '',
        items: c.items.slice(0, SAMPLE).map((it) => ({ key: uid(), name: it.nama, keterangan: '' })),
      })
    }
  }
  return { key: uid(), name: pkg.namaPaket, keterangan: '', pax: 0, amount: 0, subGroups }
}
