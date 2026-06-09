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

describe('loaFormReducer (Header → Jenis Menu → Item)', () => {
  it('ADD_HEADER → subGroups kosong', () => {
    const { s } = withHeader()
    expect(s.events[0].headers).toHaveLength(1)
    expect(s.events[0].headers[0].subGroups).toEqual([])
  })

  it('ADD_SUBGROUP + ADD_ITEM ke Jenis Menu', () => {
    let { s, ek, hk } = withHeader()
    s = loaFormReducer(s, { type: 'ADD_SUBGROUP', eventKey: ek, headerKey: hk })
    const gk = s.events[0].headers[0].subGroups[0].key
    s = loaFormReducer(s, { type: 'ADD_ITEM', eventKey: ek, headerKey: hk, subGroupKey: gk })
    expect(s.events[0].headers[0].subGroups[0].items).toHaveLength(1)
  })

  it('SET_SUBGROUP_FIELD name', () => {
    let { s, ek, hk } = withHeader()
    s = loaFormReducer(s, { type: 'ADD_SUBGROUP', eventKey: ek, headerKey: hk })
    const gk = s.events[0].headers[0].subGroups[0].key
    s = loaFormReducer(s, { type: 'SET_SUBGROUP_FIELD', eventKey: ek, headerKey: hk, subGroupKey: gk, field: 'name', value: 'Beef' })
    expect(s.events[0].headers[0].subGroups[0].name).toBe('Beef')
  })

  it('ADD_PREFILLED_HEADER menambah header siap pakai (re-key)', () => {
    let s = loaFormReducer(initialState([]), { type: 'ADD_EVENT' })
    const ek = s.events[0].key
    const header: HeaderDraft = {
      key: 'x', name: 'Full Day', keterangan: '', pax: 0, amount: 0,
      subGroups: [{ key: 'g', name: 'Beef', keterangan: '', items: [{ key: 'i', name: 'Rendang', keterangan: '' }] }],
    }
    s = loaFormReducer(s, { type: 'ADD_PREFILLED_HEADER', eventKey: ek, header })
    expect(s.events[0].headers[0].name).toBe('Full Day')
    expect(s.events[0].headers[0].subGroups[0].name).toBe('Beef')
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
