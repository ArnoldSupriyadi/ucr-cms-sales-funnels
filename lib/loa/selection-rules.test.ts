import { describe, it, expect } from 'vitest'
import { validateCategorySelections } from './selection-rules'

describe('validateCategorySelections', () => {
  it('rule one harus tepat 1 — kosong = error', () => {
    const errors = validateCategorySelections([
      { categoryId: 'c1', categoryName: 'Minuman', rule: 'one', selectedItemIds: [] },
    ])
    expect(errors).toHaveLength(1)
    expect(errors[0].categoryId).toBe('c1')
  })

  it('rule one dengan >1 terpilih = error', () => {
    const errors = validateCategorySelections([
      { categoryId: 'c1', categoryName: 'Minuman', rule: 'one', selectedItemIds: ['a', 'b'] },
    ])
    expect(errors).toHaveLength(1)
  })

  it('rule one dengan tepat 1 = valid', () => {
    const errors = validateCategorySelections([
      { categoryId: 'c1', categoryName: 'Minuman', rule: 'one', selectedItemIds: ['a'] },
    ])
    expect(errors).toHaveLength(0)
  })

  it('rule multiple butuh minimal 1', () => {
    expect(
      validateCategorySelections([
        { categoryId: 'c2', categoryName: 'Savoury', rule: 'multiple', selectedItemIds: [] },
      ])
    ).toHaveLength(1)
    expect(
      validateCategorySelections([
        { categoryId: 'c2', categoryName: 'Savoury', rule: 'multiple', selectedItemIds: ['x'] },
      ])
    ).toHaveLength(0)
  })

  it('gabungan beberapa kategori melaporkan semua yang gagal', () => {
    const errors = validateCategorySelections([
      { categoryId: 'c1', categoryName: 'Minuman', rule: 'one', selectedItemIds: [] },
      { categoryId: 'c2', categoryName: 'Savoury', rule: 'multiple', selectedItemIds: ['x'] },
      { categoryId: 'c3', categoryName: 'Dessert', rule: 'one', selectedItemIds: ['y', 'z'] },
    ])
    expect(errors.map((e) => e.categoryId).sort()).toEqual(['c1', 'c3'])
  })
})
