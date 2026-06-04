import { describe, it, expect } from 'vitest'
import { filterCategoriesByQuery } from './filter-categories'
import type { CatalogCategory } from '@/features/loa/types'

const cats: CatalogCategory[] = [
  {
    id: 'snack', componentType: 'cb', nama: 'Snack', rule: 'one', groupName: null,
    items: [{ id: 'a', nama: 'Risoles' }, { id: 'b', nama: 'Pastel' }],
  },
  {
    id: 'main', componentType: 'lunch', nama: 'Main Course', rule: 'multiple', groupName: null,
    items: [{ id: 'c', nama: 'Ayam Bakar' }, { id: 'd', nama: 'Gurame' }],
  },
]

describe('filterCategoriesByQuery', () => {
  it('query kosong → kategori utuh', () => {
    expect(filterCategoriesByQuery(cats, '')).toEqual(cats)
    expect(filterCategoriesByQuery(cats, '   ')).toEqual(cats)
  })
  it('match sebagian nama item, case-insensitive', () => {
    const r = filterCategoriesByQuery(cats, 'ris')
    expect(r).toHaveLength(1)
    expect(r[0].id).toBe('snack')
    expect(r[0].items).toEqual([{ id: 'a', nama: 'Risoles' }])
  })
  it('kategori tanpa match dibuang', () => {
    const r = filterCategoriesByQuery(cats, 'ayam')
    expect(r).toHaveLength(1)
    expect(r[0].id).toBe('main')
    expect(r[0].items).toEqual([{ id: 'c', nama: 'Ayam Bakar' }])
  })
  it('query tak cocok sama sekali → array kosong', () => {
    expect(filterCategoriesByQuery(cats, 'zzz')).toEqual([])
  })
  it('tidak memutasi kategori asli', () => {
    filterCategoriesByQuery(cats, 'ris')
    expect(cats[0].items).toHaveLength(2)
  })
})
