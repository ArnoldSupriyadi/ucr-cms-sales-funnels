'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { LeadWithContacts } from '@/types/domain'

export function useLeads() {
  const [leads, setLeads] = useState<LeadWithContacts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetch() {
      setLoading(true)
      const { data, error } = await supabase
        .from('leads')
        .select('*, lead_contacts(*), users(id, name)')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setLeads((data ?? []) as LeadWithContacts[])
      }
      setLoading(false)
    }

    fetch()
  }, [])

  return { leads, loading, error }
}
