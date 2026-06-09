'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { updateProfile } from '../actions'
import type { AppUser } from '@/types/domain'

interface ProfileFormProps {
  user: AppUser
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone ?? '')
  const [jabatan, setJabatan] = useState(user.jabatan ?? '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    const result = await updateProfile({
      name: name.trim(),
      phone: phone.trim() || null,
      jabatan: jabatan.trim() || null,
    })

    if (!result.success) {
      toast.error('Gagal menyimpan', { description: result.error })
    } else {
      toast.success('Profil diperbarui')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Informasi Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium mt-0.5 text-slate-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Role</dt>
              <dd className="mt-0.5">
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                  {user.role.name}
                </Badge>
              </dd>
            </div>
          </dl>
          <p className="text-xs text-slate-400 mt-4">
            Email dan role tidak dapat diubah sendiri. Hubungi Super Admin untuk perubahan ini.
          </p>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Edit Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jabatan">Jabatan</Label>
                <Input
                  id="jabatan"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Sales Manager, Sales Executive, dll"
                />
                <p className="text-xs text-slate-400">
                  Akan tampil di footer surat LOA
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor HP</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812-xxxx-xxxx"
                />
                <p className="text-xs text-slate-400">
                  Akan tampil di surat LOA
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading || !name.trim()}>
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
