import { describe, it, expect } from 'vitest'
import { generateMenuDetail } from './menu-detail'

describe('generateMenuDetail', () => {
  it('kelompokkan per komponen+occasion, gabung item dengan koma', () => {
    const text = generateMenuDetail([
      { componentName: 'Coffee Break', occasionNo: 1, categoryName: 'Savoury', itemName: 'Risoles' },
      { componentName: 'Coffee Break', occasionNo: 1, categoryName: 'Minuman', itemName: 'Teh' },
      { componentName: 'Coffee Break', occasionNo: 2, categoryName: 'Savoury', itemName: 'Pastel' },
      { componentName: 'Lunch', occasionNo: 1, categoryName: 'Main', itemName: 'Ayam' },
    ])
    expect(text).toBe('Coffee Break 1: Risoles, Teh · Coffee Break 2: Pastel · Lunch: Ayam')
  })

  it('occasion tunggal tidak diberi nomor', () => {
    const text = generateMenuDetail([
      { componentName: 'Lunch', occasionNo: 1, categoryName: 'Main', itemName: 'Ayam' },
    ])
    expect(text).toBe('Lunch: Ayam')
  })

  it('kosong = string kosong', () => {
    expect(generateMenuDetail([])).toBe('')
  })
})
