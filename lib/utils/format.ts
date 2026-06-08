export const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n)

export const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))

/** Rentang tanggal: "01 Jul 2026 – 03 Jul 2026"; bila end kosong/sama → satu tanggal. */
export const formatDateRange = (start: string, end?: string | null) =>
  !end || end === start ? formatDate(start) : `${formatDate(start)} – ${formatDate(end)}`

export const formatDateLong = (dateStr: string) =>
  new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))

export const formatDateTime = (dateStr: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
