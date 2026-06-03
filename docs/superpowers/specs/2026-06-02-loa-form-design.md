# Design Spec — Form LoA (Letter of Agreement)

**Tanggal:** 2026-06-02
**Status:** Disetujui untuk implementasi
**Scope:** Form create/edit LoA draft (Bulan 3, bagian A). Approval, PDF, dan revisi = spec terpisah.

---

## 1. Tujuan & Konteks

LoA adalah dokumen penawaran/perjanjian harga ke klien, dibuat **dari sebuah Order** (relasi 1:1). Sales mengisi item layanan + pilihan menu, sistem menghitung harga otomatis (Service Charge, PB1, Handling Fee, Discount → Grand Total), lalu menyimpan sebagai draft.

Form ini kompleks karena tiap item bisa memuat **drill-down pemilihan menu bertingkat** (paket → komponen → kategori → item) dengan aturan pilih yang berbeda per kategori.

**Catatan schema:** Tabel DB bernama `orders` (bukan `bookings`). Kolom `loa.booking_id` me-refer `orders(id)` — sisa penamaan lama, biarkan apa adanya. Schema LoA (`loa`, `loa_items`, `loa_item_selections`) dan katalog menu (`menu_packages`, `menu_package_components`, `menu_catalog_categories`, `menu_catalog_items`) **sudah ada** di `db/migrations/001_init.sql`.

---

## 2. Pola UI: Multi-Step Wizard (4 langkah)

```
[1] Detail  →  [2] Item & Menu  →  [3] Harga  →  [4] Review
```

Stepper di atas (mengikuti pola wizard standar), dengan **panel ringkasan harga yang selalu tampil** di samping pada semua langkah — supaya sales melihat *running total* sambil menambah item, bukan baru tahu di akhir.

### Langkah 1 — Detail
- No. Order (readonly, prefill)
- Klien + PIC (prefill dari `lead_contacts` yang `is_primary = true`)
- No. Dokumen LoA (auto-generate, lihat §6)
- Lokasi setup (`loa.setup_location`)

### Langkah 2 — Item & Menu (paling kompleks)
- Daftar item (card per item: nama paket, pax, harga/pax, amount, ringkasan menu)
- Tombol "+ Tambah Item" → buka **drawer pilih menu** (lihat §3)
- Edit/hapus item per card

### Langkah 3 — Harga
- Service Charge % (default 5, **editable** oleh Sales & Cost Controller)
- Handling Fee % (default 15, **editable** oleh Sales & Cost Controller)
- PB1 — **fixed 10%, read-only**
- Discount — pilih mode **percent** atau **flat Rupiah**
- Breakdown kalkulasi live (lihat §4)

### Langkah 4 — Review & Simpan
- Ringkasan semua: detail, item + menu, breakdown harga
- Aksi: **Simpan Draft** / Batal

---

## 3. Drawer Pilih Menu (single-scroll, validasi ketat)

Muncul saat "+ Tambah Item". Struktur drill-down:

```
Paket (menu_packages)
 └ Komponen (menu_package_components, ×qty → "Sesi"/occasion_no)
    └ Kategori (menu_catalog_categories, selection_rule: one | multiple)
       └ Item (menu_catalog_items, dicentang)
```

**Perilaku:**
- Pilih paket dari dropdown. `pax` & `harga/pax` di-prefill dari `menu_packages.harga_per_pax`/`harga_minimum` (boleh override manual).
- Kalau `package.has_selection = true`: render tiap komponen. Komponen dengan `qty > 1` otomatis jadi beberapa **Sesi** (mis. Coffee Break qty=2 → Sesi 1 & Sesi 2), masing-masing dipilih terpisah (`occasion_no`).
- Tiap kategori dirender sesuai `selection_rule`: `one` = radio (pilih tepat 1), `multiple` = checkbox (pilih bebas).
- Kalau `has_selection = false`: cukup nama paket + pax + harga, tanpa drill-down.
- **Layout:** semua komponen tampil sekaligus dalam satu drawer yang bisa di-scroll (single-scroll), bukan wizard-dalam-wizard.
- Footer drawer menampilkan **preview `menu_detail`** yang ter-generate otomatis dari pilihan.

**Validasi ketat (sebelum "Simpan Item"):**
- Tiap kategori `rule=one` → harus **tepat 1** terpilih
- Tiap kategori `rule=multiple` → minimal **1** terpilih
- Selama belum terpenuhi: tombol "Simpan Item" disabled + kategori yang kurang di-highlight

**Penyimpanan:** pilihan menu di-**snapshot** ke `loa_item_selections` (`component_name`, `occasion_no`, `category_name`, `item_name`) saat draft disimpan. `loa_items.menu_detail` = teks ter-generate dari snapshot tersebut.

---

## 4. Kalkulasi Harga (fungsi murni, `lib/loa/calculations.ts`)

```
sub_total_1        = Σ (item.price_per_pax × item.pax)
service_charge_amt = sub_total_1 × sc_pct / 100              (default 5%)
sub_total_2        = sub_total_1 + service_charge_amt        ← NET REVENUE
pb1_amt            = sub_total_2 × 10%                        (fixed)
handling_fee_amt   = sub_total_2 × handling_pct / 100        (default 15%)
grand_pre_discount = sub_total_2 + pb1_amt + handling_fee_amt
discount_amt       = (type=percent) ? grand_pre_discount × discount_value/100
                                    : discount_value          (flat Rupiah)
grand_total        = grand_pre_discount − discount_amt
net_revenue        = sub_total_2                              (TIDAK terpengaruh diskon)
```

**Keputusan kunci:** diskon dipotong **dari Grand Total** (pre-discount). `net_revenue` tetap = `sub_total_2` penuh, sehingga IB & laporan P&L tidak terpengaruh diskon.

Fungsi ini murni (input → output, tanpa side-effect) dan dipakai **dua tempat**: render live di UI, dan re-kalkulasi di server action.

---

## 5. Arsitektur & State (Pendekatan A: client-state + simpan atomik)

Seluruh data wizard ditahan di **state client** (`useReducer` + context). Drawer & step menulis ke state. Tidak ada penulisan DB parsial — DB ditulis **sekali, atomik**, saat "Simpan Draft".

### Struktur file
```
features/loa/
├── components/
│   ├── loa-wizard.tsx            # orchestrator — useReducer + context provider
│   ├── loa-wizard-context.tsx    # state shape + reducer + action creators
│   ├── loa-stepper.tsx           # header 4 langkah (clickable di edit mode)
│   ├── price-summary-panel.tsx   # panel total, tampil di semua langkah
│   ├── steps/
│   │   ├── step-detail.tsx
│   │   ├── step-items.tsx
│   │   ├── step-pricing.tsx
│   │   └── step-review.tsx
│   ├── menu-drawer.tsx           # drawer pilih menu (single-scroll)
│   └── menu-selection-group.tsx  # 1 komponen/sesi → kategori → item (rule-aware)
├── hooks/
│   └── use-menu-catalog.ts       # ambil packages + components + categories + items
└── actions.ts                    # saveLoaDraft(), getLoaForEdit()

lib/loa/
├── calculations.ts               # kalkulasi harga (UNIT TESTED)
├── selection-rules.ts            # validasi one/multiple (UNIT TESTED)
├── menu-detail.ts                # generate teks menu_detail dari selections
└── doc-no.ts                     # generate nomor dokumen LoA

db/migrations/
└── 002_loa_discount.sql          # tambah kolom discount_type + discount_value
```

### State shape (ringkas)
```ts
type LoaWizardState = {
  detail: { docNo: string; setupLocation: string }
  items: LoaItemDraft[]   // tiap item: package, pax, pricePerPax, selections[]
  pricing: {
    scPct: number; handlingPct: number
    discountType: 'percent' | 'flat'; discountValue: number
  }
}
```

### Data flow
1. `page.tsx` (Server) load: order + lead + kontak primary, katalog menu, LoA existing (kalau edit) → render `<LoaWizard initialData catalog />`.
2. `LoaWizard` inisialisasi state (baru / dari LoA existing).
3. User navigasi langkah; drawer baca katalog, tulis selections ke state; `price-summary-panel` hitung live via `calculations.ts`.
4. "Simpan Draft" → `saveLoaDraft(state)` → **transaksi**:
   - re-validasi + re-kalkulasi di server (tidak percaya client)
   - upsert row `loa`
   - delete-and-reinsert `loa_items`
   - delete-and-reinsert `loa_item_selections`
   - `revalidatePath`

---

## 6. Nomor Dokumen LoA

Auto-generate mengikuti pola `order-no.ts` yang sudah ada. Format: **`LOA-YYYY-MM-DD-XXX`** (XXX = nomor urut harian dari tanggal generate, zero-padded). Unik via `loa.doc_no UNIQUE`. Di-generate server-side saat simpan pertama.

---

## 7. Validasi & Error Handling

- **Per-item (drawer):** aturan one/multiple wajib terpenuhi sebelum simpan item.
- **Per-langkah (Next):** L1 = no dokumen + order valid · L2 = ≥1 item · L3 = SC/handling 0–100 & diskon ≤ grand total.
- **Server:** `saveLoaDraft` re-validasi + re-kalkulasi pakai fungsi `lib/loa/` yang sama. Return bertipe `{ ok: boolean; error?: string }`.
- **Transaksi:** gagal → rollback (tanpa partial write) → toast error di UI.
- **RLS:** sales hanya bisa create/edit LoA untuk order miliknya (`order.sales_id = auth.uid()`), cek di policy + server.

---

## 8. Edit Mode

- Wizard sama; state di-load dari LoA existing via `getLoaForEdit()`.
- Stepper **bisa diklik** untuk loncat antar-langkah (tidak linear paksa).
- Hanya status `draft` yang editable di spec ini. `final`/`approved` → read-only. Revisi (`revision_no` baru) = spec terpisah.

---

## 9. Migrasi DB

`db/migrations/002_loa_discount.sql`:
```sql
ALTER TABLE loa
  ADD COLUMN discount_type  VARCHAR(10) NOT NULL DEFAULT 'flat'
    CHECK (discount_type IN ('percent','flat')),
  ADD COLUMN discount_value NUMERIC(15,2) NOT NULL DEFAULT 0;
-- Kolom `discount` lama tetap menyimpan hasil amount (untuk kompatibilitas/IB).
```
Dijalankan manual di Supabase SQL Editor (konvensi project).

---

## 10. Testing

- **Unit (prioritas tinggi):**
  - `calculations.ts` — SC, sub_total_2, PB1 10%, handling, diskon percent/flat, pembulatan, net_revenue tetap penuh saat diskon.
  - `selection-rules.ts` — one/multiple, kasus kosong vs terpenuhi.
  - `menu-detail.ts` — generate teks dari selections.
- **Komponen:** smoke test ringan (logika berat sudah di `lib/`).

---

## 11. Batas Scope (eksplisit)

**Termasuk:** create/edit LoA draft — detail, item, drill-down menu, kalkulasi live, simpan atomik, migrasi diskon.

**TIDAK termasuk (spec sendiri-sendiri):**
- B. Approval flow (submit → token WA/Telegram → GM approve/reject)
- C. Generate PDF + stamp tanda tangan GM
- D. Revision history LoA final

---

## 12. Follow-up Terpisah (di luar implementasi ini)

Penamaan `orders`/`order_no`/`order_status_logs` + format nomor di brief (`docs/PROJECT_BRIEF_UCR.md`) sudah dikoreksi agar sesuai schema `001_init.sql` (2026-06-03). Sisa yang masih perlu audit terpisah: jumlah tabel tertulis 16 padahal schema asli ~22 tabel (ada `loa_item_selections`, `menu_*_catalog`) — bukan bagian implementasi form LoA ini.
