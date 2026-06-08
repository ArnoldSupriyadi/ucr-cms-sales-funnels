import { describe, it, expect } from 'vitest'
import { calculateLoa, PB1_PCT } from './calculations'

// amounts = total tiap Header (manual). subTotal1 = Σ amounts.
const amounts = [9_000_000, 1_070_000] // = 10.070.000

describe('calculateLoa (basis Σ amount Header)', () => {
  it('Event SC 10%, diskon flat 1jt, handling 5% persen', () => {
    const r = calculateLoa(amounts, {
      scPct: 10, handlingType: 'percent', handlingValue: 5,
      discountType: 'flat', discountValue: 1_000_000,
    })
    expect(r.subTotal1).toBe(10_070_000)
    expect(r.discountAmt).toBe(1_000_000)
    expect(r.serviceChargeAmt).toBe(907_000) // 10% × 9.070.000
    expect(r.subTotal2).toBe(9_977_000)
    expect(r.netRevenue).toBe(9_977_000)
    expect(r.pb1Amt).toBe(997_700)
    expect(r.handlingFeeAmt).toBe(498_850) // 5% × 9.977.000
    expect(r.grandTotal).toBe(11_473_550)
  })

  it('diskon persen = % dari Sub Total 1', () => {
    const r = calculateLoa([10_000_000], {
      scPct: 5, handlingType: 'percent', handlingValue: 15,
      discountType: 'percent', discountValue: 10,
    })
    expect(r.discountAmt).toBe(1_000_000)
  })

  it('handling flat dipakai langsung', () => {
    const r = calculateLoa([10_000_000], {
      scPct: 5, handlingType: 'flat', handlingValue: 250_000,
      discountType: 'flat', discountValue: 0,
    })
    expect(r.handlingFeeAmt).toBe(250_000)
  })

  it('diskon di-clamp ke [0, subTotal1]', () => {
    const r = calculateLoa([10_000_000], {
      scPct: 5, handlingType: 'percent', handlingValue: 0,
      discountType: 'flat', discountValue: 99_999_999,
    })
    expect(r.discountAmt).toBe(10_000_000)
    expect(r.subTotal2).toBe(0)
  })

  it('PB1 konstan 10%', () => {
    expect(PB1_PCT).toBe(10)
  })
})
