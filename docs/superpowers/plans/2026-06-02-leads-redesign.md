# Leads Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite halaman leads menjadi single-page experience dengan modal (tambah/edit), side panel (detail + kelola kontak), search by perusahaan/kontak, filter segmen, dan pagination — mengikuti gaya TailAdmin Data Table 2.

**Architecture:** `leads/page.tsx` tetap Server Component untuk fetch data + permissions, hasilnya diteruskan ke `LeadsClient` (Client Component) yang menjadi orchestrator state untuk modal dan side panel. Setiap sub-komponen menerima callbacks dan tidak navigasi ke halaman lain.

**Tech Stack:** Next.js 16 App Router, Supabase SSR, shadcn/ui (Dialog, Select, AlertDialog, Badge), Sonner toast, Tailwind CSS, Lucide icons.

---

## File Map

| Action | File |
|--------|------|
| **DELETE** | `app/(dashboard)/leads/new/page.tsx` |
| **DELETE** | `app/(dashboard)/leads/[id]/page.tsx` |
| **DELETE** | `app/(dashboard)/leads/[id]/edit/page.tsx` |
| **DELETE** | `features/leads/components/lead-form.tsx` |
| **DELETE** | `features/leads/components/contact-card.tsx` |
| **MODIFY** | `app/(dashboard)/leads/page.tsx` |
| **MODIFY** | `features/leads/hooks/use-lead.ts` |
| **REWRITE** | `features/leads/components/lead-table.tsx` |
| **CREATE** | `features/leads/components/leads-client.tsx` |
| **CREATE** | `features/leads/components/lead-modal.tsx` |
| **CREATE** | `features/leads/components/lead-contact-manager.tsx` |
| **CREATE** | `features/leads/components/lead-side-panel.tsx` |
| **UNCHANGED** | `features/leads/actions.ts` |
| **UNCHANGED** | `features/leads/hooks/use-leads.ts` |

---

## Task 1: Hapus file lama

**Files:**
- Delete: `app/(dashboard)/leads/new/page.tsx`
- Delete: `app/(dashboard)/leads/[id]/page.tsx`
- Delete: `app/(dashboard)/leads/[id]/edit/page.tsx`
- Delete: `features/leads/components/lead-form.tsx`
- Delete: `features/leads/components/contact-card.tsx`

- [ ] **Step 1: Hapus semua file lama**

```bash
rm "app/(dashboard)/leads/new/page.tsx"
rm "app/(dashboard)/leads/[id]/page.tsx"
rm "app/(dashboard)/leads/[id]/edit/page.tsx"
rm features/leads/components/lead-form.tsx
rm features/leads/components/contact-card.tsx
```

- [ ] **Step 2: Hapus folder kosong**

```bash
rmdir "app/(dashboard)/leads/new"
rmdir "app/(dashboard)/leads/[id]"
```

- [ ] **Step 3: Verifikasi**

```bash
ls "app/(dashboard)/leads/"
```

Expected output: hanya `page.tsx` (folder `new/` dan `[id]/` sudah tidak ada).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: hapus halaman leads lama (new, detail, edit)"
```

---

## Task 2: Update `use-lead.ts` — tambah fungsi refetch

Side panel perlu refresh data kontak setelah mutasi tanpa full page reload.

**Files:**
- Modify: `features/leads/hooks/use-lead.ts`

- [ ] **Step 1: Tulis ulang `use-lead.ts`**

```typescript
// features/leads/hooks/use-lead.ts
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
```

- [ ] **Step 2: Commit**

```bash
git add features/leads/hooks/use-lead.ts
git commit -m "feat: tambah refetch ke useLead hook"
```

---

## Task 3: Buat `leads-client.tsx` — orchestrator state

Komponen ini memegang semua state (modal mode, editing lead, selected lead untuk side panel) dan meneruskan callbacks ke child components.

**Files:**
- Create: `features/leads/components/leads-client.tsx`

- [ ] **Step 1: Buat `leads-client.tsx`**

```typescript
// features/leads/components/leads-client.tsx
'use client'

import { useState } from 'react'
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
```

- [ ] **Step 2: Commit**

```bash
git add features/leads/components/leads-client.tsx
git commit -m "feat: buat LeadsClient orchestrator"
```

---

## Task 4: Update `leads/page.tsx`

Server Component yang fetch data + permissions, lalu render `LeadsClient`.

**Files:**
- Modify: `app/(dashboard)/leads/page.tsx`

- [ ] **Step 1: Tulis ulang `leads/page.tsx`**

```typescript
// app/(dashboard)/leads/page.tsx
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { LeadsClient } from '@/features/leads/components/leads-client'
import type { LeadWithContacts } from '@/types/domain'

export default async function LeadsPage() {
  const [supabase, user] = await Promise.all([createClient(), getAppUser()])
  if (!user) return null

  const { data } = await supabase
    .from('leads')
    .select('*, lead_contacts(*), users(id, name)')
    .order('created_at', { ascending: false })

  const leads = (data ?? []) as LeadWithContacts[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          {leads.length.toLocaleString('id-ID')} perusahaan / klien terdaftar
        </p>
      </div>
      <LeadsClient
        leads={leads}
        canCreate={user.permissions['leads.create'] === true}
        canEdit={user.permissions['leads.edit'] === true}
        canDelete={user.permissions['leads.delete'] === true}
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/(dashboard)/leads/page.tsx"
git commit -m "feat: update leads page — render LeadsClient"
```

---

## Task 5: Rewrite `lead-table.tsx`

Tabel baru mengikuti gaya TailAdmin Data Table 2. Search by nama perusahaan + kontak, filter by segmen, pagination 10 per halaman. Row click → buka side panel. Actions: icon edit + icon hapus langsung (tidak pakai dropdown).

**Files:**
- Rewrite: `features/leads/components/lead-table.tsx`

- [ ] **Step 1: Tulis ulang `lead-table.tsx`**

```typescript
// features/leads/components/lead-table.tsx
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
  canDelete: boolean
  selectedLeadId: string | null
  onSelectLead: (id: string) => void
  onCreateLead: () => void
  onEditLead: (lead: Lead) => void
}

export function LeadTable({
  leads,
  canCreate,
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
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-gray-400 hover:text-blue-600"
                          onClick={() => onEditLead(lead)}
                          title="Edit lead"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
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
              {currentPage + 1} / {totalPages}
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
```

- [ ] **Step 2: Commit**

```bash
git add features/leads/components/lead-table.tsx
git commit -m "feat: rewrite LeadTable — search, filter segmen, pagination, callbacks"
```

---

## Task 6: Buat `lead-modal.tsx`

Modal untuk tambah dan edit lead. Satu komponen, dua mode. Mengikuti gaya default modal TailAdmin.

**Files:**
- Create: `features/leads/components/lead-modal.tsx`

- [ ] **Step 1: Buat `lead-modal.tsx`**

```typescript
// features/leads/components/lead-modal.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SEGMEN_OPTIONS } from '@/lib/constants/segmen'
import { createLead, updateLead } from '../actions'
import type { Lead } from '@/types/domain'

interface LeadModalProps {
  mode: 'create' | 'edit'
  lead?: Lead
  onClose: () => void
  onSuccess: () => void
}

export function LeadModal({ mode, lead, onClose, onSuccess }: LeadModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [companyName, setCompanyName] = useState(lead?.company_name ?? '')
  const [segmen, setSegmen] = useState(lead?.segmen ?? '')
  const [lineBusiness, setLineBusiness] = useState(lead?.line_business ?? '')
  const [address, setAddress] = useState(lead?.address ?? '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!companyName.trim()) return
    setLoading(true)

    const payload = {
      company_name: companyName.trim(),
      segmen: (segmen || null) as Lead['segmen'],
      line_business: lineBusiness.trim() || null,
      address: address.trim() || null,
    }

    const result =
      mode === 'edit' && lead
        ? await updateLead(lead.id, payload)
        : await createLead(payload)

    if (!result.success) {
      toast.error('Gagal menyimpan', { description: result.error })
      setLoading(false)
      return
    }

    toast.success(mode === 'edit' ? 'Lead berhasil diperbarui' : 'Lead berhasil ditambahkan')
    router.refresh()
    onSuccess()
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Lead' : 'Tambah Lead Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Nama Perusahaan */}
          <div className="space-y-1.5">
            <Label htmlFor="company_name">
              Nama Perusahaan / Klien <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company_name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="PT Contoh Indonesia"
              required
              disabled={loading}
            />
          </div>

          {/* Segmen */}
          <div className="space-y-1.5">
            <Label>Segmen</Label>
            <Select value={segmen} onValueChange={setSegmen} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih segmen" />
              </SelectTrigger>
              <SelectContent>
                {SEGMEN_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Industri */}
          <div className="space-y-1.5">
            <Label htmlFor="line_business">Industri / Line of Business</Label>
            <Input
              id="line_business"
              value={lineBusiness}
              onChange={(e) => setLineBusiness(e.target.value)}
              placeholder="Banking, Oil & Gas, FMCG, dll"
              disabled={loading}
            />
          </div>

          {/* Alamat */}
          <div className="space-y-1.5">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Alamat kantor atau lokasi"
              rows={3}
              disabled={loading}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading || !companyName.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add features/leads/components/lead-modal.tsx
git commit -m "feat: buat LeadModal untuk tambah dan edit lead"
```

---

## Task 7: Buat `lead-contact-manager.tsx`

Komponen manage kontak tanpa Card wrapper — dipakai di dalam side panel. Logic sama dengan `contact-card.tsx` lama tapi lebih ringkas.

**Files:**
- Create: `features/leads/components/lead-contact-manager.tsx`

- [ ] **Step 1: Buat `lead-contact-manager.tsx`**

```typescript
// features/leads/components/lead-contact-manager.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Phone, Mail, Star, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { createLeadContact, updateLeadContact, deleteLeadContact } from '../actions'
import type { LeadContact } from '@/types/domain'

const emptyForm = { name: '', position: '', phone: '', email: '', is_primary: false, notes: '' }

interface LeadContactManagerProps {
  leadId: string
  contacts: LeadContact[]
  canEdit: boolean
  onUpdate: () => void
}

export function LeadContactManager({ leadId, contacts, canEdit, onUpdate }: LeadContactManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<LeadContact | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(contact: LeadContact) {
    setEditing(contact)
    setForm({
      name: contact.name,
      position: contact.position ?? '',
      phone: contact.phone ?? '',
      email: contact.email ?? '',
      is_primary: contact.is_primary,
      notes: contact.notes ?? '',
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setLoading(true)

    const payload = {
      lead_id: leadId,
      name: form.name.trim(),
      position: form.position.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      is_primary: form.is_primary,
      notes: form.notes.trim() || null,
    }

    const result = editing
      ? await updateLeadContact(editing.id, leadId, payload)
      : await createLeadContact(payload)

    if (!result.success) {
      toast.error('Gagal menyimpan', { description: result.error })
    } else {
      toast.success(editing ? 'Kontak diperbarui' : 'Kontak ditambahkan')
      setDialogOpen(false)
      onUpdate()
    }
    setLoading(false)
  }

  async function handleDelete() {
    if (!deleteId) return
    setLoading(true)
    const result = await deleteLeadContact(deleteId, leadId)
    if (!result.success) {
      toast.error('Gagal menghapus', { description: result.error })
    } else {
      toast.success('Kontak dihapus')
      onUpdate()
    }
    setLoading(false)
    setDeleteId(null)
  }

  const sorted = [...contacts].sort((a, b) => Number(b.is_primary) - Number(a.is_primary))

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          Kontak ({contacts.length})
        </h3>
        {canEdit && (
          <Button size="sm" variant="outline" onClick={openCreate} className="h-7 gap-1 text-xs">
            <Plus className="h-3 w-3" />
            Tambah Kontak
          </Button>
        )}
      </div>

      {sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">Belum ada kontak</p>
      ) : (
        <div className="space-y-2">
          {sorted.map((contact) => (
            <div key={contact.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-gray-800">{contact.name}</span>
                    {contact.is_primary && (
                      <Badge variant="outline" className="gap-1 py-0 text-[10px] text-yellow-600 border-yellow-200 bg-yellow-50">
                        <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                        PIC Utama
                      </Badge>
                    )}
                  </div>
                  {contact.position && (
                    <p className="text-xs text-gray-500">{contact.position}</p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-1">
                    {contact.phone && (
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </span>
                    )}
                    {contact.email && (
                      <span className="flex items-center gap-1 text-xs text-gray-600 truncate max-w-[180px]">
                        <Mail className="h-3 w-3 shrink-0" />
                        {contact.email}
                      </span>
                    )}
                  </div>
                  {contact.notes && (
                    <p className="text-xs italic text-gray-400">{contact.notes}</p>
                  )}
                </div>
                {canEdit && (
                  <div className="flex gap-1 ml-2 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-gray-400 hover:text-blue-600"
                      onClick={() => openEdit(contact)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-gray-400 hover:text-red-600"
                      onClick={() => setDeleteId(contact.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog tambah/edit kontak */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) setDialogOpen(false) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Kontak' : 'Tambah Kontak'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Nama <span className="text-red-500">*</span></Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama kontak"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Jabatan</Label>
                <Input
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="Manager HRD"
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Telepon</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="08xx"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@perusahaan.com"
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Catatan</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                placeholder="Catatan tentang kontak ini"
                disabled={loading}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_primary}
                onChange={(e) => setForm({ ...form, is_primary: e.target.checked })}
                disabled={loading}
                className="rounded border-gray-300"
              />
              Jadikan PIC Utama
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={loading || !form.name.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog hapus kontak */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kontak?</AlertDialogTitle>
            <AlertDialogDescription>Kontak ini akan dihapus permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add features/leads/components/lead-contact-manager.tsx
git commit -m "feat: buat LeadContactManager untuk manajemen kontak di side panel"
```

---

## Task 8: Buat `lead-side-panel.tsx`

Side panel detail lead yang muncul dari kanan. Menggunakan `useLead` hook untuk fetch data mandiri.

**Files:**
- Create: `features/leads/components/lead-side-panel.tsx`

- [ ] **Step 1: Buat `lead-side-panel.tsx`**

```typescript
// features/leads/components/lead-side-panel.tsx
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
                    <h2 className="text-lg font-bold text-gray-900 leading-snug">
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
              <div className="p-6 space-y-6">
                {/* Info Lead */}
                <section className="space-y-3">
                  {lead.segmen && (
                    <div className="flex items-center gap-2">
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
```

- [ ] **Step 2: Commit**

```bash
git add features/leads/components/lead-side-panel.tsx
git commit -m "feat: buat LeadSidePanel — detail lead + kelola kontak"
```

---

## Task 9: Verifikasi dan final commit

- [ ] **Step 1: Pastikan tidak ada import ke file yang sudah dihapus**

```bash
grep -r "lead-form\|contact-card\|leads/new\|leads/\[id\]" features/ app/ --include="*.tsx" --include="*.ts"
```

Expected: tidak ada output (0 matches).

- [ ] **Step 2: Pastikan semua file baru bisa di-compile**

```bash
npx tsc --noEmit
```

Expected: tidak ada error. Jika ada error import, cek apakah `SEGMEN_OPTIONS` diekspor dari `@/lib/constants/segmen`.

- [ ] **Step 3: Cek `SEGMEN_OPTIONS` tersedia**

```bash
grep -n "SEGMEN_OPTIONS\|SEGMEN_COLORS" lib/constants/segmen.ts
```

Expected: kedua konstanta ada dan diekspor.

- [ ] **Step 4: Test manual di browser**

Buka `http://localhost:3000/leads` dan verifikasi:
- [ ] Tabel tampil dengan header search + filter + tombol Tambah Lead
- [ ] Search by nama perusahaan berfungsi
- [ ] Search by nama kontak berfungsi  
- [ ] Filter by segmen berfungsi
- [ ] Pagination muncul jika data > 10 baris
- [ ] Klik baris → side panel muncul dari kanan dengan data lead
- [ ] Side panel: info lead, daftar kontak, tombol Tambah Kontak
- [ ] Side panel: tambah/edit/hapus kontak berfungsi
- [ ] Tombol Edit di side panel → side panel tutup, modal edit terbuka
- [ ] Tombol Tambah Lead → modal baru terbuka
- [ ] Modal tambah/edit: form submit berhasil, tabel refresh
- [ ] Icon hapus di baris → AlertDialog konfirmasi → hapus berhasil
- [ ] Tidak ada link ke `/leads/new`, `/leads/[id]`, atau `/leads/[id]/edit`

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: selesai leads page redesign — modal, side panel, search, filter, pagination"
```
