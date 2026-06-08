# Redesign Menu & Multi-Event LoA — Design Spec

**Tanggal:** 2026-06-08
**Status:** Disetujui konsep (menunggu review tertulis)
**Konteks:** Revisi besar struktur item/menu LoA + dokumen Section "BIAYA JASA KATERING".

## Latar Belakang & Masalah

Struktur LoA saat ini mengasumsikan **satu event** (tanggal/venue/pax dari Order) dengan menu berbasis **katalog kaku** (paket DB + selection terstruktur), dan `amount` diturunkan dari `price_per_pax × pax`.

Kenyataan lapangan:
- **Satu LoA bisa banyak event** dengan tanggal & menu berbeda (mis. PT Astra: 9 Jun & 10 Jun, menu beda).
- Menu **tidak baku** — sales berimprovisasi (mis. dua sesi → "Coffee Break 1" & "Coffee Break 2"), perlu **keterangan** per item (mis. "Nasi Goreng — tidak pedas").
- **Amount diketik manual** (paket deal, pembulatan), bukan selalu `price × pax`.
- **Pax** relevan di level header (porsi) dan di tabel waktu/tempat (hadirin), keduanya ditulis manual oleh sales.

## Tujuan

LoA yang **dinamis & manual-first**: banyak event per LoA, menu pohon bebas dengan suggestion dari katalog (bukan paksaan), amount manual, keterangan di tiap baris.

## Keputusan Desain

### 1. Order → rentang tanggal
- `orders.event_date` = tanggal **mulai**; tambah `orders.event_date_end` (nullable; null = 1 hari).
- Form order: pilih **Dari–Sampai**. Daftar & detail order menampilkan rentang ("9–10 Jun 2026"; 1 hari tampil satu tanggal).
- `order_no`, dashboard, single-session, dll **tidak terpengaruh** (order_no sudah dari counter).

### 2. Model data LoA (pohon)
```
LoA
 └ Event      : event_date · serving_time · venue · setup_location · pax(manual)   → tabel Waktu & Tempat
    └ Header   : name(free) · keterangan · pax(manual) · amount(manual)            → baris berharga
       └ SubGroup (opsional): name · keterangan(opsional)        (mis. Soup / Main Course)
          └ Item : name(free) · keterangan                       (mis. Nasi Goreng — tidak pedas)
```
- Header boleh berisi **item langsung** ATAU lewat **sub-grup** (sub-grup opsional, boleh dicampur).
- **Price/pax** tidak diinput; **ditampilkan** di dokumen = `amount ÷ pax` (pembagi 0 → tampil "—").
- Semua node bisa **tambah/edit/hapus/urut** (sort_order).

### 3. Suggestion (katalog lama tetap berguna, tidak memaksa)
- **Item:** input teks bebas dengan **autocomplete** dari katalog item (DB menu). Pilih saran → isi nama; tetap bisa diedit & diberi keterangan.
- **Header:** tombol **"Pakai paket"** → pilih paket dari katalog → auto-isi Header + sub-grup + item sesuai paket → seluruhnya **bebas diedit/hapus/tambah keterangan**. Tidak ada validasi kaku kategori.

### 4. Kalkulasi
- `subTotal1 = Σ amount semua Header (semua event)`.
- Lanjut **waterfall yang sudah ada**: Diskon (dari subTotal1) → DPP → Service Charge (% dari tipe order) → subTotal2 (= net_revenue) → PB1 10% → Handling (flat/percent) → **satu Grand Total**.
- `calculateLoa` diubah: input basis = **daftar amount Header** (bukan `price × pax`). Diskon/SC/PB1/handling tetap **global per LoA** (bukan per event).

### 5. Dokumen (form preview & PDF nanti)
- **Section 1 — Waktu & Tempat** (judul **tanpa angka Romawi**; pakai angka biasa/judul polos): multi-baris, 1 per event: `Tgl · Hari(auto) · Waktu siap saji · Tempat · Set Up · Pax(event)`.
- **Section 2 — Biaya Jasa Katering**: dikelompokkan per event → per Header (baris berharga: `Order · Price(auto) · Pax · Amount`) → sub-grup (tebal, tanpa harga) → item (`• nama — keterangan`). Di bawah: `Sub Total 1 → [Diskon] → Service Charge → Sub Total 2 (Net) → PB1 → Handling → Grand Total` (satu kali).
- Keterangan tampil sebagai teks kecil mengikuti nama item/header.

### 6. Persistence — migration 006 (bangun bersih)
Data LoA sudah kosong → **rebuild skema**, bukan tambal. (Tabel `loa` header pricing tetap.)
- **`loa_events`** — `id, loa_id, event_date, serving_time, venue, setup_location, pax, sort_order`.
- **`loa_items`** (= Header) — tambah `event_id` (FK loa_events), `keterangan`; `amount` jadi nilai manual; `price_per_pax` **dihapus/di-derive** (tidak lagi sumber kebenaran). `order_date` lama dihapus (digantikan event).
- **`loa_subgroups`** — `id, header_id (FK loa_items), name, keterangan, sort_order`.
- **`loa_menu_items`** — `id, header_id (FK loa_items), subgroup_id (FK loa_subgroups, nullable), name, keterangan, sort_order`. **Menggantikan `loa_item_selections`**.
- RLS mengikuti pola tabel LoA yang ada (akses lewat `loa` ownership / admin). Detail final di plan.

## Komponen Terdampak
- DB: migration 006 (events, headers, subgroups, menu_items) + orders.event_date_end.
- `features/loa/types.ts` + `loa-form-reducer.ts` (state pohon Event→Header→SubGroup→Item).
- UI: `step-detail` (jadi editor multi-event), `step-items` + `menu-drawer` (ganti jadi editor pohon + autocomplete + quick-fill paket), `price-panel`, `doc-preview`, `step-review`.
- `lib/loa/calculations.ts` (basis Σ amount).
- `features/loa/actions.ts` (`saveLoaDraft`/`getLoaForEdit` untuk pohon + events).
- `features/orders/*` (form/list/detail) untuk rentang tanggal.

## Non-Goals (YAGNI)
- Validasi kategori menu kaku (dihapus — semua bebas).
- Diskon/SC/handling per-event (tetap global).
- Migrasi data LoA lama (tidak ada datanya).
- Generate PDF (tetap milestone terpisah; spec ini hanya tampilan form + struktur data).

## Catatan Scope
Perubahan besar lintas DB/UI/kalkulasi/dokumen. Implementasi **difase** (urut: order date-range → migration 006 → types/reducer → CRUD UI → kalkulasi → dokumen → persistence), dirinci di plan.

## Hal untuk Dikonfirmasi saat Review
1. Event punya `pax` manual sendiri (untuk tabel Waktu & Tempat), terpisah dari pax Header — **sesuai?**
2. `price_per_pax` benar-benar dihapus dari input (hanya tampil = amount/pax) — **sesuai?**
3. Judul section tanpa angka Romawi — format pengganti: "1. / 2." atau judul polos tanpa nomor? (default: "1. / 2.")
