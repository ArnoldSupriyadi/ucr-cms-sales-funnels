import type { SelectionRule } from '@/lib/loa/selection-rules'

// ---- Katalog (di-load server-side, read-only) ----
export interface CatalogItem { id: string; nama: string }
export interface CatalogCategory {
  id: string
  componentType: string
  nama: string
  rule: SelectionRule
  /** Label header grup (parent) bila kategori ini bagian dari grup; null bila berdiri sendiri. */
  groupName: string | null
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
  eventName: string
  eventAddress: string   // dari orders.venue
  eventDate: string      // ISO 'YYYY-MM-DD'
  eventTime: string
  pax: number
  setupLocation: string
  salesId: string
}
export interface LoaPricingDraft {
  scPct: number
  handlingPct: number
  discountEnabled: boolean
  discountType: 'percent' | 'flat'
  discountValue: number
}
export interface LoaWizardState {
  detail: LoaDetailDraft
  items: LoaItemDraft[]
  pricing: LoaPricingDraft
}

/** Subset draft LoA yang dipersist & dimuat ulang dari DB (detail lain bersumber dari order). */
export interface SavedLoaDraft {
  setupLocation: string
  items: LoaItemDraft[]
  pricing: LoaPricingDraft
}

export const DEFAULT_PRICING: LoaPricingDraft = {
  scPct: 5,
  handlingPct: 15,
  discountEnabled: false,
  discountType: 'flat',
  discountValue: 0,
}

// ---- Data read-only dari server ----
export interface InitialLoaData {
  orderNo: string
  client: {
    name: string
    segmen: string
    address: string
    picName: string
    picPhone: string
  }
  detail: LoaDetailDraft
}
export interface SalesUser {
  id: string
  name: string
  phone: string
  email: string
}
