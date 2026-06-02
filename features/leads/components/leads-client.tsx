'use client'

import { useState, useMemo } from 'react'
import { LeadTable } from './lead-table'
import { LeadModal } from './lead-modal'
import { LeadSidePanel } from './lead-side-panel'
import type { Lead, LeadWithContacts } from '@/types/domain'

interface LeadsClientProps {
  leads: LeadWithContacts[]
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
}

export function LeadsClient({ leads, canCreate, canEdit, canDelete }: LeadsClientProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)

  const lineBusinessSuggestions = useMemo(() =>
    [...new Set(leads.map((l) => l.line_business).filter(Boolean) as string[])].sort(),
    [leads]
  )

  function openCreateModal() {
    setEditingLead(null)
    setModalMode('create')
  }

  function openEditModal(lead: Lead) {
    setSelectedLeadId(null)
    setEditingLead(lead)
    setModalMode('edit')
  }

  function closeModal() {
    setModalMode(null)
    setEditingLead(null)
  }

  return (
    <div>
      <LeadTable
        leads={leads}
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
        selectedLeadId={selectedLeadId}
        onSelectLead={setSelectedLeadId}
        onCreateLead={openCreateModal}
        onEditLead={openEditModal}
      />

      {modalMode && (
        <LeadModal
          mode={modalMode}
          lead={editingLead ?? undefined}
          lineBusinessSuggestions={lineBusinessSuggestions}
          onClose={closeModal}
          onSuccess={closeModal}
        />
      )}

      <LeadSidePanel
        leadId={selectedLeadId}
        canEdit={canEdit}
        onClose={() => setSelectedLeadId(null)}
        onEdit={openEditModal}
      />
    </div>
  )
}
