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
