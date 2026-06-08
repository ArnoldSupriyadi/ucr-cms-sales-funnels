import { describe, it, expect } from 'vitest'
import { loaFormReducer, initialState } from './loa-form-reducer'

describe('loaFormReducer pohon', () => {
  it('ADD_EVENT menambah event kosong', () => {
    const s = loaFormReducer(initialState([]), { type: 'ADD_EVENT' })
    expect(s.events).toHaveLength(1)
    expect(s.events[0].headers).toEqual([])
  })

  it('ADD_HEADER menambah header ke event', () => {
    let s = loaFormReducer(initialState([]), { type: 'ADD_EVENT' })
    const ek = s.events[0].key
    s = loaFormReducer(s, { type: 'ADD_HEADER', eventKey: ek })
    expect(s.events[0].headers).toHaveLength(1)
  })

  it('SET_HEADER_FIELD mengubah amount', () => {
    let s = loaFormReducer(initialState([]), { type: 'ADD_EVENT' })
    const ek = s.events[0].key
    s = loaFormReducer(s, { type: 'ADD_HEADER', eventKey: ek })
    const hk = s.events[0].headers[0].key
    s = loaFormReducer(s, { type: 'SET_HEADER_FIELD', eventKey: ek, headerKey: hk, field: 'amount', value: 5000 })
    expect(s.events[0].headers[0].amount).toBe(5000)
  })

  it('ADD_ITEM langsung di header (subGroupKey null)', () => {
    let s = loaFormReducer(initialState([]), { type: 'ADD_EVENT' })
    const ek = s.events[0].key
    s = loaFormReducer(s, { type: 'ADD_HEADER', eventKey: ek })
    const hk = s.events[0].headers[0].key
    s = loaFormReducer(s, { type: 'ADD_ITEM', eventKey: ek, headerKey: hk, subGroupKey: null })
    expect(s.events[0].headers[0].items).toHaveLength(1)
  })

  it('ADD_ITEM ke sub-grup', () => {
    let s = loaFormReducer(initialState([]), { type: 'ADD_EVENT' })
    const ek = s.events[0].key
    s = loaFormReducer(s, { type: 'ADD_HEADER', eventKey: ek })
    const hk = s.events[0].headers[0].key
    s = loaFormReducer(s, { type: 'ADD_SUBGROUP', eventKey: ek, headerKey: hk })
    const sgk = s.events[0].headers[0].subGroups[0].key
    s = loaFormReducer(s, { type: 'ADD_ITEM', eventKey: ek, headerKey: hk, subGroupKey: sgk })
    expect(s.events[0].headers[0].subGroups[0].items).toHaveLength(1)
    expect(s.events[0].headers[0].items).toHaveLength(0)
  })

  it('TOGGLE_DISCOUNT off → discountValue 0 & disabled', () => {
    const on = loaFormReducer(initialState([]), { type: 'TOGGLE_DISCOUNT', on: true })
    const withVal = loaFormReducer(on, { type: 'SET_PRICING_FIELD', field: 'discountValue', value: 5 })
    expect(withVal.pricing.discountEnabled).toBe(true)
    const off = loaFormReducer(withVal, { type: 'TOGGLE_DISCOUNT', on: false })
    expect(off.pricing.discountEnabled).toBe(false)
    expect(off.pricing.discountValue).toBe(0)
  })
})
