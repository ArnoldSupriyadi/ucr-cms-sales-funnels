# Design Spec — Tipe Order & Perubahan Pricing LoA

**Tanggal:** 2026-06-04
**Status:** Disetujui untuk implementasi
**Scope:** (1) Tipe Order (Package/Event) + kategori pada Order, (2) Service Charge mengikuti tipe order, (3) Handling Fee flat/percent, (4) urutan diskon baru, (5) tampilan "Item Layanan" jadi heading + list. Approval & PDF = spec terpisah.

**Mengubah:** spec `2026-06-02-loa-form-design.md` §4 (kalkulasi) & §3 (rendering item). Baca spec itu sebagai dasar — dokumen ini hanya menjelaskan delta-nya.

---

## 1. Tujuan & Konteks

Sales mengklasifikasikan tiap Order ke salah satu **tipe** yang menentukan **Service Charge** secara otomatis. Tipe dipilih saat buat order dan **bisa diganti di halaman detail order**; nilainya **mengalir ke LoA** (Service Charge di form LoA jadi read-only, mengikuti tipe). Selain itu, mode Handling Fee diperluas (flat/persen), urutan potongan diskon digeser, dan tampilan daftar item layanan diubah jadi format judul + daftar menu.

**Penegasan:** kategori hanya untuk **klasifikasi & penentu Service Charge**. Pemilihan menu/paket di LoA **tetap bebas** (tidak dikunci oleh tipe/kategori order) dan **tetap dari katalog DB** (drawer menu existing, bukan free text).

---

## 2. Tipe Order & Kategori (atribut ORDER)

Dua tingkat, **cascading**, **pilih 1**:

| Tipe Order | Service Charge | Kategori (pilih 1) |
|---|---|---|
| **Package Order** | **5%** (fixed) | Box Package (Nasi/Snack/Bento/Longbox) · Gift Box (Tumpeng/Bakul/Hampers/Dropfood) |
| **Event Order** | **10%** (fixed) | Meeting / Open House · Buffet & Stall · Coffee Break / Takjil · Canape · Set Menu |

- **Revisi 4 Juni 2026:** nama kategori Package memuat keterangan isian di dalam kurung dan **ikut tersimpan** sebagai nilai `order_category` penuh (mis. `Box Package (Nasi/Snack/Bento/Longbox)`). Sebelumnya keterangan ini hanya contoh & tidak disimpan; sekarang jadi bagian dari nama kategori. Tetap **pilih 1** kategori (bukan memilih item di dalam kurung).
- Disimpan di Order: **tipe** (`order_type`) + **kategori** (`order_category`).
- Daftar tipe & kategori = **konstanta di kode** (`lib/constants/order-type.ts`), bukan tabel — karena tetap & kecil. Service Charge per tipe diturunkan dari konstanta ini (single source of truth).
- UI: pilih Tipe → muncul daftar kategori milik tipe itu. Ganti Tipe → kategori di-reset.

**Catatan kolom lama (keputusan 4 Juni 2026):** field bebas-ketik **"Jenis Event" (`orders.event_type`) DISEMBUNYIKAN dari form order** — digantikan `order_type` + `order_category` yang terstruktur (mengurangi field ganda yang membingungkan + data lebih konsisten untuk report). **Kolom `event_type` TIDAK dihapus dari DB** (data lama aman), hanya tidak ditampilkan/diisi lagi di form. `event_name` (nama spesifik acara, mis. "Annual Gathering 2026") **tetap** — beda dari jenis order.

---

## 3. Service Charge mengalir Order → LoA

- `serviceChargePctForType(orderType)` → `5` (Package) / `10` (Event). Satu helper, dipakai UI & server.
- Di form LoA: field **Service Charge read-only**, nilainya = SC dari tipe order terkait. Sales tidak bisa edit.
- Saat **simpan LoA**, server **tidak percaya** angka client: SC di-derive ulang dari `order.order_type` lalu dipakai di `calculateLoa`. `loa.service_charge_pct` menyimpan hasilnya.
- Bila tipe order diganti **setelah** LoA dibuat: SC LoA ikut berubah saat LoA disimpan ulang (re-derive). (Tidak ada sinkronisasi otomatis tanpa save — di luar scope; cukup dokumentasikan.)

---

## 4. Kalkulasi Harga — urutan BARU (`lib/loa/calculations.ts`)

Diskon **naik** ke bawah Sub Total 1 dan **mengurangi basis** sebelum SC/PB1/Handling. Handling Fee dapat **persen** atau **flat (Rp)**.

```
sub_total_1        = Σ (item.price_per_pax × item.pax)
discount_amt       = (type=percent) ? sub_total_1 × discount_value/100      ← basis = SUB TOTAL 1
                                    : discount_value                          (flat Rupiah)
                     di-clamp ke [0, sub_total_1]
dpp_after_discount = sub_total_1 − discount_amt
service_charge_amt = dpp_after_discount × sc_pct/100                          (sc_pct dari tipe order: 5/10)
sub_total_2        = dpp_after_discount + service_charge_amt                  ← NET REVENUE (dipakai IB)
pb1_amt            = sub_total_2 × 10%                                        (fixed, read-only)
handling_fee_amt   = (type=percent) ? sub_total_2 × handling_value/100        ← basis = SUB TOTAL 2
                                    : handling_value                          (flat Rupiah)
grand_total        = sub_total_2 + pb1_amt + handling_fee_amt
net_revenue        = sub_total_2
```

**Perubahan kunci vs spec lama:**
1. Diskon **dari Sub Total 1** (dulu dari grand total pre-discount, di akhir).
2. `net_revenue` = `sub_total_2` = **setelah diskon** (dulu diklaim "tidak terpengaruh diskon"). Karena diskon kini mengurangi basis, IB ikut memakai revenue setelah diskon — konsisten dengan urutan baru.
3. Handling Fee: tambah `handlingType` (`percent`|`flat`); flat = pakai nilai langsung. Persen tetap basis Sub Total 2.
4. Service Charge: `scPct` tidak lagi input bebas — diturunkan dari tipe order.

Fungsi tetap **murni**, dipakai dua tempat: render live UI + re-kalkulasi server. Semua test `calculations.test.ts` di-update mengikuti urutan ini.

### Contoh angka (verifikasi cepat)
`sub_total_1 = 10.000.000`, Event Order (SC 10%), diskon flat 1.000.000, PB1 10%, handling 5% (persen):
```
discount            =  1.000.000
dpp_after_discount  =  9.000.000
service_charge 10%  =    900.000
sub_total_2         =  9.900.000   (net_revenue)
pb1 10%             =    990.000
handling 5%         =    495.000
grand_total         = 11.385.000
```

---

## 5. Handling Fee — mode flat/percent (mirror diskon)

- UI (step Harga): toggle **Percent (%)** / **Flat (Rp)** + 1 input nilai (`handlingValue`). Pola identik dengan toggle diskon yang sudah ada.
- Penyimpanan: `loa.handling_fee_type` + `loa.handling_fee_value`. `loa.handling_fee_amt` = hasil. Kolom lama `loa.handling_fee_pct` tetap diisi untuk kompatibilitas (= value bila percent, 0 bila flat).

---

## 6. Section "Item Layanan" — heading + list

Tampilan tiap item LoA diubah dari **teks sebaris** menjadi **judul + daftar**:

```
Sebelum:  Meeting Package — 100 pax × Rp 369.000
          Coffee Break 1: Risoles, Teh · Lunch: Ayam        (satu baris)

Sesudah:  Meeting Package                    Rp 36.900.000   ← heading bawa HARGA
            • Risoles
            • Teh
            • Ayam                                            ← list menu, TANPA harga
```

- **Harga hanya di level heading** (`price_per_pax × pax`), masuk Sub Total 1.
- **Isi menu di bawah heading tanpa harga**, ditampilkan sebagai bulleted/ordered list.
- **Sumber data tidak berubah:** menu tetap dipilih dari katalog via drawer existing; `selections` snapshot tetap ke `loa_item_selections`. Yang berubah **hanya rendering**.
- **Data model `LoaItemDraft` tidak berubah** (`packageName` = heading, `selections[]` = isi). Satu order bisa beberapa heading (beberapa item).
- Implementasi: tambah helper `groupSelectionLines(selections)` → mengembalikan `{ group, items[] }[]` untuk dirender list. Kolom `loa_items.menu_detail` (TEXT) **tetap** diisi via `generateMenuDetail` (string) untuk kompatibilitas/penyimpanan; rendering UI form memakai list.
- **Scope:** hanya tampilan **form** (`step-items.tsx`). Section rincian item di **PDF (`doc-preview.tsx`) DITUNDA** ke spec generate-PDF terpisah (saat ini section item di preview belum ada).

---

## 7. Migrasi DB — `db/migrations/004_order_type_handling.sql`

```sql
-- 1) Tipe & kategori order
ALTER TABLE orders
  ADD COLUMN order_type     VARCHAR(20)
    CHECK (order_type IN ('Package','Event')),
  ADD COLUMN order_category VARCHAR(50);

COMMENT ON COLUMN orders.order_type IS 'Package (SC 5%) | Event (SC 10%). Menentukan service charge LoA.';
COMMENT ON COLUMN orders.order_category IS 'Sub-kategori sesuai tipe (Box Package, Gift Box, Meeting/Open House, dst). Klasifikasi saja.';

-- 2) Handling fee flat/percent di LoA (mirror discount_type/value)
ALTER TABLE loa
  ADD COLUMN handling_fee_type  VARCHAR(10) NOT NULL DEFAULT 'percent'
    CHECK (handling_fee_type IN ('percent','flat')),
  ADD COLUMN handling_fee_value NUMERIC(15,2) NOT NULL DEFAULT 0;

COMMENT ON COLUMN loa.handling_fee_type IS 'percent = value adalah %, flat = value adalah Rupiah.';
COMMENT ON COLUMN loa.handling_fee_value IS 'Nilai mentah handling fee. Hasil amount di handling_fee_amt; handling_fee_pct lama tetap diisi utk kompatibilitas.';
```

Dijalankan manual di Supabase SQL Editor (konvensi project, strategi UAT: file baru berurutan, jangan reset). `order_type`/`order_category` **nullable** agar order lama tidak melanggar constraint; UI mewajibkan untuk order baru.

---

## 8. Validasi

- **Order form:** Tipe Order **wajib** dipilih (order baru); kategori wajib bila tipe dipilih. Order lama tanpa tipe → izinkan edit, prompt isi saat dibuka.
- **LoA:** SC read-only (tak perlu validasi range). Handling: nilai ≥ 0; bila percent 0–100. Diskon ≤ Sub Total 1 (di-clamp di kalkulasi).
- **Server:** `saveLoaDraft` re-derive SC dari `order.order_type`, re-kalkulasi penuh. Bila order belum punya `order_type` → tolak dengan pesan "Tipe order belum diisi".

---

## 9. Batas Scope

**Termasuk:** kolom tipe/kategori order + UI (form & detail), helper SC, perubahan `calculateLoa`, handling flat/percent (UI + persist), urutan diskon baru, rendering item heading+list, migration 004.

**TIDAK termasuk:** approval flow, generate PDF, sinkronisasi otomatis SC ke LoA saat tipe order diubah tanpa menyimpan LoA (cukup re-derive saat save).
