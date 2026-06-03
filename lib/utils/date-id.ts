const HARI_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const BULAN_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

/** Parse 'YYYY-MM-DD' secara lokal (tanpa pergeseran timezone). null bila invalid. */
function parseISO(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return Number.isNaN(d.getTime()) ? null : d
}

export function hariID(iso: string): string {
  const d = parseISO(iso)
  return d ? HARI_ID[d.getDay()] : '—'
}

export function tanggalID(iso: string): string {
  const d = parseISO(iso)
  return d ? `${d.getDate()} ${BULAN_ID[d.getMonth()]} ${d.getFullYear()}` : '—'
}
