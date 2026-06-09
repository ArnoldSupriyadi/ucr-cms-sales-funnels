import { describe, it, expect } from 'vitest'
import { searchMenuItems } from './catalog-suggest'
import type { MenuCatalog } from '@/features/loa/types'

const catalog = {
  packages: [],
  categoriesByComponentType: {
    CB: [
      {
        id: 'c1', componentType: 'CB', nama: 'Coffee Break', rule: {}, groupName: null,
        items: [
          { id: 'i1', nama: 'Nasi Goreng' },
          { id: 'i2', nama: 'Lemper Ayam' },
        ],
      },
    ],
  },
} as unknown as MenuCatalog

describe('searchMenuItems', () => {
  it('memfilter case-insensitive', () => {
    expect(searchMenuItems(catalog, 'nas').some((n) => /nasi/i.test(n))).toBe(true)
    expect(searchMenuItems(catalog, 'AYAM')).toContain('Lemper Ayam')
  })
  it('query kosong → []', () => {
    expect(searchMenuItems(catalog, '')).toEqual([])
    expect(searchMenuItems(catalog, '   ')).toEqual([])
  })
})
