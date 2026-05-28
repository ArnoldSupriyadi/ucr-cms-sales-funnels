import type { BookingStatus, LoaStatus, PaymentStatus } from '@/types/domain'

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  Tentative: 'Tentative',
  Definite: 'Definite',
  Actual: 'Actual',
  Cancel: 'Cancel',
}

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  Tentative: 'bg-yellow-100 text-yellow-800',
  Definite: 'bg-blue-100 text-blue-800',
  Actual: 'bg-green-100 text-green-800',
  Cancel: 'bg-red-100 text-red-800',
}

// Valid status transitions
export const BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  Tentative: ['Definite', 'Cancel'],
  Definite: ['Actual', 'Cancel'],
  Actual: [],
  Cancel: [],
}

export const LOA_STATUS_LABELS: Record<LoaStatus, string> = {
  draft: 'Draft',
  pending_approval: 'Menunggu Approval',
  approved: 'Disetujui',
  sent: 'Terkirim',
  final: 'Final',
  revised: 'Direvisi',
}

export const LOA_STATUS_COLORS: Record<LoaStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending_approval: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  sent: 'bg-blue-100 text-blue-800',
  final: 'bg-emerald-100 text-emerald-800',
  revised: 'bg-orange-100 text-orange-800',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: 'Belum Bayar',
  partial: 'Sebagian',
  paid: 'Lunas',
}

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  unpaid: 'bg-red-100 text-red-800',
  partial: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
}
