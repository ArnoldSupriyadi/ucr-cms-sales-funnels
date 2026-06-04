import type { SelectionForDetail } from './menu-detail'

export interface MenuDetailLine {
  group: string
  items: string[]
}

/**
 * Versi list dari generateMenuDetail: kelompokkan per componentName+occasionNo,
 * beri nomor sesi bila satu komponen punya >1 occasion. Urutan kemunculan dijaga.
 * Dipakai untuk rendering heading + bulleted list (tanpa harga) di form.
 */
export function groupSelectionLines(selections: SelectionForDetail[]): MenuDetailLine[] {
  const groups = new Map<string, { component: string; occasion: number; items: string[] }>()
  for (const s of selections) {
    const key = `${s.componentName}||${s.occasionNo}`
    if (!groups.has(key)) {
      groups.set(key, { component: s.componentName, occasion: s.occasionNo, items: [] })
    }
    groups.get(key)!.items.push(s.itemName)
  }

  const occasionCount = new Map<string, number>()
  for (const g of groups.values()) {
    occasionCount.set(g.component, (occasionCount.get(g.component) ?? 0) + 1)
  }

  const lines: MenuDetailLine[] = []
  for (const g of groups.values()) {
    const group = (occasionCount.get(g.component) ?? 1) > 1 ? `${g.component} ${g.occasion}` : g.component
    lines.push({ group, items: g.items })
  }
  return lines
}
