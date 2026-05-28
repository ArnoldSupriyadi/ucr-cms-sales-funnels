'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

interface LeadFormProps {
  lead?: Lead
}

export function LeadForm({ lead }: LeadFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [companyName, setCompanyName] = useState(lead?.company_name ?? '')
  const [address, setAddress] = useState(lead?.address ?? '')
  const [segmen, setSegmen] = useState(lead?.segmen ?? '')
  const [lineBusiness, setLineBusiness] = useState(lead?.line_business ?? '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const payload = {
      company_name: companyName,
      address: address || null,
      segmen: (segmen || null) as Lead['segmen'],
      line_business: lineBusiness || null,
    }

    const result = lead
      ? await updateLead(lead.id, payload)
      : await createLead(payload)

    if (!result.success) {
      toast.error('Gagal menyimpan', { description: result.error })
      setLoading(false)
      return
    }

    toast.success(lead ? 'Lead diperbarui' : 'Lead ditambahkan')
    router.push(lead ? `/leads/${lead.id}` : '/leads')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="company_name">Nama Perusahaan / Klien *</Label>
        <Input
          id="company_name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="PT Contoh Indonesia"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Alamat</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Alamat kantor atau lokasi"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Segmen</Label>
          <Select value={segmen} onValueChange={setSegmen}>
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

        <div className="space-y-2">
          <Label htmlFor="line_business">Line Business</Label>
          <Input
            id="line_business"
            value={lineBusiness}
            onChange={(e) => setLineBusiness(e.target.value)}
            placeholder="Banking, Oil & Gas, dll"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : lead ? 'Simpan Perubahan' : 'Tambah Lead'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Batal
        </Button>
      </div>
    </form>
  )
}
