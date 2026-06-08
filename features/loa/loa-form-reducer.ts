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

// ---- Factory node ----
export const newMenuItem = (): MenuItemDraft => ({ key: crypto.randomUUID(), name: '', keterangan: '' })
export const newSubGroup = (): SubGroupDraft => ({ key: crypto.randomUUID(), name: '', keterangan: '', items: [] })
export const newHeader = (): HeaderDraft => ({
  key: crypto.randomUUID(), name: '', keterangan: '', pax: 0, amount: 0, subGroups: [], items: [],
})
export const newEvent = (eventDate = ''): EventDraft => ({
  key: crypto.randomUUID(), eventDate, servingTime: '', venue: '', setupLocation: '', pax: 0, headers: [],
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
  | { type: 'REMOVE_HEADER'; eventKey: string; headerKey: string }
  | { type: 'SET_HEADER_FIELD'; eventKey: string; headerKey: string; field: 'name' | 'keterangan' | 'pax' | 'amount'; value: string | number }
  | { type: 'FILL_HEADER_FROM_PACKAGE'; eventKey: string; headerKey: string; header: HeaderDraft }
  // sub-grup
  | { type: 'ADD_SUBGROUP'; eventKey: string; headerKey: string }
  | { type: 'REMOVE_SUBGROUP'; eventKey: string; headerKey: string; subGroupKey: string }
  | { type: 'SET_SUBGROUP_FIELD'; eventKey: string; headerKey: string; subGroupKey: string; field: 'name' | 'keterangan'; value: string }
  // item (subGroupKey null = item langsung di header)
  | { type: 'ADD_ITEM'; eventKey: string; headerKey: string; subGroupKey: string | null }
  | { type: 'REMOVE_ITEM'; eventKey: string; headerKey: string; subGroupKey: string | null; itemKey: string }
  | { type: 'SET_ITEM_FIELD'; eventKey: string; headerKey: string; subGroupKey: string | null; itemKey: string; field: 'name' | 'keterangan'; value: string }
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
function upsertItems(
  header: HeaderDraft,
  subGroupKey: string | null,
  fn: (items: MenuItemDraft[]) => MenuItemDraft[],
): HeaderDraft {
  if (subGroupKey === null) return { ...header, items: fn(header.items) }
  return {
    ...header,
    subGroups: header.subGroups.map((sg) => (sg.key === subGroupKey ? { ...sg, items: fn(sg.items) } : sg)),
  }
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
    case 'REMOVE_HEADER':
      return mapEvent(state, action.eventKey, (e) => ({ ...e, headers: e.headers.filter((h) => h.key !== action.headerKey) }))
    case 'SET_HEADER_FIELD':
      return mapEvent(state, action.eventKey, (e) => mapHeader(e, action.headerKey, (h) => ({ ...h, [action.field]: action.value })))
    case 'FILL_HEADER_FROM_PACKAGE':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => ({ ...action.header, key: h.key, pax: h.pax, amount: h.amount })),
      )

    case 'ADD_SUBGROUP':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => ({ ...h, subGroups: [...h.subGroups, newSubGroup()] })),
      )
    case 'REMOVE_SUBGROUP':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => ({ ...h, subGroups: h.subGroups.filter((sg) => sg.key !== action.subGroupKey) })),
      )
    case 'SET_SUBGROUP_FIELD':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => ({
          ...h,
          subGroups: h.subGroups.map((sg) => (sg.key === action.subGroupKey ? { ...sg, [action.field]: action.value } : sg)),
        })),
      )

    case 'ADD_ITEM':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => upsertItems(h, action.subGroupKey, (items) => [...items, newMenuItem()])),
      )
    case 'REMOVE_ITEM':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => upsertItems(h, action.subGroupKey, (items) => items.filter((it) => it.key !== action.itemKey))),
      )
    case 'SET_ITEM_FIELD':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) =>
          upsertItems(h, action.subGroupKey, (items) =>
            items.map((it) => (it.key === action.itemKey ? { ...it, [action.field]: action.value } : it)),
          ),
        ),
      )

    case 'SET_PRICING_FIELD':
      return { ...state, pricing: { ...state.pricing, [action.field]: action.value } }
    case 'TOGGLE_DISCOUNT':
      return {
        ...state,
        pricing: {
          ...state.pricing,
          discountEnabled: action.on,
          discountValue: action.on ? state.pricing.discountValue : 0,
        },
      }
    default:
      return state
  }
}
