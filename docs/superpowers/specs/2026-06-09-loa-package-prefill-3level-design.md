# LOA Prefill Paket + Menu 3-Level — Design Spec

**Tanggal:** 2026-06-09
**Status:** Disetujui konsep (menunggu review tertulis)
**Konteks:** Lanjutan dari redesign multi-event (`2026-06-08`). Menambah 1 level nesting + prefill dari paket katalog.

## Latar Belakang & Masalah

Editor LOA sekarang 2 level di bawah Header: `Header → Sub-grup → Item`. Paket katalog (mis. "Full Day Meeting Package") punya struktur lebih dalam:
`Paket → Komponen (Coffee Break ×2, Indonesian Buffet ×1) → Sub-kategori (Savoury/Sweets/…; Buffet: Appetizer/Soup/Beef/…) → Item`.
Sales ingin **prefill** struktur paket dari DB sebagai titik awal, lalu menyesuaikan bebas. Fitur "Pakai paket" lama sudah dihapus (menimpa nama header). Item katalog sangat banyak (1 Full Day Meeting ≈ 210 item) → prefill semua item tidak masuk akal.

## Tujuan

Prefill **struktur paket + beberapa item contoh** dari katalog, dengan model 3-level, semua dapat diedit (tambah/kurang/ganti di tiap level), dan sub-kategori tambahan dapat dipilih dari katalog.

## Keputusan Desain

### 1. Model data (tambah level "Komponen/Section")
```
Event → Header (pax·amount) → Section/Komponen → SubGroup/Sub-kategori → Item
```
Item boleh menempel di beberapa level (fleksibel utk header manual maupun hasil paket):
- **HeaderDraft**: `key, name, keterangan, pax, amount, items[] (langsung), sections[]`
- **SectionDraft**: `key, name, keterangan, items[] (langsung), subGroups[]`
- **SubGroupDraft**: `key, name, keterangan, items[]`
- **MenuItemDraft**: `key, name, keterangan`

### 2. Prefill dari Paket
Pilih paket → buat **Header baru** terisi:
- **Header.name** = nama paket (mis. "Full Day Meeting Package (Indonesian Buffet)"); `pax`/`amount` kosong (diisi sales).
- **Sections** = `menu_package_components` paket; `qty>1` → bernomor ("Coffee Break 1", "Coffee Break 2"). 1 komponen qty 2 → 2 section.
- **SubGroups** per section = kategori daun katalog untuk `component_type` itu (pakai `catalog.categoriesByComponentType` yang sudah ada — sudah berbentuk leaf + `groupName`).
- **Items contoh** = **3 pertama** dari tiap sub-kategori (dari `category.items`). Sisanya/penggantian oleh sales.
- Semua node hasil prefill **editable & hapus-able**. Pilih paket lagi → menambah Header baru lagi.

### 3. Tambah sub-kategori dari katalog (bukan hanya ketik bebas)
Tombol **"+ Sub-kategori"** pada sebuah Section membuka **combobox** berisi daftar sub-kategori katalog (kategori daun yang punya item — mis. Savoury, Sweets, Bread, Appetizer, Soup, Beef, Chicken, Fish, Noodle, Vegetable, Mini Cakes, Puddings). Pilih → sub-kategori ditambah (opsional + 3 item contoh). **Ketik bebas tetap boleh** (sub-kategori non-katalog). Helper baru `searchCategories(catalog, query)`.

### 4. UX pemicu (hindari bug lama yang menimpa nama Header)
- Tombol **"+ Tambah dari Paket"** (di samping "+ Tambah Header", di akhir daftar header per event) → buka picker paket ber-search → pilih → **menambah Header baru ter-prefill**.
- **"+ Tambah Header"** (manual, kosong) tetap ada.
- **TIDAK ada** picker paket di dalam kartu Header (penyebab bug lama dihindari permanen).

### 5. Editing manual (semua level)
- Header: edit nama/keterangan/pax/amount; + item langsung; + Section; hapus.
- Section: edit nama/keterangan; + item langsung; + Sub-kategori (combobox katalog, §3); hapus.
- Sub-kategori: edit nama/keterangan; + item (autocomplete item `ItemCombobox` yang sudah ada); hapus.
- Item: nama (autocomplete) + keterangan; hapus.

### 6. Kalkulasi & dokumen
- **Kalkulasi TIDAK berubah**: `subTotal1 = Σ amount Header` (amount manual di Header). Section/sub-kategori/item tak berharga.
- **Dokumen** (`doc-preview`) render 3 level: Header (baris berharga) → Section (sub-judul) → Sub-kategori (sub-judul lebih kecil) → item (• nama — keterangan).

### 7. Persistence — migration 008
- **`loa_sections`** (BARU): `id, header_id (FK loa_items ON DELETE CASCADE), name, keterangan, sort_order`.
- **`loa_subgroups`**: tambah `section_id (FK loa_sections ON DELETE CASCADE, nullable)`. (header_id lama dipertahankan utk kompat, tapi pemakaian baru lewat section_id.)
- **`loa_menu_items`**: tambah `section_id (FK loa_sections, nullable)`. Lokasi item ditentukan: direct-header (`section_id=null, subgroup_id=null`), direct-section (`section_id=X, subgroup_id=null`), atau sub-grup (`subgroup_id=Y`).
- RLS pola sama (akses bila pemilik LOA induk / admin), via join ke `loa`.
- Data LOA saat ini kosong → rebuild aman.

`saveLoaDraft`/`getLoaForEdit` diperluas untuk pohon 4-tingkat (events → headers → sections → subgroups → items), delete-reinsert.

## Komponen Terdampak
- DB: migration 008.
- `types/database.ts` (loa_sections + kolom baru).
- `features/loa/types.ts` (+SectionDraft, HeaderDraft.sections).
- `features/loa/loa-form-reducer.ts` (+operasi section; item bisa di header/section/subgroup).
- `lib/loa/catalog-suggest.ts` (+`searchCategories`, +`packageToHeader` versi 3-level dgn sample items).
- `features/loa/components/menu-tree-editor.tsx` (render 3 level + combobox sub-kategori).
- `features/loa/components/section-combobox.tsx` & `package-combobox` (picker; package-combobox dihidupkan lagi untuk tombol "Tambah dari Paket").
- `features/loa/components/step-items.tsx` (tombol "+ Tambah dari Paket").
- `features/loa/actions.ts` (persist/load 4-tingkat).
- `features/loa/components/doc-preview.tsx` (render 3 level).

## Non-Goals (YAGNI)
- Tidak prefill SEMUA item katalog (cuma 3 contoh/sub-kategori).
- Tidak menghidupkan kembali aturan seleksi katalog (`selection_rule`) — menu tetap bebas.
- Tidak mengubah kalkulasi/penomoran/order.
- Nesting tak terbatas (cukup 3 level tetap: Section → SubGroup → Item).

## Catatan Scope
Sizable (migration + model + reducer + editor + persistence + dokumen + prefill/suggestion). Implementasi difase di plan; commit saat hijau (TDD untuk helper murni).

## Untuk Dikonfirmasi saat Review
1. Sub-kategori = **kategori daun** katalog (Beef/Chicken/Soup terpisah) — sesuai? (groupName seperti "Main Course" ditampilkan sebagai label, bukan level tersendiri.)
2. **3 item contoh** per sub-kategori saat prefill — sesuai?
3. Picker paket lewat tombol **"+ Tambah dari Paket"** (bukan di dalam kartu header) — sesuai?
