'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Search, Plus, Pencil, Trash2, Building2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { SEGMEN_COLORS, SEGMEN_OPTIONS } from '@/lib/constants/segmen'
import { formatDate } from '@/lib/utils/format'
import { deleteLead } from '../actions'
import type { Lead, LeadWithContacts } from '@/types/domain'

const PAGE_SIZE = 10

interface LeadTableProps {
  leads: LeadWithContacts[]
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  selectedLeadId: string | null
  onSelectLead: (id: string) => void
  onCreateLead: () => void
  onEditLead: (lead: Lead) => void
}

export function LeadTable({
  leads,
  canCreate,
  canEdit,
  canDelete,
  selectedLeadId,
  onSelectLead,
  onCreateLead,
  onEditLead,
}: LeadTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [segmenFilter, setSegmenFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return leads.filter((lead) => {
      const matchSearch =
        !q ||
        lead.company_name.toLowerCase().includes(q) ||
        (lead.lead_contacts ?? []).some((c) => c.name.toLowerCase().includes(q))
      const matchSegmen =
        segmenFilter === 'all' || lead.segmen === segmenFilter
      return matchSearch && matchSegmen
    })
  }, [leads, search, segmenFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  function handleSearchChange(value: string) {
    setSearch(value)
    setCurrentPage(0)
  }

  function handleSegmenChange(value: string) {
    setSegmenFilter(value)
    setCurrentPage(0)
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const result = await deleteLead(deleteId)
    if (!result.success) {
      toast.error('Gagal menghapus', { description: result.error })
    } else {
      toast.success('Lead berhasil dihapus')
      router.refresh()
      setCurrentPage(0)
    }
    setDeleting(false)
    setDeleteId(null)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header controls */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari perusahaan atau kontak..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-9 pl-9 text-sm"
            />
          </div>
          <Select value={segmenFilter} onValueChange={handleSegmenChange}>
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue placeholder="Semua Segmen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Segmen</SelectItem>
              {SEGMEN_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {canCreate && (
          <Button onClick={onCreateLead} size="sm" className="gap-1.5 shrink-0">
            <Plus className="h-4 w-4" />
            Tambah Lead
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Perusahaan
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Segmen
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Industri
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                PIC Utama
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Ditambahkan
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Building2 className="h-8 w-8 opacity-30" />
                    <p className="text-sm font-medium">
                      {search || segmenFilter !== 'all'
                        ? 'Tidak ada hasil yang cocok'
                        : 'Belum ada lead'}
                    </p>
                    {!search && segmenFilter === 'all' && canCreate && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={onCreateLead}
                      >
                        Tambah Lead Pertama
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((lead) => {
                const primary = lead.lead_contacts?.find((c) => c.is_primary)
                const isSelected = lead.id === selectedLeadId
                return (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead.id)}
                    className={`cursor-pointer transition-colors hover:bg-blue-50/50 ${isSelected ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800">{lead.company_name}</p>
                      {lead.address && (
                        <p className="mt-0.5 max-w-[200px] truncate text-xs text-gray-400">
                          {lead.address}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {lead.segmen ? (
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium ${SEGMEN_COLORS[lead.segmen]}`}
                        >
                          {lead.segmen}
                        </Badge>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500">
                      {lead.line_business ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      {primary ? (
                        <div>
                          <p className="font-medium text-gray-700">{primary.name}</p>
                          {primary.phone && (
                            <p className="text-xs text-gray-400">{primary.phone}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {(lead.lead_contacts?.length ?? 0) > 0
                            ? `${lead.lead_contacts!.length} kontak`
                            : 'Belum ada kontak'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-gray-600">{formatDate(lead.created_at)}</p>
                      {lead.users?.name && (
                        <p className="text-xs text-gray-400">{lead.users.name}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {canEdit && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-gray-400 hover:text-blue-600"
                            onClick={() => onEditLead(lead)}
                            title="Edit lead"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-gray-400 hover:text-red-600"
                            onClick={() => setDeleteId(lead.id)}
                            title="Hapus lead"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
          <p className="text-xs text-gray-500">
            Menampilkan{' '}
            <span className="font-medium">
              {currentPage * PAGE_SIZE + 1}–
              {Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)}
            </span>{' '}
            dari <span className="font-medium">{filtered.length}</span> leads
          </p>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="min-w-[60px] text-center text-xs text-gray-600">
              {currentPage + 1} / {totalPages || 1}
            </span>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lead?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua kontak terkait juga akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
