'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { OrderWithLead } from '@/types/domain'

export function useOrders() {
  const [orders, setOrders] = useState<OrderWithLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetch() {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*, leads(id, company_name, segmen), users!orders_sales_id_fkey(id, name)')
        .order('event_date', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        setOrders((data ?? []) as OrderWithLead[])
      }
      setLoading(false)
    }

    fetch()
  }, [])

  return { orders, loading, error }
}
