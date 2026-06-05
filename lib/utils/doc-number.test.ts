import { describe, it, expect } from 'vitest'
import { formatDocNo, nextSeqFromLast } from './doc-number'

describe('formatDocNo (running per tahun)', () => {
  it('pad seq ke 4 digit', () => {
    expect(formatDocNo('UCR', 2026, 1)).toBe('UCR-2026-0001')
    expect(formatDocNo('LOA', 2026, 42)).toBe('LOA-2026-0042')
  })
  it('seq > 9999 tidak terpotong', () => {
    expect(formatDocNo('UCR', 2026, 12345)).toBe('UCR-2026-12345')
  })
})

describe('nextSeqFromLast', () => {
  it('null/undefined → 1 (belum ada nomor tahun ini)', () => {
    expect(nextSeqFromLast(null)).toBe(1)
    expect(nextSeqFromLast(undefined)).toBe(1)
  })
  it('ambil seq terakhir + 1', () => {
    expect(nextSeqFromLast('UCR-2026-0007')).toBe(8)
    expect(nextSeqFromLast('LOA-2026-0099')).toBe(100)
  })
  it('format tak dikenal → 1', () => {
    expect(nextSeqFromLast('garbage')).toBe(1)
  })
})
