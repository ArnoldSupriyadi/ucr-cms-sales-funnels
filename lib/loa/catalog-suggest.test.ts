import { describe, it, expect } from 'vitest'
import { searchMenuItems, packageToHeader } from './catalog-suggest'
import type { MenuCatalog } from '@/features/loa/types'

const catalog = {
  packages: [
    {
      id: 'pkg-1', namaPaket: 'Fullday Meeting', kategori: 'Event',
      hargaPerPax: 369000, hargaMinimum: null, hasSelection: true,
      components: [{ componentType: 'CB', nama: 'Coffee Break', qty: 1, sortOrder: 1 }],
    },
  ],
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

describe('catalog-suggest', () => {
  it('searchMenuItems memfilter case-insensitive', () => {
    expect(searchMenuItems(catalog, 'nas').some((n) => /nasi/i.test(n))).toBe(true)
    expect(searchMenuItems(catalog, '')).toEqual([])
  })

  it('packageToHeader memetakan paket→HeaderDraft (sub-grup dari kategori + item)', () => {
    const h = packageToHeader(catalog, 'pkg-1')
    expect(h?.name).toBe('Fullday Meeting')
    expect(h?.subGroups).toHaveLength(1)
    expect(h?.subGroups[0].name).toBe('Coffee Break')
    expect(h?.subGroups[0].items.map((i) => i.name)).toContain('Nasi Goreng')
  })

  it('packageToHeader paket tak ada → null', () => {
    expect(packageToHeader(catalog, 'nope')).toBeNull()
  })
})
