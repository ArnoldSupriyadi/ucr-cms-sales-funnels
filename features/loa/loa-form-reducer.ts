import type { LoaWizardState, LoaDetailDraft, LoaItemDraft, LoaPricingDraft } from './types'

export type LoaFormAction =
  | { type: 'SET_DETAIL_FIELD'; field: keyof LoaDetailDraft; value: string | number }
  | { type: 'ADD_ITEM'; item: LoaItemDraft }
  | { type: 'REMOVE_ITEM'; key: string }
  | { type: 'SET_PRICING_FIELD'; field: keyof LoaPricingDraft; value: string | number | boolean }
  | { type: 'TOGGLE_DISCOUNT'; on: boolean }

export function loaFormReducer(state: LoaWizardState, action: LoaFormAction): LoaWizardState {
  switch (action.type) {
    case 'SET_DETAIL_FIELD':
      return { ...state, detail: { ...state.detail, [action.field]: action.value } }
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.key !== action.key) }
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
