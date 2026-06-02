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
                      title="Edit kontak"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-gray-400 hover:text-red-600"
                      onClick={() => setDeleteId(contact.id)}
                      title="Hapus kontak"
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
