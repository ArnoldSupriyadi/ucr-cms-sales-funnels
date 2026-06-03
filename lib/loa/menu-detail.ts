export interface SelectionForDetail {
  componentName: string
  occasionNo: number
  categoryName: string
  itemName: string
}

export function generateMenuDetail(selections: SelectionForDetail[]): string {
  // Kelompokkan per "componentName||occasionNo", jaga urutan kemunculan.
  const groups = new Map<string, { component: string; occasion: number; items: string[] }>()
  for (const s of selections) {
    const key = `${s.componentName}||${s.occasionNo}`
    if (!groups.has(key)) {
      groups.set(key, { component: s.componentName, occasion: s.occasionNo, items: [] })
    }
    groups.get(key)!.items.push(s.itemName)
  }

  // Hitung jumlah occasion per komponen → tentukan apakah perlu nomor sesi.
  const occasionCount = new Map<string, number>()
  for (const g of groups.values()) {
    occasionCount.set(g.component, (occasionCount.get(g.component) ?? 0) + 1)
  }

  const parts: string[] = []
  for (const g of groups.values()) {
    const label = (occasionCount.get(g.component) ?? 1) > 1 ? `${g.component} ${g.occasion}` : g.component
    parts.push(`${label}: ${g.items.join(', ')}`)
  }
  return parts.join(' · ')
}
