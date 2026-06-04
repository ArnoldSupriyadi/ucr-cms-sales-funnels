import { describe, it, expect } from 'vitest'
import { groupSelectionLines } from './menu-detail-lines'

describe('groupSelectionLines', () => {
  it('kosong → array kosong', () => {
    expect(groupSelectionLines([])).toEqual([])
  })

  it('occasion tunggal: label tanpa nomor sesi', () => {
    const lines = groupSelectionLines([
      { componentName: 'Lunch', occasionNo: 1, categoryName: 'Main', itemName: 'Ayam' },
      { componentName: 'Lunch', occasionNo: 1, categoryName: 'Main', itemName: 'Nasi' },
    ])
    expect(lines).toEqual([{ group: 'Lunch', items: ['Ayam', 'Nasi'] }])
  })

  it('multi-occasion komponen sama: beri nomor sesi', () => {
    const lines = groupSelectionLines([
      { componentName: 'Coffee Break', occasionNo: 1, categoryName: 'Snack', itemName: 'Risoles' },
      { componentName: 'Coffee Break', occasionNo: 2, categoryName: 'Snack', itemName: 'Pastel' },
    ])
    expect(lines).toEqual([
      { group: 'Coffee Break 1', items: ['Risoles'] },
      { group: 'Coffee Break 2', items: ['Pastel'] },
    ])
  })

  it('beberapa komponen berbeda, urutan kemunculan dijaga', () => {
    const lines = groupSelectionLines([
      { componentName: 'Coffee Break', occasionNo: 1, categoryName: 'Snack', itemName: 'Risoles' },
      { componentName: 'Lunch', occasionNo: 1, categoryName: 'Main', itemName: 'Ayam' },
    ])
    expect(lines).toEqual([
      { group: 'Coffee Break', items: ['Risoles'] },
      { group: 'Lunch', items: ['Ayam'] },
    ])
  })
})
