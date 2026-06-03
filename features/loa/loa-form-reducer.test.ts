import { describe, it, expect } from 'vitest'
import { loaFormReducer } from './loa-form-reducer'
import { DEFAULT_PRICING, type LoaWizardState, type LoaItemDraft } from './types'

const baseState: LoaWizardState = {
  detail: {
    eventName: 'MAP Forward', eventAddress: 'Generali Tower',
    eventDate: '2026-04-29', eventTime: '08:00 - 17:00',
    pax: 30, setupLocation: '', salesId: 'sales-1',
  },
  items: [],
  pricing: { ...DEFAULT_PRICING },
}

const item: LoaItemDraft = {
  key: 'k1', packageId: 'p1', packageName: 'Gala Dinner',
  pricePerPax: 150000, pax: 500, selections: [],
}

describe('loaFormReducer', () => {
  it('SET_DETAIL_FIELD mengubah satu field detail', () => {
    const s = loaFormReducer(baseState, { type: 'SET_DETAIL_FIELD', field: 'eventName', value: 'Halal Bihalal' })
    expect(s.detail.eventName).toBe('Halal Bihalal')
    expect(s.detail.pax).toBe(30) // field lain tak berubah
  })

  it('ADD_ITEM menambah item', () => {
    const s = loaFormReducer(baseState, { type: 'ADD_ITEM', item })
    expect(s.items).toHaveLength(1)
    expect(s.items[0].key).toBe('k1')
  })

  it('REMOVE_ITEM menghapus item berdasarkan key', () => {
    const withItem = loaFormReducer(baseState, { type: 'ADD_ITEM', item })
    const s = loaFormReducer(withItem, { type: 'REMOVE_ITEM', key: 'k1' })
    expect(s.items).toHaveLength(0)
  })

  it('SET_PRICING_FIELD mengubah persentase', () => {
    const s = loaFormReducer(baseState, { type: 'SET_PRICING_FIELD', field: 'scPct', value: 7 })
    expect(s.pricing.scPct).toBe(7)
  })

  it('TOGGLE_DISCOUNT off → discountValue 0 & disabled', () => {
    const on = loaFormReducer(baseState, { type: 'TOGGLE_DISCOUNT', on: true })
    const withVal = loaFormReducer(on, { type: 'SET_PRICING_FIELD', field: 'discountValue', value: 5 })
    expect(withVal.pricing.discountEnabled).toBe(true)
    const off = loaFormReducer(withVal, { type: 'TOGGLE_DISCOUNT', on: false })
    expect(off.pricing.discountEnabled).toBe(false)
    expect(off.pricing.discountValue).toBe(0)
  })
})
