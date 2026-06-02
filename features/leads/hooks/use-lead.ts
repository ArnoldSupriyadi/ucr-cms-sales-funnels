'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { LeadWithContacts } from '@/types/domain'

export function useLead(id: string | null) {
  const [lead, setLead] = useState<LeadWithContacts | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), [])

  useEffect(() => {
    if (!id) {
      setLead(null)
      return
    }

    const supabase = createClient()
    setLoading(true)

    supabase
      .from('leads')
      .select('*, lead_contacts(*), users(id, name)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setLead(data as LeadWithContacts)
        setLoading(false)
      })
  }, [id, refreshKey])

  return { lead, loading, error, refetch }
}
