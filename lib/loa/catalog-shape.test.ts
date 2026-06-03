import { describe, it, expect } from 'vitest'
import { shapeMenuCatalog } from './catalog-shape'

// Fixture meniru struktur indonesian_buffet:
//   Starters [one] (header) → Appetizer, Soup
//   Rice [multiple] (standalone)
//   Main Course [multiple] (header) → Beef
//   Beverages [multiple] (standalone)
const categories = [
  { id: 'starters', component_type: 'buf', nama: 'Starters', selection_rule: 'one', parent_id: null, sort_order: 0 },
  { id: 'appetizer', component_type: 'buf', nama: 'Appetizer', selection_rule: 'one', parent_id: 'starters', sort_order: 0 },
  { id: 'soup', component_type: 'buf', nama: 'Soup', selection_rule: 'one', parent_id: 'starters', sort_order: 1 },
  { id: 'rice', component_type: 'buf', nama: 'Rice', selection_rule: 'multiple', parent_id: null, sort_order: 1 },
  { id: 'mains', component_type: 'buf', nama: 'Main Course', selection_rule: 'multiple', parent_id: null, sort_order: 2 },
  { id: 'beef', component_type: 'buf', nama: 'Beef', selection_rule: 'multiple', parent_id: 'mains', sort_order: 0 },
  { id: 'bev', component_type: 'buf', nama: 'Beverages', selection_rule: 'multiple', parent_id: null, sort_order: 3 },
]
const items = [
  { id: 'i1', category_id: 'appetizer', nama: 'Salad' },
  { id: 'i2', category_id: 'appetizer', nama: 'Spring Roll' },
  { id: 'i3', category_id: 'soup', nama: 'Soto' },
  { id: 'i4', category_id: 'rice', nama: 'Nasi Putih' },
  { id: 'i5', category_id: 'beef', nama: 'Rendang' },
  { id: 'i6', category_id: 'bev', nama: 'Teh' },
]
const packages = [
  { id: 'p1', nama_paket: 'Indonesian Buffet', kategori: 'Buffet', harga_per_pax: 189000, harga_minimum: null, has_selection: true },
]
const components = [
  { package_id: 'p1', component_type: 'buf', nama: 'Indonesian Buffet', qty: 1, sort_order: 0 },
]

describe('shapeMenuCatalog', () => {
  const catalog = shapeMenuCatalog({ packages, components, categories, items })
  const buf = catalog.categoriesByComponentType['buf']

  it('hanya leaf yang muncul — header (Starters, Main Course) dibuang', () => {
    expect(buf.map((c) => c.nama)).toEqual([
      'Appetizer', 'Soup', 'Rice', 'Beef', 'Beverages',
    ])
  })

  it('leaf di bawah header dapat groupName; standalone null', () => {
    const byName = Object.fromEntries(buf.map((c) => [c.nama, c.groupName]))
    expect(byName).toEqual({
      Appetizer: 'Starters',
      Soup: 'Starters',
      Rice: null,
      Beef: 'Main Course',
      Beverages: null,
    })
  })

  it('urutan interleaved sesuai sort_order root (grup tetap berurutan)', () => {
    // Starters(0) → Appetizer, Soup ; Rice(1) ; Main Course(2) → Beef ; Beverages(3)
    expect(buf.map((c) => c.nama)).toEqual(['Appetizer', 'Soup', 'Rice', 'Beef', 'Beverages'])
  })

  it('rule one/multiple dipetakan benar', () => {
    const ruleOf = Object.fromEntries(buf.map((c) => [c.nama, c.rule]))
    expect(ruleOf.Appetizer).toBe('one')
    expect(ruleOf.Soup).toBe('one')
    expect(ruleOf.Rice).toBe('multiple')
    expect(ruleOf.Beef).toBe('multiple')
  })

  it('item menempel ke leaf yang benar', () => {
    const appetizer = buf.find((c) => c.nama === 'Appetizer')!
    expect(appetizer.items.map((i) => i.nama)).toEqual(['Salad', 'Spring Roll'])
    expect(buf.find((c) => c.nama === 'Soup')!.items).toHaveLength(1)
  })

  it('package dibentuk dengan komponennya', () => {
    expect(catalog.packages).toHaveLength(1)
    const p = catalog.packages[0]
    expect(p.namaPaket).toBe('Indonesian Buffet')
    expect(p.hargaPerPax).toBe(189000)
    expect(p.hasSelection).toBe(true)
    expect(p.components.map((c) => c.componentType)).toEqual(['buf'])
  })
})
