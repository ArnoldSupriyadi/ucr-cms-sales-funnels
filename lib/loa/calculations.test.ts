import { describe, it, expect } from 'vitest'
import { calculateLoa, PB1_PCT } from './calculations'

const items = [{ pricePerPax: 150000, pax: 50 }] // sub_total_1 = 7.500.000

describe('calculateLoa', () => {
  it('hitung breakdown default (SC 5%, handling 15%, tanpa diskon)', () => {
    const r = calculateLoa(items, { scPct: 5, handlingPct: 15, discountType: 'flat', discountValue: 0 })
    expect(r.subTotal1).toBe(7500000)
    expect(r.serviceChargeAmt).toBe(375000)
    expect(r.subTotal2).toBe(7875000)
    expect(r.pb1Amt).toBe(787500)
    expect(r.handlingFeeAmt).toBe(1181250)
    expect(r.discountAmt).toBe(0)
    expect(r.grandTotal).toBe(9843750)
    expect(r.netRevenue).toBe(7875000)
  })

  it('PB1 konstan 10%', () => {
    expect(PB1_PCT).toBe(10)
  })

  it('diskon flat dipotong dari grand total, net revenue tetap penuh', () => {
    const r = calculateLoa(items, { scPct: 5, handlingPct: 15, discountType: 'flat', discountValue: 843750 })
    expect(r.discountAmt).toBe(843750)
    expect(r.grandTotal).toBe(9000000)
    expect(r.netRevenue).toBe(7875000) // tidak terpengaruh diskon
  })

  it('diskon percent = % dari grand total pre-discount', () => {
    const r = calculateLoa(items, { scPct: 5, handlingPct: 15, discountType: 'percent', discountValue: 10 })
    expect(r.discountAmt).toBe(984375) // 10% dari 9.843.750
    expect(r.grandTotal).toBe(8859375)
    expect(r.netRevenue).toBe(7875000)
  })

  it('diskon di-clamp tidak melebihi grand total pre-discount', () => {
    const r = calculateLoa(items, { scPct: 5, handlingPct: 15, discountType: 'flat', discountValue: 99999999 })
    expect(r.discountAmt).toBe(9843750)
    expect(r.grandTotal).toBe(0)
  })

  it('beberapa item dijumlahkan', () => {
    const r = calculateLoa(
      [{ pricePerPax: 100000, pax: 10 }, { pricePerPax: 50000, pax: 20 }],
      { scPct: 5, handlingPct: 15, discountType: 'flat', discountValue: 0 }
    )
    expect(r.subTotal1).toBe(2000000)
  })
})
