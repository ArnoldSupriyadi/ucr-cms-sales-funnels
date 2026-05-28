'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus, Search, Building2 } from 'lucide-react'
import { SEGMEN_COLORS } from '@/lib/constants/segmen'
import { formatDate } from '@/lib/utils/format'
import { deleteLead } from '../actions'
import type { LeadWithContacts } from '@/types/domain'

interface LeadTableProps {
  leads: LeadWithContacts[]
  canCreate: boolean
  canDelete: boolean
}

export function LeadTable({ leads, canCreate, canDelete }: LeadTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = leads.filter((l) =>
    l.company_name.toLowerCase().includes(search.toLowerCase()) ||
    (l.line_business ?? '').toLowerCase().includes(search.toLowerCase())
  )

  async function handleDelete() {
    if (!deleteId) return
    const result = await deleteLead(deleteId)
    if (!result.success) {
      toast.error('Gagal menghapus', { description: result.error })
    } else {
      toast.success('Lead dihapus')
      router.refresh()
    }
    setDeleteId(null)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari perusahaan atau industri..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-slate-200 bg-white"
          />
        </div>
        {canCreate && (
          <Link href="/leads/new">
            <Button className="gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20">
              <Plus className="h-4 w-4" />
              Tambah Lead
            </Button>
          </Link>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="font-semibold text-slate-600 text-xs uppercase tracking-wide pl-5">
                Perusahaan
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-xs uppercase tracking-wide">
                Segmen
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-xs uppercase tracking-wide">
                Industri
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-xs uppercase tracking-wide">
                PIC Utama
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-xs uppercase tracking-wide">
                Ditambahkan
              </TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Building2 className="h-8 w-8 opacity-40" />
                    <p className="text-sm font-medium">
                      {search ? 'Tidak ada hasil pencarian' : 'Belum ada lead'}
                    </p>
                    {!search && canCreate && (
                      <Link href="/leads/new">
                        <Button size="sm" variant="outline" className="mt-2 rounded-lg">
                          Tambah Lead Pertama
                        </Button>
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((lead) => {
                const primaryContact = lead.lead_contacts?.find((c) => c.is_primary)
                return (
                  <TableRow
                    key={lead.id}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <TableCell className="pl-5">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
                      >
                        {lead.company_name}
                      </Link>
                      {lead.address && (
                        <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                          {lead.address}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.segmen ? (
                        <Badge
                          variant="outline"
                          className={`text-xs font-semibold ${SEGMEN_COLORS[lead.segmen]}`}
                        >
                          {lead.segmen}
                        </Badge>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {lead.line_business ?? <span className="text-slate-300">—</span>}
                    </TableCell>
                    <TableCell>
                      {primaryContact ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {primaryContact.name}
                          </p>
                          {primaryContact.position && (
                            <p className="text-xs text-slate-400">{primaryContact.position}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {lead.lead_contacts?.length ?? 0} kontak
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                      {formatDate(lead.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-44">
                          <DropdownMenuItem asChild>
                            <Link href={`/leads/${lead.id}`}>Lihat Detail</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/leads/${lead.id}/edit`}>Edit Lead</Link>
                          </DropdownMenuItem>
                          {canDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={() => setDeleteId(lead.id)}
                              >
                                Hapus Lead
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* Table footer */}
        {filtered.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-2.5 bg-slate-50/50">
            <p className="text-xs text-slate-400">
              Menampilkan {filtered.length} dari {leads.length} leads
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lead?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua data kontak terkait juga akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
