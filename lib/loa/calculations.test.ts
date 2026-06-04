import { describe, it, expect } from 'vitest'
import { calculateLoa, PB1_PCT } from './calculations'

const items = [{ pricePerPax: 100000, pax: 100 }] // sub_total_1 = 10.000.000

describe('calculateLoa (urutan baru: diskon dari Sub Total 1)', () => {
  it('Event SC 10%, diskon flat 1jt, handling 5% persen', () => {
    const r = calculateLoa(items, {
      scPct: 10, handlingType: 'percent', handlingValue: 5,
      discountType: 'flat', discountValue: 1000000,
    })
    expect(r.subTotal1).toBe(10000000)
    expect(r.discountAmt).toBe(1000000)
    expect(r.serviceChargeAmt).toBe(900000)   // 10% × 9.000.000
    expect(r.subTotal2).toBe(9900000)
    expect(r.netRevenue).toBe(9900000)        // = sub_total_2 (setelah diskon)
    expect(r.pb1Amt).toBe(990000)
    expect(r.handlingFeeAmt).toBe(495000)     // 5% × 9.900.000
    expect(r.grandTotal).toBe(11385000)
  })

  it('diskon persen = % dari SUB TOTAL 1', () => {
    const r = calculateLoa(items, {
      scPct: 5, handlingType: 'percent', handlingValue: 15,
      discountType: 'percent', discountValue: 10,
    })
    expect(r.discountAmt).toBe(1000000)       // 10% × 10.000.000
  })

  it('handling flat dipakai langsung (bukan persen)', () => {
    const r = calculateLoa(items, {
      scPct: 5, handlingType: 'flat', handlingValue: 250000,
      discountType: 'flat', discountValue: 0,
    })
    expect(r.handlingFeeAmt).toBe(250000)
  })

  it('diskon di-clamp ke [0, subTotal1]', () => {
    const r = calculateLoa(items, {
      scPct: 5, handlingType: 'percent', handlingValue: 0,
      discountType: 'flat', discountValue: 99999999,
    })
    expect(r.discountAmt).toBe(10000000)
    expect(r.subTotal2).toBe(0)               // dpp 0 → SC 0 → ST2 0
  })

  it('beberapa item dijumlahkan', () => {
    const r = calculateLoa(
      [{ pricePerPax: 100000, pax: 10 }, { pricePerPax: 50000, pax: 20 }],
      { scPct: 5, handlingType: 'percent', handlingValue: 15, discountType: 'flat', discountValue: 0 }
    )
    expect(r.subTotal1).toBe(2000000)
  })

  it('PB1 konstan 10%', () => { expect(PB1_PCT).toBe(10) })
})
