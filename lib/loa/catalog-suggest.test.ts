import { describe, it, expect } from 'vitest'
import { searchMenuItems, searchCategories, searchItemsInCategory, searchPackages, packageToHeader, packageComponentsSummary } from './catalog-suggest'
import type { MenuCatalog } from '@/features/loa/types'

const catalog = {
  packages: [
    {
      id: 'pkg-1', namaPaket: 'Full Day Meeting', kategori: 'Meeting Package',
      hargaPerPax: null, hargaMinimum: null, hasSelection: true,
      components: [
        { componentType: 'coffee_break', nama: 'Coffee Break', qty: 2, sortOrder: 0 },
        { componentType: 'buffet', nama: 'Buffet', qty: 1, sortOrder: 1 },
      ],
    },
    {
      id: 'pkg-snack', namaPaket: 'Snack Box Premium', kategori: 'Snack Box',
      hargaPerPax: 50000, hargaMinimum: null, hasSelection: false, components: [],
    },
  ],
  categoriesByComponentType: {
    coffee_break: [
      {
        id: 'c-sav', componentType: 'coffee_break', nama: 'Savoury', rule: {}, groupName: null,
        items: [
          { id: 'i1', nama: 'Risoles' }, { id: 'i2', nama: 'Lemper' },
          { id: 'i3', nama: 'Pastel' }, { id: 'i4', nama: 'Sosis' },
        ],
      },
    ],
    buffet: [
      { id: 'c-beef', componentType: 'buffet', nama: 'Beef', rule: {}, groupName: 'Main Course', items: [{ id: 'b1', nama: 'Rendang' }] },
    ],
  },
} as unknown as MenuCatalog

describe('searchMenuItems', () => {
  it('filter item case-insensitive; kosong → []', () => {
    expect(searchMenuItems(catalog, 'ris')).toContain('Risoles')
    expect(searchMenuItems(catalog, '')).toEqual([])
  })
})

describe('searchPackages', () => {
  it('filter per kategori; query kosong + kategori → semua di kategori itu', () => {
    expect(searchPackages(catalog, '', 'Meeting Package')).toContain('Full Day Meeting')
    expect(searchPackages(catalog, 'full', 'Meeting Package')).toContain('Full Day Meeting')
    expect(searchPackages(catalog, '', 'Buffet')).toEqual([]) // tak ada paket kategori Buffet di fixture
    expect(searchPackages(catalog, '')).toEqual([]) // tanpa kategori & query kosong → []
  })
  it('beberapa kategori (array) → gabung dari semua kategori itu', () => {
    const r = searchPackages(catalog, '', ['Meeting Package', 'Snack Box'])
    expect(r).toContain('Full Day Meeting')
    expect(r).toContain('Snack Box Premium')
    expect(searchPackages(catalog, 'snack', ['Meeting Package', 'Snack Box'])).toEqual(['Snack Box Premium'])
  })
})

describe('searchCategories', () => {
  it('cari nama kategori daun; kosong → semua (terurut)', () => {
    expect(searchCategories(catalog, 'sav')).toContain('Savoury')
    expect(searchCategories(catalog, 'bee')).toContain('Beef')
    expect(searchCategories(catalog, '')).toEqual(['Beef', 'Savoury'])
  })
})

describe('searchItemsInCategory', () => {
  it('item kategori (kosong→semua), filter query, kategori kosong→[]', () => {
    expect(searchItemsInCategory(catalog, 'Savoury', '')).toEqual(['Risoles', 'Lemper', 'Pastel', 'Sosis'])
    expect(searchItemsInCategory(catalog, 'Savoury', 'pas')).toEqual(['Pastel'])
    expect(searchItemsInCategory(catalog, 'Beef', '')).toEqual(['Rendang'])
    expect(searchItemsInCategory(catalog, '', '')).toEqual([])
  })
})

describe('packageComponentsSummary (panduan komponen di input Header)', () => {
  const cat = {
    packages: [
      {
        id: 'p-full', namaPaket: 'Full Day Meeting', kategori: 'Meeting Package',
        hargaPerPax: null, hargaMinimum: null, hasSelection: true,
        components: [
          { componentType: 'buffet', nama: 'Asian Buffet', qty: 1, sortOrder: 1 },
          { componentType: 'coffee_break', nama: 'Coffee Break', qty: 2, sortOrder: 0 },
        ],
      },
      {
        id: 'p-cb', namaPaket: 'Coffee Break', kategori: 'Meeting Package',
        hargaPerPax: null, hargaMinimum: null, hasSelection: false,
        components: [{ componentType: 'coffee_break', nama: 'Coffee Break', qty: 1, sortOrder: 0 }],
      },
      {
        id: 'p-set', namaPaket: 'Set Menu', kategori: 'Meeting Package',
        hargaPerPax: null, hargaMinimum: null, hasSelection: false, components: [],
      },
    ],
    categoriesByComponentType: {},
  } as unknown as MenuCatalog

  it('paket dgn komponen → ringkasan urut sortOrder', () => {
    expect(packageComponentsSummary(cat, 'Full Day Meeting')).toBe('2× Coffee Break · 1× Asian Buffet')
  })
  it('cocok persis case-insensitive + trim', () => {
    expect(packageComponentsSummary(cat, '  full day meeting ')).toBe('2× Coffee Break · 1× Asian Buffet')
  })
  it('komponen tunggal qty 1 sama nama header → null (redundan)', () => {
    expect(packageComponentsSummary(cat, 'Coffee Break')).toBeNull()
  })
  it('paket tanpa komponen → null', () => {
    expect(packageComponentsSummary(cat, 'Set Menu')).toBeNull()
  })
  it('nama tak cocok / kosong → null', () => {
    expect(packageComponentsSummary(cat, 'Nasi Goreng')).toBeNull()
    expect(packageComponentsSummary(cat, '')).toBeNull()
  })
})

describe('packageToHeader (Header → Jenis Menu)', () => {
  it('sub-kategori daun unik dari semua komponen + 3 item contoh', () => {
    const h = packageToHeader(catalog, 'pkg-1')!
    expect(h.name).toBe('Full Day Meeting')
    expect(h.subGroups.map((g) => g.name)).toEqual(['Savoury', 'Beef'])
    expect(h.subGroups[0].items).toHaveLength(3)
    expect(h.subGroups[0].items.map((i) => i.name)).toEqual(['Risoles', 'Lemper', 'Pastel'])
  })
  it('paket tak ada → null', () => {
    expect(packageToHeader(catalog, 'zz')).toBeNull()
  })
})
