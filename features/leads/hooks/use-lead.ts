'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { LeadWithContacts } from '@/types/domain'

export function useLead(id: string) {
  const [lead, setLead] = useState<LeadWithContacts | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetch() {
      setLoading(true)
      const { data, error } = await supabase
        .from('leads')
        .select('*, lead_contacts(*), users(id, name)')
        .eq('id', id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setLead(data as LeadWithContacts)
      }
      setLoading(false)
    }

    fetch()
  }, [id])

  return { lead, loading, error }
}
