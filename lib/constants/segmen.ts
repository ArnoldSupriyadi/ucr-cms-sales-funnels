import type { SegmenEnum } from '@/types/domain'

export const SEGMEN_OPTIONS: { label: string; value: SegmenEnum }[] = [
  { label: 'Wedding', value: 'Wedding' },
  { label: 'Private', value: 'Private' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'BUMN', value: 'BUMN' },
  { label: 'Government', value: 'Government' },
]

export const SEGMEN_COLORS: Record<SegmenEnum, string> = {
  Wedding: 'bg-pink-100 text-pink-800',
  Private: 'bg-purple-100 text-purple-800',
  Corporate: 'bg-blue-100 text-blue-800',
  BUMN: 'bg-green-100 text-green-800',
  Government: 'bg-orange-100 text-orange-800',
}
