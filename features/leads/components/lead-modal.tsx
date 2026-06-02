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
  lineBusinessSuggestions?: string[]
  onClose: () => void
  onSuccess: () => void
}

export function LeadModal({ mode, lead, lineBusinessSuggestions = [], onClose, onSuccess }: LeadModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [companyName, setCompanyName] = useState(lead?.company_name ?? '')
  const [segmen, setSegmen] = useState(lead?.segmen ?? '')
  const [lineBusiness, setLineBusiness] = useState(lead?.line_business ?? '')
  const [address, setAddress] = useState(lead?.address ?? '')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = lineBusinessSuggestions.filter(
    (s) => s.toLowerCase().includes(lineBusiness.toLowerCase()) && s !== lineBusiness
  ).slice(0, 6)

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
              <SelectTrigger className="w-full">
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

          <div className="relative space-y-1.5">
            <Label htmlFor="line_business">Industri / Line of Business</Label>
            <Input
              id="line_business"
              value={lineBusiness}
              onChange={(e) => { setLineBusiness(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Ketik industri, misal: Banking, FMCG..."
              disabled={loading}
              autoComplete="off"
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-50 w-full rounded-md border border-gray-200 bg-white shadow-md">
                <p className="border-b border-gray-100 px-3 py-1.5 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                  Pilih atau ketik baru
                </p>
                {filteredSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={() => { setLineBusiness(s); setShowSuggestions(false) }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
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
