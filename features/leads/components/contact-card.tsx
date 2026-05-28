'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Phone, Mail, Star, Plus, Pencil, Trash2 } from 'lucide-react'
import { createLeadContact, updateLeadContact, deleteLeadContact } from '../actions'
import type { LeadContact } from '@/types/domain'

interface ContactCardProps {
  leadId: string
  contacts: LeadContact[]
  canEdit: boolean
}

const emptyForm = {
  name: '',
  position: '',
  phone: '',
  email: '',
  is_primary: false,
  notes: '',
}

export function ContactCard({ leadId, contacts, canEdit }: ContactCardProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<LeadContact | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
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
    setOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setLoading(true)

    const payload = {
      lead_id: leadId,
      name: form.name,
      position: form.position || null,
      phone: form.phone || null,
      email: form.email || null,
      is_primary: form.is_primary,
      notes: form.notes || null,
    }

    const result = editing
      ? await updateLeadContact(editing.id, leadId, payload)
      : await createLeadContact(payload)

    if (!result.success) {
      toast.error('Gagal menyimpan', { description: result.error })
    } else {
      toast.success(editing ? 'Kontak diperbarui' : 'Kontak ditambahkan')
      setOpen(false)
      router.refresh()
    }
    setLoading(false)
  }

  async function handleDelete() {
    if (!deleteId) return
    const result = await deleteLeadContact(deleteId, leadId)
    if (!result.success) {
      toast.error('Gagal menghapus', { description: result.error })
    } else {
      toast.success('Kontak dihapus')
      router.refresh()
    }
    setDeleteId(null)
  }

  const sorted = [...contacts].sort(
    (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
  )

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">
            Kontak ({contacts.length})
          </CardTitle>
          {canEdit && (
            <Button size="sm" variant="outline" onClick={openCreate}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Tambah
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {sorted.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">
              Belum ada kontak
            </p>
          ) : (
            <div className="space-y-3">
              {sorted.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{contact.name}</span>
                      {contact.is_primary && (
                        <Badge variant="outline" className="text-xs gap-1 py-0">
                          <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                          PIC Utama
                        </Badge>
                      )}
                    </div>
                    {contact.position && (
                      <p className="text-xs text-slate-500">{contact.position}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-1">
                      {contact.phone && (
                        <span className="flex items-center gap-1 text-xs text-slate-600">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </span>
                      )}
                      {contact.email && (
                        <span className="flex items-center gap-1 text-xs text-slate-600">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </span>
                      )}
                    </div>
                    {contact.notes && (
                      <p className="text-xs text-slate-400 italic">{contact.notes}</p>
                    )}
                  </div>
                  {canEdit && (
                    <div className="flex gap-1 ml-3 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => openEdit(contact)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-500 hover:text-red-600"
                        onClick={() => setDeleteId(contact.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Kontak' : 'Tambah Kontak'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nama *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama kontak"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Jabatan</Label>
                <Input
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="Manager HRD"
                />
              </div>
              <div className="space-y-2">
                <Label>Telepon</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="08xx"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@perusahaan.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Catatan</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                placeholder="Catatan tentang kontak ini"
              />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_primary}
                onChange={(e) => setForm({ ...form, is_primary: e.target.checked })}
                className="rounded border-slate-300"
              />
              Jadikan PIC Utama
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={loading || !form.name.trim()}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kontak?</AlertDialogTitle>
            <AlertDialogDescription>
              Kontak ini akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
