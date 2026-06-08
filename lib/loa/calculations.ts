export const PB1_PCT = 10

export interface LoaPricingInput {
  scPct: number
  handlingType: 'percent' | 'flat'
  handlingValue: number
  discountType: 'percent' | 'flat'
  discountValue: number
}

export interface LoaCalcResult {
  subTotal1: number
  discountAmt: number
  dppAfterDiscount: number
  serviceChargeAmt: number
  subTotal2: number
  pb1Amt: number
  handlingFeeAmt: number
  grandTotal: number
  netRevenue: number
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/** `amounts` = total tiap Header (manual). subTotal1 = Σ amounts. */
export function calculateLoa(
  amounts: number[],
  pricing: LoaPricingInput
): LoaCalcResult {
  const subTotal1 = round2(amounts.reduce((sum, a) => sum + a, 0))

  const rawDiscount =
    pricing.discountType === 'percent'
      ? round2((subTotal1 * pricing.discountValue) / 100)
      : pricing.discountValue
  const discountAmt = round2(Math.min(Math.max(rawDiscount, 0), subTotal1))

  const dppAfterDiscount = round2(subTotal1 - discountAmt)
  const serviceChargeAmt = round2((dppAfterDiscount * pricing.scPct) / 100)
  const subTotal2 = round2(dppAfterDiscount + serviceChargeAmt)
  const pb1Amt = round2((subTotal2 * PB1_PCT) / 100)

  const handlingFeeAmt =
    pricing.handlingType === 'percent'
      ? round2((subTotal2 * pricing.handlingValue) / 100)
      : round2(Math.max(pricing.handlingValue, 0))

  return {
    subTotal1,
    discountAmt,
    dppAfterDiscount,
    serviceChargeAmt,
    subTotal2,
    pb1Amt,
    handlingFeeAmt,
    grandTotal: round2(subTotal2 + pb1Amt + handlingFeeAmt),
    netRevenue: subTotal2,
  }
}
