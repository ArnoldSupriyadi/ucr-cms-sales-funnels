'use client'

import { X, Pencil, MapPin, Briefcase, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SEGMEN_COLORS } from '@/lib/constants/segmen'
import { formatDate } from '@/lib/utils/format'
import { useLead } from '../hooks/use-lead'
import { LeadContactManager } from './lead-contact-manager'
import type { Lead } from '@/types/domain'

interface LeadSidePanelProps {
  leadId: string | null
  canEdit: boolean
  onClose: () => void
  onEdit: (lead: Lead) => void
}

export function LeadSidePanel({ leadId, canEdit, onClose, onEdit }: LeadSidePanelProps) {
  const { lead, loading, refetch } = useLead(leadId)
  const isOpen = leadId !== null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-[480px] overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {isOpen && (
          <>
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {loading ? (
                    <div className="h-6 w-48 animate-pulse rounded bg-gray-100" />
                  ) : (
                    <h2 className="text-lg font-bold leading-snug text-gray-900">
                      {lead?.company_name ?? '—'}
                    </h2>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {canEdit && lead && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(lead)}
                      className="h-8 gap-1.5 text-xs"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3 p-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-gray-100" />
                ))}
              </div>
            ) : lead ? (
              <div className="space-y-6 p-6">
                {/* Info Lead */}
                <section className="space-y-3">
                  {lead.segmen && (
                    <div>
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${SEGMEN_COLORS[lead.segmen]}`}
                      >
                        {lead.segmen}
                      </Badge>
                    </div>
                  )}

                  {lead.line_business && (
                    <div className="flex items-start gap-2.5 text-sm text-gray-600">
                      <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <span>{lead.line_business}</span>
                    </div>
                  )}

                  {lead.address && (
                    <div className="flex items-start gap-2.5 text-sm text-gray-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <span>{lead.address}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                    <span>Ditambahkan {formatDate(lead.created_at)}</span>
                    {lead.users?.name && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-gray-400" />
                          {lead.users.name}
                        </span>
                      </>
                    )}
                  </div>
                </section>

                <hr className="border-gray-100" />

                {/* Kontak */}
                <section>
                  <LeadContactManager
                    leadId={lead.id}
                    contacts={lead.lead_contacts ?? []}
                    canEdit={canEdit}
                    onUpdate={refetch}
                  />
                </section>
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-gray-400">
                Data tidak ditemukan.
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
