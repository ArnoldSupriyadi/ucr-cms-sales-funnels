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

// ---- State draft di client (pohon Event → Header → [SubGroup] → Item) ----
export interface MenuItemDraft {
  key: string
  name: string
  keterangan: string
}
export interface SubGroupDraft {
  key: string
  name: string                // "Jenis Menu" (kategori: Beef/Soup/Savoury/...)
  keterangan: string
  items: MenuItemDraft[]
}
export interface HeaderDraft {
  key: string
  name: string
  keterangan: string
  pax: number
  amount: number              // harga/pax; total baris = amount × pax
  subGroups: SubGroupDraft[]  // Jenis Menu langsung di bawah Header (boleh kosong)
}
export interface EventDraft {
  key: string
  eventDate: string           // 'YYYY-MM-DD'
  servingTime: string
  venue: string
  setupLocation: string
  pax: number                 // manual, utk tabel Waktu & Tempat
  headers: HeaderDraft[]
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
  scPct: number                 // read-only di UI, diturunkan dari tipe order
  handlingType: 'percent' | 'flat'
  handlingValue: number
  discountEnabled: boolean
  discountType: 'percent' | 'flat'
  discountValue: number
}
export interface LoaWizardState {
  detail: LoaDetailDraft
  events: EventDraft[]
  pricing: LoaPricingDraft
}

/** Subset draft LOA yang dipersist & dimuat ulang dari DB. */
export interface SavedLoaDraft {
  events: EventDraft[]
  pricing: LoaPricingDraft
}

export const DEFAULT_PRICING: LoaPricingDraft = {
  scPct: 5,
  handlingType: 'percent',
  handlingValue: 15,
  discountEnabled: false,
  discountType: 'flat',
  discountValue: 0,
}

// ---- Data read-only dari server ----
export interface InitialLoaData {
  orderNo: string
  eventDateStart: string        // dari order.event_date
  eventDateEnd: string | null   // dari order.event_date_end (null = 1 hari)
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
