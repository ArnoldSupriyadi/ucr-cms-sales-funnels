export type OrderTypeKey = 'Package' | 'Event'

export const ORDER_TYPES: Record<OrderTypeKey, { label: string; scPct: number; categories: string[] }> = {
  Package: {
    label: 'Package Order',
    scPct: 5,
    categories: ['Box Package (Nasi/Snack/Bento/Longbox)', 'Gift Box (Tumpeng/Bakul/Hampers/Dropfood)'],
  },
  Event: {
    label: 'Event Order',
    scPct: 10,
    categories: ['Meeting / Open House', 'Buffet & Stall', 'Coffee Break / Takjil', 'Canape', 'Set Menu'],
  },
}

export const ORDER_TYPE_KEYS = Object.keys(ORDER_TYPES) as OrderTypeKey[]

export function serviceChargePctForType(type: string | null | undefined): number {
  if (type && type in ORDER_TYPES) return ORDER_TYPES[type as OrderTypeKey].scPct
  return 0
}

export function categoriesForType(type: string | null | undefined): string[] {
  if (type && type in ORDER_TYPES) return ORDER_TYPES[type as OrderTypeKey].categories
  return []
}
