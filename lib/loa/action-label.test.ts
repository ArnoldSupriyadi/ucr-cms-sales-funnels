import { describe, it, expect } from 'vitest'
import { loaActionLabel } from './action-label'

describe('loaActionLabel', () => {
  it('belum ada LOA (status kosong) → Buat LOA', () => {
    expect(loaActionLabel()).toBe('Buat LOA')
    expect(loaActionLabel(null)).toBe('Buat LOA')
    expect(loaActionLabel(undefined)).toBe('Buat LOA')
    expect(loaActionLabel('')).toBe('Buat LOA')
  })
  it('draft → Lanjut LOA', () => {
    expect(loaActionLabel('draft')).toBe('Lanjut LOA')
  })
  it('status final lain → Lihat LOA', () => {
    for (const s of ['pending_approval', 'approved', 'sent', 'final', 'revised']) {
      expect(loaActionLabel(s)).toBe('Lihat LOA')
    }
  })
})
