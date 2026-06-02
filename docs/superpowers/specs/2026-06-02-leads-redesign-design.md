# Leads Page Redesign — Design Spec
**Date:** 2026-06-02  
**Status:** Approved

---

## Overview

Rewrite halaman leads dari multi-page menjadi single-page experience menggunakan modal (tambah/edit) dan side panel (detail). Referensi visual: TailAdmin Data Table 2 + Default Modal.

---

## Goals

- UI lebih friendly dan rapi mengikuti gaya TailAdmin
- CRUD lead (tambah & edit) via modal tanpa pindah halaman
- Detail lead + manage kontak via side panel
- Search by nama perusahaan & nama kontak, filter by segmen, pagination

---

## File Changes

### Dihapus
```
app/(dashboard)/leads/new/page.tsx
app/(dashboard)/leads/[id]/page.tsx
app/(dashboard)/leads/[id]/edit/page.tsx
features/leads/components/lead-form.tsx
features/leads/components/lead-table.tsx
```

### Ditulis ulang / dibuat baru
```
app/(dashboard)/leads/page.tsx                     — orchestrator state
features/leads/components/lead-table.tsx            — tabel + search + filter + pagination
features/leads/components/lead-modal.tsx            — modal tambah & edit (shared)
features/leads/components/lead-side-panel.tsx       — side panel detail lead
features/leads/components/lead-contact-manager.tsx  — manage kontak di dalam side panel
```

### Tidak berubah
```
features/leads/actions.ts
features/leads/hooks/use-leads.ts
features/leads/hooks/use-lead.ts
features/leads/components/contact-card.tsx   — dipakai ulang di LeadSidePanel
```

---

## Architecture

### State Management (`leads/page.tsx`)

Page menjadi orchestrator. Semua state dikontrol di sini dan di-pass ke child components via props.

```ts
selectedLeadId: string | null   // null = side panel tertutup
modalMode: null | 'create' | 'edit'
editingLead: Lead | null        // data pre-fill untuk mode edit
```

Data list di-fetch di page level menggunakan `use-leads` hook, lalu di-pass ke LeadTable.

`LeadSidePanel` fetch data detail-nya sendiri menggunakan `use-lead(selectedLeadId)` — termasuk kontak — supaya tidak perlu passing semua data dari parent dan panel selalu fresh saat dibuka.

Setelah mutasi (create/update/delete), `router.refresh()` dipanggil untuk sync data list di tabel. Side panel yang sedang terbuka refresh otomatis karena `use-lead` re-fetch saat data berubah.

---

## Component Design

### 1. LeadTable

Tabel utama mengikuti style TailAdmin Data Table 2.

**Header controls:**
- Kiri: Search input — placeholder "Cari perusahaan atau kontak..."
- Kanan: Dropdown filter segmen + tombol "Tambah Lead"

**Kolom:**
| Kolom | Isi |
|---|---|
| Perusahaan | `company_name` (bold) + `line_business` (sub-text kecil, gray) |
| Segmen | Badge warna per segmen |
| PIC Utama | Nama + nomor HP kontak `is_primary = true` |
| Ditambahkan | Tanggal + nama sales (sub-text) |
| Aksi | Icon edit ✏️ + icon hapus 🗑️ |

**Interactions:**
- Klik baris → panggil `onSelectLead(lead.id)` untuk buka side panel
- Klik ✏️ → panggil `onEditLead(lead)` untuk buka modal edit
- Klik 🗑️ → AlertDialog konfirmasi delete
- Klik "Tambah Lead" → panggil `onCreateLead()`

**Search & Filter:**
- Bekerja di sisi client (filter array data yang sudah di-fetch)
- Search: filter `company_name` dan `lead_contacts[*].name`
- Filter segmen: dropdown, default "Semua Segmen"
- Search + filter bisa dikombinasikan

**Pagination:**
- 10 baris per halaman
- Info: "Showing X–Y of Z leads"
- Tombol Prev / Next (disabled jika di ujung)
- Reset ke halaman 1 saat search/filter berubah

**Badge warna segmen:**
| Segmen | Warna |
|---|---|
| Wedding | Pink |
| Private | Purple |
| Corporate | Blue |
| BUMN | Orange |
| Government | Green |

---

### 2. LeadModal

Satu modal untuk tambah dan edit lead. Judul berubah dinamis.

**Props:**
```ts
mode: 'create' | 'edit'
lead?: Lead           // untuk pre-fill saat edit
onClose: () => void
onSuccess: () => void
```

**Header:** "Tambah Lead Baru" / "Edit Lead"

**Form fields:**
| Field | Type | Validasi |
|---|---|---|
| Nama Perusahaan | Text input | Required |
| Segmen | Select | Required |
| Industri / Line of Business | Text input | Optional |
| Alamat | Textarea | Optional |

**Footer:**
- Kiri: Tombol "Batal"
- Kanan: Tombol "Simpan" (loading spinner saat submit, disabled saat loading)

**Behaviour:**
- Submit → panggil `createLead()` atau `updateLead()` server action
- Sukses → toast sukses → `onSuccess()` → modal tutup → data refresh
- Error → toast error → modal tetap terbuka

---

### 3. LeadSidePanel

Side panel overlay dari kanan layar, lebar `w-[480px]`.

**Props:**
```ts
leadId: string | null
onClose: () => void
onEdit: (lead: Lead) => void
```

**Behaviour buka/tutup:**
- `leadId !== null` → slide in dari kanan
- Klik X atau backdrop → `onClose()`
- Klik baris lead lain saat terbuka → update `leadId` → panel langsung update
- Tidak push content — overlay dengan backdrop `bg-black/40`

**Struktur konten:**

**Header:**
- Nama perusahaan (text-xl, bold)
- Tombol X (pojok kanan atas)
- Tombol "Edit Lead" (icon + text, secondary style)

**Section Info:**
- Badge segmen
- Industri (jika ada)
- Alamat (jika ada)
- Ditambahkan oleh: nama sales + tanggal

**Section Kontak:**
- Judul "Kontak" + tombol "+ Tambah Kontak" di kanan
- List kontak via `LeadContactManager`

**Tidak ada:** tombol "Buat Order"

---

### 4. LeadContactManager

Komponen manage kontak di dalam side panel. Menggunakan `contact-card.tsx` yang sudah ada sebagai base.

**Props:**
```ts
leadId: string
contacts: LeadContact[]
onUpdate: () => void   // trigger refresh data
```

**Per kontak tampil:**
- Nama + badge "PIC Utama" (jika `is_primary = true`)
- Jabatan
- Nomor HP + Email
- Tombol ✏️ edit + 🗑️ hapus

**Tambah / edit kontak:** Dialog kecil (reuse logic dari `contact-card.tsx`)
**Hapus kontak:** AlertDialog konfirmasi

---

## Removed Features

- Halaman `/leads/new` → diganti LeadModal mode create
- Halaman `/leads/[id]` → diganti LeadSidePanel
- Halaman `/leads/[id]/edit` → diganti LeadModal mode edit
- Tombol "Buat Order" di detail lead → dihapus

---

## Non-Goals

- Server-side pagination (data tidak terlalu besar, client-side cukup)
- Export CSV / print
- Bulk delete
- Filter by tanggal
