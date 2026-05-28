'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { BookingWithLead } from '@/types/domain'

export function useBookings() {
  const [bookings, setBookings] = useState<BookingWithLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetch() {
      setLoading(true)
      const { data, error } = await supabase
        .from('bookings')
        .select('*, leads(id, company_name, segmen), users(id, name)')
        .order('event_date', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        setBookings((data ?? []) as BookingWithLead[])
      }
      setLoading(false)
    }

    fetch()
  }, [])

  return { bookings, loading, error }
}
