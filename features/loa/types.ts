import type { SelectionRule } from '@/lib/loa/selection-rules'

// ---- Katalog (di-load server-side, read-only) ----
export interface CatalogItem { id: string; nama: string }
export interface CatalogCategory {
  id: string
  componentType: string
  nama: string
  rule: SelectionRule
  items: CatalogItem[]
}
export interface CatalogComponent {
  componentType: string
  nama: string
  qty: number
  sortOrder: number
}
export interface CatalogPackage {
  id: string
  namaPaket: string
  kategori: string
  hargaPerPax: number | null
  hargaMinimum: number | null
  hasSelection: boolean
  components: CatalogComponent[]
}
export interface MenuCatalog {
  packages: CatalogPackage[]
  /** kategori + item, dikelompokkan per componentType */
  categoriesByComponentType: Record<string, CatalogCategory[]>
}

// ---- State draft di client ----
export interface DraftSelection {
  componentName: string
  occasionNo: number
  categoryId: string
  categoryName: string
  itemId: string
  itemName: string
}
export interface LoaItemDraft {
  key: string            // id sementara di client (crypto.randomUUID)
  packageId: string | null
  packageName: string
  pricePerPax: number
  pax: number
  selections: DraftSelection[]
}
export interface LoaDetailDraft {
  setupLocation: string
}
export interface LoaPricingDraft {
  scPct: number
  handlingPct: number
  discountType: 'percent' | 'flat'
  discountValue: number
}
export interface LoaWizardState {
  detail: LoaDetailDraft
  items: LoaItemDraft[]
  pricing: LoaPricingDraft
}

export const DEFAULT_PRICING: LoaPricingDraft = {
  scPct: 5,
  handlingPct: 15,
  discountType: 'flat',
  discountValue: 0,
}
