import type {
  LoaWizardState,
  LoaDetailDraft,
  LoaPricingDraft,
  EventDraft,
  HeaderDraft,
  SubGroupDraft,
  MenuItemDraft,
} from './types'
import { DEFAULT_PRICING } from './types'

const uid = () => crypto.randomUUID()

// ---- Factory node ----
export const newMenuItem = (): MenuItemDraft => ({ key: uid(), name: '', keterangan: '' })
export const newSubGroup = (): SubGroupDraft => ({ key: uid(), name: '', keterangan: '', items: [] })
export const newHeader = (): HeaderDraft => ({
  key: uid(), name: '', keterangan: '', pax: 0, amount: 0, subGroups: [],
})
export const newEvent = (eventDate = ''): EventDraft => ({
  key: uid(), eventDate, servingTime: '', venue: '', setupLocation: '', pax: 0, headers: [],
})

/** Deep-clone header dgn key baru di tiap node (dipakai saat ADD_PREFILLED_HEADER). */
export const newPrefilledHeader = (h: HeaderDraft): HeaderDraft => ({
  ...h,
  key: uid(),
  subGroups: h.subGroups.map((sg) => ({
    ...sg,
    key: uid(),
    items: sg.items.map((it) => ({ ...it, key: uid() })),
  })),
})

const EMPTY_DETAIL: LoaDetailDraft = {
  eventName: '', eventAddress: '', eventDate: '', eventTime: '', pax: 0, setupLocation: '', salesId: '',
}

export function initialState(
  events: EventDraft[] = [],
  detail: LoaDetailDraft = EMPTY_DETAIL,
  pricing: LoaPricingDraft = { ...DEFAULT_PRICING },
): LoaWizardState {
  return { detail, events, pricing }
}

export type LoaFormAction =
  | { type: 'SET_DETAIL_FIELD'; field: keyof LoaDetailDraft; value: string | number }
  // event
  | { type: 'ADD_EVENT' }
  | { type: 'REMOVE_EVENT'; eventKey: string }
  | { type: 'SET_EVENT_FIELD'; eventKey: string; field: keyof EventDraft; value: string | number }
  // header
  | { type: 'ADD_HEADER'; eventKey: string }
  | { type: 'ADD_PREFILLED_HEADER'; eventKey: string; header: HeaderDraft }
  | { type: 'REMOVE_HEADER'; eventKey: string; headerKey: string }
  | { type: 'SET_HEADER_FIELD'; eventKey: string; headerKey: string; field: 'name' | 'keterangan' | 'pax' | 'amount'; value: string | number }
  // jenis menu (sub-grup) — langsung di bawah header
  | { type: 'ADD_SUBGROUP'; eventKey: string; headerKey: string }
  | { type: 'REMOVE_SUBGROUP'; eventKey: string; headerKey: string; subGroupKey: string }
  | { type: 'SET_SUBGROUP_FIELD'; eventKey: string; headerKey: string; subGroupKey: string; field: 'name' | 'keterangan'; value: string }
  // item — selalu di dalam sebuah Jenis Menu
  | { type: 'ADD_ITEM'; eventKey: string; headerKey: string; subGroupKey: string }
  | { type: 'REMOVE_ITEM'; eventKey: string; headerKey: string; subGroupKey: string; itemKey: string }
  | { type: 'SET_ITEM_FIELD'; eventKey: string; headerKey: string; subGroupKey: string; itemKey: string; field: 'name' | 'keterangan'; value: string }
  // pricing
  | { type: 'SET_PRICING_FIELD'; field: keyof LoaPricingDraft; value: string | number | boolean }
  | { type: 'TOGGLE_DISCOUNT'; on: boolean }

// ---- Helper map bersarang (immutable) ----
function mapEvent(state: LoaWizardState, eventKey: string, fn: (e: EventDraft) => EventDraft): LoaWizardState {
  return { ...state, events: state.events.map((e) => (e.key === eventKey ? fn(e) : e)) }
}
function mapHeader(event: EventDraft, headerKey: string, fn: (h: HeaderDraft) => HeaderDraft): EventDraft {
  return { ...event, headers: event.headers.map((h) => (h.key === headerKey ? fn(h) : h)) }
}
function mapSubGroup(header: HeaderDraft, subGroupKey: string, fn: (sg: SubGroupDraft) => SubGroupDraft): HeaderDraft {
  return { ...header, subGroups: header.subGroups.map((sg) => (sg.key === subGroupKey ? fn(sg) : sg)) }
}

export function loaFormReducer(state: LoaWizardState, action: LoaFormAction): LoaWizardState {
  switch (action.type) {
    case 'SET_DETAIL_FIELD':
      return { ...state, detail: { ...state.detail, [action.field]: action.value } }

    case 'ADD_EVENT':
      return { ...state, events: [...state.events, newEvent()] }
    case 'REMOVE_EVENT':
      return { ...state, events: state.events.filter((e) => e.key !== action.eventKey) }
    case 'SET_EVENT_FIELD':
      return mapEvent(state, action.eventKey, (e) => ({ ...e, [action.field]: action.value }))

    case 'ADD_HEADER':
      return mapEvent(state, action.eventKey, (e) => ({ ...e, headers: [...e.headers, newHeader()] }))
    case 'ADD_PREFILLED_HEADER':
      return mapEvent(state, action.eventKey, (e) => ({ ...e, headers: [...e.headers, newPrefilledHeader(action.header)] }))
    case 'REMOVE_HEADER':
      return mapEvent(state, action.eventKey, (e) => ({ ...e, headers: e.headers.filter((h) => h.key !== action.headerKey) }))
    case 'SET_HEADER_FIELD':
      return mapEvent(state, action.eventKey, (e) => mapHeader(e, action.headerKey, (h) => ({ ...h, [action.field]: action.value })))

    case 'ADD_SUBGROUP':
      return mapEvent(state, action.eventKey, (e) => mapHeader(e, action.headerKey, (h) => ({ ...h, subGroups: [...h.subGroups, newSubGroup()] })))
    case 'REMOVE_SUBGROUP':
      return mapEvent(state, action.eventKey, (e) => mapHeader(e, action.headerKey, (h) => ({ ...h, subGroups: h.subGroups.filter((sg) => sg.key !== action.subGroupKey) })))
    case 'SET_SUBGROUP_FIELD':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => mapSubGroup(h, action.subGroupKey, (sg) => {
          const next = { ...sg, [action.field]: action.value }
          // Mengosongkan nama Jenis Menu = membuang isinya: item ikut terhapus
          // (kartu Jenis Menu tetap ada agar nama baru bisa diketik ulang).
          if (action.field === 'name' && action.value.trim() === '') next.items = []
          return next
        })))

    case 'ADD_ITEM':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => mapSubGroup(h, action.subGroupKey, (sg) => ({ ...sg, items: [...sg.items, newMenuItem()] }))))
    case 'REMOVE_ITEM':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => mapSubGroup(h, action.subGroupKey, (sg) => ({ ...sg, items: sg.items.filter((it) => it.key !== action.itemKey) }))))
    case 'SET_ITEM_FIELD':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) =>
          mapSubGroup(h, action.subGroupKey, (sg) => ({
            ...sg,
            items: sg.items.map((it) => (it.key === action.itemKey ? { ...it, [action.field]: action.value } : it)),
          }))))

    case 'SET_PRICING_FIELD':
      return { ...state, pricing: { ...state.pricing, [action.field]: action.value } }
    case 'TOGGLE_DISCOUNT':
      return {
        ...state,
        pricing: { ...state.pricing, discountEnabled: action.on, discountValue: action.on ? state.pricing.discountValue : 0 },
      }
    default:
      return state
  }
}
