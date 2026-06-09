import { describe, it, expect } from 'vitest'
import { loaFormReducer, initialState } from './loa-form-reducer'
import type { HeaderDraft } from './types'

function withHeader() {
  let s = loaFormReducer(initialState([]), { type: 'ADD_EVENT' })
  const ek = s.events[0].key
  s = loaFormReducer(s, { type: 'ADD_HEADER', eventKey: ek })
  const hk = s.events[0].headers[0].key
  return { s, ek, hk }
}

describe('loaFormReducer 3-level', () => {
  it('ADD_EVENT + ADD_HEADER', () => {
    const { s } = withHeader()
    expect(s.events[0].headers).toHaveLength(1)
    expect(s.events[0].headers[0].sections).toEqual([])
  })

  it('ADD_SECTION + ADD_SUBGROUP + ADD_ITEM ke subgroup', () => {
    let { s, ek, hk } = withHeader()
    s = loaFormReducer(s, { type: 'ADD_SECTION', eventKey: ek, headerKey: hk })
    const sk = s.events[0].headers[0].sections[0].key
    s = loaFormReducer(s, { type: 'ADD_SUBGROUP', eventKey: ek, headerKey: hk, sectionKey: sk })
    const gk = s.events[0].headers[0].sections[0].subGroups[0].key
    s = loaFormReducer(s, { type: 'ADD_ITEM', eventKey: ek, headerKey: hk, sectionKey: sk, subGroupKey: gk })
    expect(s.events[0].headers[0].sections[0].subGroups[0].items).toHaveLength(1)
  })

  it('ADD_ITEM langsung di header (section null, sub null)', () => {
    let { s, ek, hk } = withHeader()
    s = loaFormReducer(s, { type: 'ADD_ITEM', eventKey: ek, headerKey: hk, sectionKey: null, subGroupKey: null })
    expect(s.events[0].headers[0].items).toHaveLength(1)
  })

  it('ADD_ITEM langsung di section (subgroup null)', () => {
    let { s, ek, hk } = withHeader()
    s = loaFormReducer(s, { type: 'ADD_SECTION', eventKey: ek, headerKey: hk })
    const sk = s.events[0].headers[0].sections[0].key
    s = loaFormReducer(s, { type: 'ADD_ITEM', eventKey: ek, headerKey: hk, sectionKey: sk, subGroupKey: null })
    expect(s.events[0].headers[0].sections[0].items).toHaveLength(1)
  })

  it('ADD_PREFILLED_HEADER menambah header siap pakai (re-key)', () => {
    let s = loaFormReducer(initialState([]), { type: 'ADD_EVENT' })
    const ek = s.events[0].key
    const header: HeaderDraft = {
      key: 'x', name: 'Full Day', keterangan: '', pax: 0, amount: 0, items: [],
      sections: [{ key: 's', name: 'Coffee Break 1', keterangan: '', items: [], subGroups: [] }],
    }
    s = loaFormReducer(s, { type: 'ADD_PREFILLED_HEADER', eventKey: ek, header })
    expect(s.events[0].headers[0].name).toBe('Full Day')
    expect(s.events[0].headers[0].sections[0].name).toBe('Coffee Break 1')
    expect(s.events[0].headers[0].key).not.toBe('x') // re-key
  })

  it('TOGGLE_DISCOUNT off → discountValue 0', () => {
    const on = loaFormReducer(initialState([]), { type: 'TOGGLE_DISCOUNT', on: true })
    const withVal = loaFormReducer(on, { type: 'SET_PRICING_FIELD', field: 'discountValue', value: 5 })
    const off = loaFormReducer(withVal, { type: 'TOGGLE_DISCOUNT', on: false })
    expect(off.pricing.discountEnabled).toBe(false)
    expect(off.pricing.discountValue).toBe(0)
  })
})
