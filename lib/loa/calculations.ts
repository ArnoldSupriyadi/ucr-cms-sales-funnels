export const PB1_PCT = 10

export interface LoaCalcItem {
  pricePerPax: number
  pax: number
}

export interface LoaPricingInput {
  scPct: number
  handlingPct: number
  discountType: 'percent' | 'flat'
  discountValue: number
}

export interface LoaCalcResult {
  subTotal1: number
  serviceChargeAmt: number
  subTotal2: number
  pb1Amt: number
  handlingFeeAmt: number
  discountAmt: number
  grandTotal: number
  netRevenue: number
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function calculateLoa(
  items: LoaCalcItem[],
  pricing: LoaPricingInput
): LoaCalcResult {
  const subTotal1 = round2(items.reduce((sum, i) => sum + i.pricePerPax * i.pax, 0))
  const serviceChargeAmt = round2((subTotal1 * pricing.scPct) / 100)
  const subTotal2 = round2(subTotal1 + serviceChargeAmt)
  const pb1Amt = round2((subTotal2 * PB1_PCT) / 100)
  const handlingFeeAmt = round2((subTotal2 * pricing.handlingPct) / 100)
  const grandPreDiscount = round2(subTotal2 + pb1Amt + handlingFeeAmt)

  const rawDiscount =
    pricing.discountType === 'percent'
      ? round2((grandPreDiscount * pricing.discountValue) / 100)
      : pricing.discountValue
  const discountAmt = round2(Math.min(Math.max(rawDiscount, 0), grandPreDiscount))

  return {
    subTotal1,
    serviceChargeAmt,
    subTotal2,
    pb1Amt,
    handlingFeeAmt,
    discountAmt,
    grandTotal: round2(grandPreDiscount - discountAmt),
    netRevenue: subTotal2,
  }
}
