import type { MenuCatalog, CatalogCategory, CatalogPackage } from '@/features/loa/types'
import type { SelectionRule } from '@/lib/loa/selection-rules'

// ---- Bentuk baris mentah dari Supabase (snake_case) ----
export interface RawPackage {
  id: string
  nama_paket: string
  kategori: string
  harga_per_pax: number | null
  harga_minimum: number | null
  has_selection: boolean
}
export interface RawComponent {
  package_id: string
  component_type: string
  nama: string
  qty: number
  sort_order: number
}
export interface RawCategory {
  id: string
  component_type: string
  nama: string
  selection_rule: string
  parent_id: string | null
  sort_order: number
}
export interface RawItem {
  id: string
  category_id: string
  nama: string
}

export interface RawCatalog {
  packages: RawPackage[]
  components: RawComponent[]
  categories: RawCategory[]
  items: RawItem[]
}

/**
 * Bentuk katalog menu dari baris mentah menjadi MenuCatalog.
 *
 * Hierarki kategori maks 2 level: parent = "header grup" (tidak dipilih),
 * leaf = kategori yang dipilih (bawa rule + item). Header dideteksi dari
 * id yang muncul sebagai `parent_id` kategori lain; sisanya leaf.
 * Leaf diurutkan interleaved: pakai sort_order root (parent untuk anak,
 * diri sendiri untuk standalone), lalu sort_order leaf sendiri.
 */
export function shapeMenuCatalog(raw: RawCatalog): MenuCatalog {
  const { packages, components, categories, items } = raw

  const itemsByCat = new Map<string, { id: string; nama: string }[]>()
  for (const it of items) {
    const arr = itemsByCat.get(it.category_id) ?? []
    arr.push({ id: it.id, nama: it.nama })
    itemsByCat.set(it.category_id, arr)
  }

  const catById = new Map(categories.map((c) => [c.id, c]))
  const headerIds = new Set(categories.map((c) => c.parent_id).filter((p): p is string => !!p))

  type Ordered = { effSort: number; ownSort: number; cat: CatalogCategory }
  const orderedByComp: Record<string, Ordered[]> = {}

  for (const c of categories) {
    if (headerIds.has(c.id)) continue // header — tidak dipilih, hanya pengelompokan
    const parent = c.parent_id ? catById.get(c.parent_id) : undefined
    const cat: CatalogCategory = {
      id: c.id,
      componentType: c.component_type,
      nama: c.nama,
      rule: (c.selection_rule === 'one' ? 'one' : 'multiple') as SelectionRule,
      groupName: parent ? parent.nama : null,
      items: itemsByCat.get(c.id) ?? [],
    }
    ;(orderedByComp[c.component_type] ??= []).push({
      effSort: parent ? parent.sort_order : c.sort_order,
      ownSort: c.sort_order,
      cat,
    })
  }

  const categoriesByComponentType: Record<string, CatalogCategory[]> = {}
  for (const [compType, list] of Object.entries(orderedByComp)) {
    list.sort((a, b) => a.effSort - b.effSort || a.ownSort - b.ownSort)
    categoriesByComponentType[compType] = list.map((o) => o.cat)
  }

  const compsByPkg = new Map<string, { componentType: string; nama: string; qty: number; sortOrder: number }[]>()
  for (const cp of [...components].sort((a, b) => a.sort_order - b.sort_order)) {
    const arr = compsByPkg.get(cp.package_id) ?? []
    arr.push({ componentType: cp.component_type, nama: cp.nama, qty: cp.qty, sortOrder: cp.sort_order })
    compsByPkg.set(cp.package_id, arr)
  }

  const shapedPackages: CatalogPackage[] = packages.map((p) => ({
    id: p.id,
    namaPaket: p.nama_paket,
    kategori: p.kategori,
    hargaPerPax: p.harga_per_pax,
    hargaMinimum: p.harga_minimum,
    hasSelection: p.has_selection,
    components: compsByPkg.get(p.id) ?? [],
  }))

  return { packages: shapedPackages, categoriesByComponentType }
}
