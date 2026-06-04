import { describe, it, expect } from 'vitest'
import {
  ORDER_TYPES, ORDER_TYPE_KEYS, serviceChargePctForType, categoriesForType,
} from './order-type'

describe('order-type konstanta', () => {
  it('Package SC 5, Event SC 10', () => {
    expect(serviceChargePctForType('Package')).toBe(5)
    expect(serviceChargePctForType('Event')).toBe(10)
  })
  it('tipe tak dikenal / null → 0', () => {
    expect(serviceChargePctForType(null)).toBe(0)
    expect(serviceChargePctForType('Xxx' as never)).toBe(0)
  })
  it('kategori per tipe', () => {
    expect(categoriesForType('Package')).toEqual([
      'Box Package (Nasi/Snack/Bento/Longbox)',
      'Gift Box (Tumpeng/Bakul/Hampers/Dropfood)',
    ])
    expect(categoriesForType('Event')).toContain('Canape')
    expect(categoriesForType(null)).toEqual([])
  })
  it('hanya 2 tipe', () => {
    expect(ORDER_TYPE_KEYS).toEqual(['Package', 'Event'])
    expect(Object.keys(ORDER_TYPES)).toHaveLength(2)
  })
})
