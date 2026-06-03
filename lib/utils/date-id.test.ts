import { describe, it, expect } from 'vitest'
import { hariID, tanggalID } from './date-id'

describe('hariID', () => {
  it('mengembalikan nama hari Indonesia', () => {
    expect(hariID('2026-04-29')).toBe('Rabu')
    expect(hariID('2026-01-01')).toBe('Kamis')
  })
  it('mengembalikan — untuk input kosong/invalid', () => {
    expect(hariID('')).toBe('—')
    expect(hariID('bukan-tanggal')).toBe('—')
  })
})

describe('tanggalID', () => {
  it('memformat tanggal Indonesia', () => {
    expect(tanggalID('2026-04-29')).toBe('29 April 2026')
  })
  it('mengembalikan — untuk invalid', () => {
    expect(tanggalID('')).toBe('—')
  })
})
