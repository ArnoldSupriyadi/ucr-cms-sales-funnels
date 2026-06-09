import type {
  LoaWizardState,
  LoaDetailDraft,
  LoaPricingDraft,
  EventDraft,
  HeaderDraft,
  SectionDraft,
  SubGroupDraft,
  MenuItemDraft,
} from './types'
import { DEFAULT_PRICING } from './types'

const uid = () => crypto.randomUUID()

// ---- Factory node ----
export const newMenuItem = (): MenuItemDraft => ({ key: uid(), name: '', keterangan: '' })
export const newSubGroup = (): SubGroupDraft => ({ key: uid(), name: '', keterangan: '', items: [] })
export const newSection = (): SectionDraft => ({ key: uid(), name: '', keterangan: '', items: [], subGroups: [] })
export const newHeader = (): HeaderDraft => ({
  key: uid(), name: '', keterangan: '', pax: 0, amount: 0, items: [], sections: [],
})
export const newEvent = (eventDate = ''): EventDraft => ({
  key: uid(), eventDate, servingTime: '', venue: '', setupLocation: '', pax: 0, headers: [],
})

/** Deep-clone header dgn key baru di tiap node (dipakai saat ADD_PREFILLED_HEADER). */
export const newPrefilledHeader = (h: HeaderDraft): HeaderDraft => ({
  ...h,
  key: uid(),
  items: h.items.map((it) => ({ ...it, key: uid() })),
  sections: h.sections.map((s) => ({
    ...s,
    key: uid(),
    items: s.items.map((it) => ({ ...it, key: uid() })),
    subGroups: s.subGroups.map((sg) => ({
      ...sg,
      key: uid(),
      items: sg.items.map((it) => ({ ...it, key: uid() })),
    })),
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
  // section (komponen)
  | { type: 'ADD_SECTION'; eventKey: string; headerKey: string }
  | { type: 'REMOVE_SECTION'; eventKey: string; headerKey: string; sectionKey: string }
  | { type: 'SET_SECTION_FIELD'; eventKey: string; headerKey: string; sectionKey: string; field: 'name' | 'keterangan'; value: string }
  // sub-grup (sub-kategori) — selalu di dalam section
  | { type: 'ADD_SUBGROUP'; eventKey: string; headerKey: string; sectionKey: string }
  | { type: 'REMOVE_SUBGROUP'; eventKey: string; headerKey: string; sectionKey: string; subGroupKey: string }
  | { type: 'SET_SUBGROUP_FIELD'; eventKey: string; headerKey: string; sectionKey: string; subGroupKey: string; field: 'name' | 'keterangan'; value: string }
  // item — lokasi: (sectionKey null & subGroupKey null = header) | (sectionKey set & subGroupKey null = section) | (keduanya set = subgroup)
  | { type: 'ADD_ITEM'; eventKey: string; headerKey: string; sectionKey: string | null; subGroupKey: string | null }
  | { type: 'REMOVE_ITEM'; eventKey: string; headerKey: string; sectionKey: string | null; subGroupKey: string | null; itemKey: string }
  | { type: 'SET_ITEM_FIELD'; eventKey: string; headerKey: string; sectionKey: string | null; subGroupKey: string | null; itemKey: string; field: 'name' | 'keterangan'; value: string }
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
function mapSection(header: HeaderDraft, sectionKey: string, fn: (s: SectionDraft) => SectionDraft): HeaderDraft {
  return { ...header, sections: header.sections.map((s) => (s.key === sectionKey ? fn(s) : s)) }
}
type ItemsFn = (items: MenuItemDraft[]) => MenuItemDraft[]
/** Terapkan fn ke daftar item pada lokasi (sectionKey/subGroupKey) di dalam header. */
function upsertItems(header: HeaderDraft, sectionKey: string | null, subGroupKey: string | null, fn: ItemsFn): HeaderDraft {
  if (sectionKey === null) return { ...header, items: fn(header.items) }
  return mapSection(header, sectionKey, (s) => {
    if (subGroupKey === null) return { ...s, items: fn(s.items) }
    return { ...s, subGroups: s.subGroups.map((sg) => (sg.key === subGroupKey ? { ...sg, items: fn(sg.items) } : sg)) }
  })
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

    case 'ADD_SECTION':
      return mapEvent(state, action.eventKey, (e) => mapHeader(e, action.headerKey, (h) => ({ ...h, sections: [...h.sections, newSection()] })))
    case 'REMOVE_SECTION':
      return mapEvent(state, action.eventKey, (e) => mapHeader(e, action.headerKey, (h) => ({ ...h, sections: h.sections.filter((s) => s.key !== action.sectionKey) })))
    case 'SET_SECTION_FIELD':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => mapSection(h, action.sectionKey, (s) => ({ ...s, [action.field]: action.value }))))

    case 'ADD_SUBGROUP':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => mapSection(h, action.sectionKey, (s) => ({ ...s, subGroups: [...s.subGroups, newSubGroup()] }))))
    case 'REMOVE_SUBGROUP':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => mapSection(h, action.sectionKey, (s) => ({ ...s, subGroups: s.subGroups.filter((sg) => sg.key !== action.subGroupKey) }))))
    case 'SET_SUBGROUP_FIELD':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) =>
          mapSection(h, action.sectionKey, (s) => ({
            ...s,
            subGroups: s.subGroups.map((sg) => (sg.key === action.subGroupKey ? { ...sg, [action.field]: action.value } : sg)),
          }))))

    case 'ADD_ITEM':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => upsertItems(h, action.sectionKey, action.subGroupKey, (items) => [...items, newMenuItem()])))
    case 'REMOVE_ITEM':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) => upsertItems(h, action.sectionKey, action.subGroupKey, (items) => items.filter((it) => it.key !== action.itemKey))))
    case 'SET_ITEM_FIELD':
      return mapEvent(state, action.eventKey, (e) =>
        mapHeader(e, action.headerKey, (h) =>
          upsertItems(h, action.sectionKey, action.subGroupKey, (items) =>
            items.map((it) => (it.key === action.itemKey ? { ...it, [action.field]: action.value } : it)))))

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
