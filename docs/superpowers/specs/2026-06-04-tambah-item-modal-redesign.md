# Design Spec — Redesign Modal "Tambah Item LoA"

**Tanggal:** 2026-06-04
**Status:** Disetujui untuk implementasi
**Scope:** Redesign UI modal tambah item di form LoA (`menu-drawer.tsx`): perbaiki bug dropdown paket terpotong, tambah search (paket + menu per-sesi), input full width, tampilan lebih berwarna. Murni UI + 1 helper murni — tidak mengubah logika simpan/kalkulasi/skema DB.

**Route terdampak:** `/orders/[id]/loa` → step "Items" → tombol "+ Tambah Item" (drawer).

---

## 1. Masalah & Tujuan

**Bug (akar tunggal):** Komponen `Select` shadcn memakai `position="item-aligned"` (default). Di dalam panel `Sheet` (yang punya container `overflow-y-auto`), mode ini menghitung tinggi konten dari ruang sisa yang sempit → **dropdown paket terpotong**. Akibatnya user belum sempat memilih paket dengan benar, sehingga **menu (occasions) seperti tidak muncul**. Logika katalog (`catalog-shape.ts`, `occasions` di drawer) sudah benar — begitu pemilihan paket berjalan normal, menu render seperti biasa.

**Tujuan:**
1. Ganti picker paket dengan combobox berbasis `Command` + `Popover` (mode *popper*, via portal) → dropdown tidak terpotong + **searchable**.
2. Tambah **search menu per-sesi** (filter item dalam satu kartu sesi).
3. Input **Pax** & **Harga/pax** jadi **full width** (ditumpuk), bukan berdempetan ½ lebar.
4. Tampilan **lebih berwarna** (header/tombol gradient, kartu sesi beraksen, badge & chip berwarna).

**Keputusan brainstorming:** gaya search menu = **per-sesi** (tiap kartu punya kotak cari sendiri), bukan satu search global. Warna aksen = disetujui.

---

## 2. Komponen

### 2.1 `PackageCombobox` (baru) — `features/loa/components/package-combobox.tsx`
Picker paket ber-search menggantikan `Select`.

- Berbasis `Popover` + `Command` (cmdk) — pola sama dengan `components/ui/combobox.tsx` yang sudah ada, tapi mendukung **grup** (per kategori) dan **konten item kustom** (tanda ● untuk paket ber-menu).
- Props: `packagesByKategori: [string, CatalogPackage[]][]`, `value: string`, `onChange: (id: string) => void`.
- `PopoverContent` render lewat portal (default Radix) → lepas dari `overflow` Sheet → **tidak terpotong**.
- `CommandInput` placeholder "Cari paket…"; `CommandGroup` per kategori dengan `CommandItem` per paket. `CommandItem value` memakai nama paket agar pencarian cmdk match by nama (bukan id). Klik → `onChange(p.id)` + tutup popover.
- Trigger: tombol full-width menampilkan nama paket terpilih atau placeholder "Pilih paket…".

### 2.2 `menu-drawer.tsx` (ubah)
- Import & pakai `PackageCombobox` menggantikan blok `Select…/Select`. Hapus import `Select*` bila tak terpakai lagi.
- **Input Pax & Harga/pax:** dari `<div className="flex gap-3">` (dua `flex-1`) → **dua blok terpisah, masing-masing full width**, ditumpuk vertikal dalam `space-y-4`.
- **Warna:** `SheetHeader` & tombol "Simpan Item" gradient indigo→violet; `SheetFooter` latar `bg-slate-50`. Tetap pakai komponen Sheet existing.
- Logika tidak berubah: `handlePackageChange`, `occasions`, `buildSelections`, `previewLines`, validasi, `onAddItem` tetap.

### 2.3 `menu-selection-group.tsx` (ubah)
- **Search per-sesi:** state lokal `query` (`useState('')`) di dalam komponen. Input "Cari menu di sesi ini…" di atas daftar kategori. **Hanya memengaruhi tampilan** — tidak menyentuh `value`/`onChange`/`selections`.
- Kategori & item dirender dari hasil `filterCategoriesByQuery(categories, query)` (lihat §3). Kategori tanpa item cocok disembunyikan. Bila semua tersaring habis → empty state "Tidak ada menu cocok."
- **Pilihan tetap aman saat search:** filter hanya untuk render; menghapus query memunculkan kembali semua kategori dengan pilihan utuh. Item terpilih yang sedang tersembunyi karena filter **tetap tersimpan** di `value`.
- **Warna (rotasi palet per index occasion):** header kartu sesi beraksen warna dari palet `['indigo','emerald','amber','sky','rose']` (dipilih `palette[occasionIndex % palette.length]`). Badge rule: `pilih 1` biru, `pilih bebas` ungu. Item radio/checkbox tampil sebagai chip (abu → indigo saat terpilih).
- Index occasion diteruskan dari drawer (mis. prop `accentIndex: number`) agar warna konsisten & deterministik, bukan acak.

---

## 3. Helper filter (murni, TDD) — `lib/loa/filter-categories.ts`

```ts
import type { CatalogCategory } from '@/features/loa/types'

/**
 * Filter kategori untuk tampilan search per-sesi. Kembalikan hanya kategori
 * yang punya >=1 item cocok (nama item mengandung query, case-insensitive),
 * dengan items sudah dipersempit ke yang cocok. Query kosong/whitespace →
 * kategori dikembalikan apa adanya (tanpa perubahan).
 */
export function filterCategoriesByQuery(
  categories: CatalogCategory[],
  query: string
): CatalogCategory[]
```

**Aturan:**
- `query.trim() === ''` → kembalikan `categories` apa adanya.
- Selain itu: untuk tiap kategori, saring `items` yang `nama.toLowerCase().includes(q)`. Buang kategori yang hasil itemnya kosong.
- Tidak mengubah objek asli (kembalikan kategori baru dengan `items` terfilter).

**Test (`filter-categories.test.ts`):** query kosong → utuh; match sebagian & case-insensitive; kategori tanpa match dibuang; items dalam kategori ikut terfilter; query tak cocok sama sekali → `[]`.

---

## 4. Yang TIDAK berubah

- `buildSelections`, `calculateLoa`, simpan `loa_items`/`loa_item_selections`, `generateMenuDetail` (pengisi kolom `loa_items.menu_detail`), skema DB.
- `previewLines` (preview menu terpilih di footer) — tetap format grup sub-judul + bullet (hasil pekerjaan sebelumnya).
- Aturan validasi seleksi (`validateCategorySelections`, `selection-rules`).

---

## 5. File yang disentuh

| File | Aksi |
|---|---|
| `lib/loa/filter-categories.ts` + `.test.ts` | **baru** — helper filter (TDD) |
| `features/loa/components/package-combobox.tsx` | **baru** — picker paket ber-search (Command+Popover popper) |
| `features/loa/components/menu-drawer.tsx` | ganti `Select`→`PackageCombobox`; input full-width stack; warna header/footer |
| `features/loa/components/menu-selection-group.tsx` | search per-sesi; kartu sesi berwarna (rotasi palet); chip item; terima `accentIndex` |

---

## 6. Verifikasi

- `npx vitest run` → helper baru + semua existing hijau.
- `npx tsc --noEmit` → bersih.
- **Manual (browser, `/orders/[id]/loa` → Tambah Item):**
  - Dropdown paket **tidak terpotong**; bisa di-search; pilih paket → **menu muncul**.
  - Search menu per-sesi memfilter item; hapus query → pilihan utuh.
  - Pax & Harga/pax **full width**.
  - Header/tombol gradient, kartu sesi beraksen warna berbeda per sesi, badge & chip berwarna.
  - Simpan Item → item masuk ke daftar (step Items) seperti biasa; angka & menu_detail benar.

---

## 7. Batas Scope

**Termasuk:** redesign UI drawer + picker paket ber-search + search menu per-sesi + input full width + warna + helper filter (tested) + fix dropdown terpotong.

**TIDAK termasuk:** perubahan logika simpan/kalkulasi, skema DB, format `menu_detail`, atau tampilan PDF/preview dokumen.
