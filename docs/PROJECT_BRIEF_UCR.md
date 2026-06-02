# UCR Sales Funnel — Master Project Brief

> **Cara pakai file ini:** Berikan file ini ke Claude di device manapun dan katakan _"Baca file ini dan lanjutkan project UCR Sales Funnel."_ Semua konteks, keputusan, dan requirement ada di sini.

**Perusahaan:** PT Umara Cipta Rasa (Umara Catering)  
**Project Owner:** Arnold Supriyadi (arnoldsupriyadi@gmail.com)  
**Peran Arnold:** Product Owner sekaligus sole developer  
**Status:** Dokumentasi selesai, siap masuk fase development  
**Timeline:** 6 bulan dari dokumentasi lengkap  
**Budget:** Free tier dulu (Supabase + Vercel), propose ke finance setelah working  

---

> ## ⚠️ Catatan Terminologi — "Order" vs "booking"
>
> Entitas event/pemesanan disebut **"Order"** di UI dan bahasa bisnis (hasil rename Bulan 2), tapi di **database tetap bernama tabel `bookings`**. Semua identifier teknis tidak ikut berubah: tabel `bookings`, kolom `booking_no`, tabel `booking_status_logs`, FK `booking_id`, dan format nomor `BK-2025-001`.
>
> **Aturan baca dokumen ini:** kata **"Order"** = konsep bisnis; `bookings`/`booking_*` (dalam format kode) = nama asli di schema. Keduanya merujuk entitas yang sama.
>
> Alur produk: **Lead → Order → LoA → (IB + BEO)**. Satu Order menghasilkan satu LoA (1:1).

---

## 1. Latar Belakang & Tujuan

Umara Catering adalah perusahaan jasa katering event (Coffee Break, Buffet, Fullday Meeting, Nasi Box, dll). Revenue dari event/booking, bukan penjualan produk satuan. Tim sales saat ini mengelola pipeline secara manual.

Tujuan project: membangun web dashboard untuk merapihkan flow kerja dan memudahkan pembuatan report — P&L, Top 10 Spending Account, Top Sales, MTD, Variance, Forecasting, dan Target.

**Tim Sales:**
| Sales | Jumlah Akun |
|-------|-------------|
| Agus | 338 |
| Sherli | 260 |
| Difa | 254 |
| Martin | 153 |
| Denry | 109 |
| Sonya | 74 |
| **Total** | **1,214 kontak, 465 perusahaan unik** |

---

## 2. Tech Stack (Final)

| Layer | Pilihan | Alasan |
|-------|---------|--------|
| Frontend + Backend | **Next.js 14** (App Router) | SSR, API routes dalam satu project, scalable |
| Database + Auth + Storage | **Supabase** (`mtpzxtqalqqghwokqkkf`) | Free tier, PostgreSQL, RLS bawaan, storage untuk file PDF/gambar |
| Hosting | **Vercel** | Free tier, deploy otomatis dari GitHub |
| UI Framework | **shadcn/ui** + Tailwind CSS | Komponen production-ready (Table, Dialog, Form, Tabs, dll) |
| Notifikasi approval | **WhatsApp Business API atau Telegram Bot** | Inline token link untuk approval GM |
| Dokumen Word | **npm `docx`** | Generate file .docx dari server |
| PDF stamping | **npm `pdf-lib`** | Overlay tanda tangan GM ke PDF LoA |
| Chart | **Chart.js 4.x** + react-chartjs-2 | Ringan, fleksibel |
| Form handling | **react-hook-form** + **zod** | Validasi form + type-safe schema |

---

## 3. Model Bisnis & Kalkulasi Harga

```
Pax × Harga Menu per Pax
= Sub Total 1

Sub Total 1 + Service Charge (5%)
= Sub Total 2  ← INI ADALAH NET REVENUE (dipakai IB)

Sub Total 2 + PB1 10% + Handling Fee 15%
= Grand Total  ← Yang tertera di LoA ke klien
```

**Aturan penting:**
- Revenue diakui saat status Order = **Actual** (event sudah terjadi), bukan saat pembayaran
- Tidak ada sistem deposit — hanya pelunasan + invoice
- Cancel = nilai Rp 0, tidak ada cancellation fee sebagai revenue
- PB1 (pajak 10%) — ada di kalkulasi tapi disesuaikan manual oleh Arnold

---

## 4. Order Status Flow (DB: tabel `bookings`)

```
TENTATIVE → DEFINITE → ACTUAL (happy path, terminal)
         ↘           ↘
          CANCEL       CANCEL (terminal, nilai = Rp 0)
```

- Actual tidak bisa di-cancel (event sudah terjadi)
- Setiap perubahan status dicatat di `booking_status_logs` (append-only)
- Billing Actual mengikuti pax aktual yang dilayani (bisa beda dari Definite)
- Perubahan tanggal event = revenue pindah ke bulan forecast berbeda
- Perubahan pax/menu = update nilai revenue + trigger BEO amendment + log

---

## 5. Klasifikasi (Dua Dimensi — Jangan Dicampur)

1. **Segmen** (5 nilai tetap): `Wedding` / `Private` / `Corporate` / `BUMN` / `Government`  
   → Dipakai di leads, bookings, targets, semua filter report  
   → Disimpan sebagai PostgreSQL enum `segmen_enum`

2. **Line Business**: industri perusahaan klien (Oil & Gas, Mining, Telco, IT, dll)  
   → Informasi tambahan di data leads saja

---

## 6. Roles & Permissions

4 default roles, **fully configurable** oleh Super Admin via UI (bukan hardcoded). Permissions disimpan sebagai `jsonb` di tabel `roles`.

| Role | Akses Utama |
|------|------------|
| **Super Admin** | Full access, kelola roles & permissions via UI |
| **GM** | Approve LoA, set target, lihat semua report |
| **Cost Controller** | Buat IB saja (setelah LoA Final), lihat report |
| **Sales** | Buat leads/Order/LoA/BEO, lihat data milik sendiri + report |

**Catatan implementasi:**
- Super Admin bisa tambah custom role baru via UI dengan checkbox permissions
- Sales hanya lihat leads/bookings milik sendiri (Supabase RLS `WHERE sales_id = auth.uid()`)
- GM + Super Admin lihat semua data

---

## 7. Tiga Dokumen Utama

Semua tiga dokumen menyimpan **version history lengkap** via kolom `revision_no`. Versi aktif = `MAX(revision_no)` untuk Order tersebut. Versi lama read-only untuk audit trail.

---

### 7.1 LoA (Letter of Agreement)

**Dibuat oleh:** Sales  
**Tujuan:** Dokumen penawaran/perjanjian ke klien, berisi kalkulasi harga

**Flow status:**
```
draft → pending_approval → approved/rejected → sent → final → (revised jika ada perubahan)
```

**Approval flow (6 langkah):**
1. Sales submit LoA → status: `pending_approval`
2. Sistem kirim notifikasi ke GM via WA/Telegram dengan 2 link inline:
   - `[Setuju]` → `/api/loa/approve?token=XXXX`
   - `[Tolak]` → `/api/loa/reject?token=XXXX`
3. Token: cryptographically random 64 hex chars, one-time use, ada expiry
4. GM klik link → sistem record `approved_by` + `approved_at`, token diinvalidasi
5. Sistem overlay tanda tangan GM ke PDF menggunakan `pdf-lib`
6. PDF disimpan di Supabase Storage → path di `loa.pdf_url`

**Tanda tangan (Signature Stamp):**
- GM upload foto tanda tangan (PNG/JPG) sekali ke profile (`users.signature_url`)
- `pdf-lib` overlay gambar tanda tangan + nama GM + jabatan + timestamp ke LoA PDF
- **Tidak legally binding** — hanya penanda approval internal
- Berlaku juga untuk dokumen lain yang butuh approval

**Kalkulasi LoA:**

| Field | Formula |
|-------|---------|
| `sub_total_1` | SUM(loa_items.amount) |
| `service_charge_amt` | sub_total_1 × service_charge_pct / 100 (default 5%) |
| `sub_total_2` | sub_total_1 + service_charge_amt |
| `net_revenue` | = sub_total_2 (disimpan terpisah, dipakai IB) |
| `pb1_amt` | sub_total_2 × 10% |
| `handling_fee_amt` | sub_total_2 × handling_fee_pct / 100 (default 15%) |
| `grand_total` | sub_total_2 + pb1_amt + handling_fee_amt |

---

### 7.2 IB (Internal Breakdown)

**Dibuat oleh:** Cost Controller SAJA  
**Trigger:** Hanya bisa dibuat setelah `loa.status = 'final'`  
**Tujuan:** Internal P&L per Order — bukan untuk klien

**Struktur IB:**

```
REVENUE
  Net Revenue (dari loa.net_revenue)

FOOD COST
  [Item menu 1] — pax × price_per_pax (dari master_recipes)
  [Item menu 2] — pax × price_per_pax
  ...
  Total Food Cost

OVERHEAD
  [Overhead 1] — qty × unit_price (input manual CC)
  [Overhead 2] — qty × unit_price
  ...
  Total Overhead

─────────────────────────────
Grand Total COGS = Food Cost + Overhead
Gross Profit = Net Revenue − Grand Total COGS
GP% = Gross Profit / Net Revenue × 100

[OPTIONAL — hanya tampil jika diisi]
Suggest Selling Price = [input CC]
Projected Net Revenue = suggest_price × pax × service_charge
Projected GP = Projected Net Revenue − Grand Total COGS
Projected GP% = ...
```

**Master Recipe Database:**
- File sumber: `Gabungan_Recipe_Katering.json` (282 records, 30 unique SKUs format FG-XXXX)
- 100% item menu IB bersumber dari database ini
- Saat CC tambah item menu ke IB: `price_per_pax` di-snapshot dari `master_recipes` → disimpan di `ib_food_items.price_per_pax`
- **Snapshot, bukan live** — kalau harga recipe berubah kemudian, IB lama tidak terpengaruh

**Overhead Library:**
- Tidak ada pre-seed data — tumbuh organik dari input CC
- Saat CC ketik nama item overhead baru → otomatis disimpan ke `overhead_library`
- Saat CC buka IB berikutnya → autocomplete muncul sorted by `usage_count DESC`
- Prefill `default_unit` dan `last_unit_price` dari library sebagai suggestion

**Suggest Selling Price:**
- Opsional — diisi CC kalau margin kurang bagus
- Kalau null → blok "Suggest Selling Price" disembunyikan sepenuhnya (tidak ada field kosong)
- Bukan #DIV/0! seperti Excel — sistem handle null dengan benar

---

### 7.3 BEO (Banquet Event Order)

**Dibuat oleh:** Sales  
**Tujuan:** Work order untuk tim Operasional  
**Bisa dibuat dari:** Status Tentative (tidak perlu tunggu Final seperti IB)

**Edge Case — BEO Darurat:**
- Flag `is_emergency = true`
- Diterbitkan sebelum Order mencapai Tentative (kebutuhan mendadak di lapangan)
- UI menampilkan banner peringatan ke tim Operasional
- Operasional **wajib reconfirm** sebelum eksekusi
- Flag tetap tersimpan untuk audit trail (tidak dihapus setelah reconfirm)

**Amendment system:**
- Setiap perubahan BEO = increment `revision_no` + isi `revision_reason`
- History semua revisi tersimpan, versi aktif = revision_no tertinggi

---

## 8. Database ERD — 16 Tabel

### Konvensi
- Semua PK: `uuid` (generated via `gen_random_uuid()`)
- Semua tabel ada `created_at timestamptz DEFAULT now()`
- Gunakan Supabase RLS untuk enforce akses per role
- Migration file: `docs/migration_001_init.sql` (sudah include enum, tabel, indexes, RLS, default roles, auth trigger)

---

### 8.1 `users`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | Supabase Auth user ID |
| name | varchar(100) | NOT NULL | Nama lengkap |
| email | varchar(255) | NOT NULL, UNIQUE | Email login |
| phone | varchar(20) | NULLABLE | Untuk notifikasi |
| signature_url | text | NULLABLE | Path gambar tanda tangan di Supabase Storage |
| role_id | uuid | FK → roles.id | Role yang assigned |
| is_active | boolean | DEFAULT true | Soft-disable tanpa hapus data |

### 8.2 `roles`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| name | varchar(50) | NOT NULL, UNIQUE | Nama role |
| permissions | jsonb | NOT NULL | Map module → actions. Dikelola via UI |
| is_default | boolean | DEFAULT false | True = 4 seed roles, tidak bisa dihapus |

### 8.3 `leads`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| company_name | varchar(200) | NOT NULL | Nama perusahaan/organisasi klien |
| address | text | NULLABLE | Alamat kantor atau lokasi event |
| segmen | segmen_enum | NULLABLE | Wedding/Private/Corporate/BUMN/Government |
| line_business | varchar(100) | NULLABLE | Industri klien (Banking, Oil & Gas, dll) |
| sales_id | uuid | FK → users.id | Sales pemilik lead |

> **Catatan:** PIC (kontak person) tidak lagi di tabel ini — ada di `lead_contacts` (tidak ada batas jumlah)

### 8.4 `lead_contacts`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| lead_id | uuid | FK → leads.id | Parent lead |
| name | varchar(100) | NOT NULL | Nama PIC |
| position | varchar(100) | NULLABLE | Jabatan (contoh: Manager HRD) |
| phone | varchar(20) | NULLABLE | WhatsApp preferred |
| email | varchar(255) | NULLABLE | Email |
| is_primary | boolean | DEFAULT false | True = PIC utama, auto-prefill di LoA & BEO |
| notes | text | NULLABLE | Catatan tentang kontak ini |

> **Implementasi:** Partial unique index `CREATE UNIQUE INDEX ON lead_contacts (lead_id) WHERE is_primary = true` → max 1 primary per lead. Toggle primary di UI harus auto-unset yang sebelumnya.

### 8.5 `targets`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| year | smallint | NOT NULL | Tahun target |
| month | smallint | NOT NULL | Bulan 1–12 |
| total_target | numeric(15,2) | NOT NULL | Total target revenue IDR |
| segmen | enum | NULLABLE | Jika diisi = target spesifik segmen |
| set_by | uuid | FK → users.id | GM yang set target |

### 8.6 `bookings` (UI: **Order**)
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| booking_no | varchar(30) | NOT NULL, UNIQUE | Auto-generated (contoh: BK-2025-001) |
| lead_id | uuid | FK → leads.id | Klien |
| sales_id | uuid | FK → users.id | Sales yang handle |
| status | enum | NOT NULL | tentative/definite/actual/cancel |
| event_date | date | NOT NULL | Tanggal event utama |
| event_name | varchar(200) | NOT NULL | Nama event |
| event_type | varchar(100) | NULLABLE | Jenis event (seminar, meeting, dll) |
| venue | varchar(200) | NULLABLE | Lokasi/venue |
| pax | integer | NOT NULL | Jumlah tamu/porsi |
| segmen | segmen_enum | NULLABLE | Wedding/Private/Corporate/BUMN/Government |
| is_exception | boolean | DEFAULT false | True = bypass approval standar |
| exception_reason | text | NULLABLE | Wajib diisi jika is_exception = true |
| exception_approved_by | uuid | FK → users.id, NULLABLE | GM yang approve exception |
| updated_at | timestamptz | DEFAULT now() | Auto-update via trigger |

### 8.7 `booking_status_logs`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| booking_id | uuid | FK → bookings.id | |
| from_status | enum | NULLABLE | Null = status pertama kali |
| to_status | enum | NOT NULL | Status baru |
| changed_by | uuid | FK → users.id | User yang ubah status |
| note | text | NULLABLE | Alasan perubahan (wajib untuk Cancel) |

> Append-only — jangan pernah delete baris dari tabel ini.

### 8.8 `loa`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| booking_id | uuid | FK → bookings.id, UNIQUE | 1:1 dengan Order |
| doc_no | varchar(50) | NOT NULL | Nomor dokumen LoA |
| revision_no | smallint | DEFAULT 0 | 0 = original, naik setiap revisi |
| revision_reason | text | NULLABLE | Wajib diisi jika revision_no > 0 |
| status | enum | NOT NULL | draft/pending_approval/approved/rejected/sent/final/revised |
| service_charge_pct | numeric(5,2) | DEFAULT 5.00 | |
| handling_fee_pct | numeric(5,2) | DEFAULT 15.00 | |
| discount | numeric(15,2) | DEFAULT 0 | |
| sub_total_1 | numeric(15,2) | NOT NULL | SUM loa_items |
| service_charge_amt | numeric(15,2) | NOT NULL | sub_total_1 × sc_pct |
| sub_total_2 | numeric(15,2) | NOT NULL | sub_total_1 + sc_amt |
| pb1_amt | numeric(15,2) | NOT NULL | sub_total_2 × 10% |
| handling_fee_amt | numeric(15,2) | NOT NULL | sub_total_2 × hf_pct |
| grand_total | numeric(15,2) | NOT NULL | sub_total_2 + pb1 + hf |
| net_revenue | numeric(15,2) | NOT NULL | = sub_total_2, disimpan terpisah untuk IB |
| approved_by | uuid | FK → users.id, NULLABLE | GM approver |
| approved_at | timestamptz | NULLABLE | Waktu approval |
| approval_token | varchar(64) | NULLABLE, UNIQUE | One-time token WA/Telegram |
| token_expires_at | timestamptz | NULLABLE | Token expired setelah dipakai atau lewat waktu |
| pdf_url | text | NULLABLE | Path PDF bertanda tangan di Supabase Storage |
| created_by | uuid | FK → users.id | Sales pembuat |

### 8.9 `loa_items`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| loa_id | uuid | FK → loa.id | Parent LoA |
| order_date | date | NOT NULL | Tanggal layanan ini |
| package_name | varchar(200) | NOT NULL | Nama paket/layanan |
| menu_detail | text | NULLABLE | Deskripsi menu opsional |
| price_per_pax | numeric(12,2) | NOT NULL | Harga jual per pax |
| pax | integer | NOT NULL | Jumlah pax |
| amount | numeric(15,2) | NOT NULL | price_per_pax × pax |
| sort_order | smallint | DEFAULT 0 | Urutan tampil |

### 8.10 `ib`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| loa_id | uuid | FK → loa.id, UNIQUE | 1:1 dengan LoA |
| revision_no | smallint | DEFAULT 0 | Ikuti revisi LoA |
| revision_reason | text | NULLABLE | |
| total_food_cost | numeric(15,2) | NOT NULL | SUM ib_food_items |
| total_overhead | numeric(15,2) | NOT NULL | SUM ib_overhead_items |
| grand_total_cogs | numeric(15,2) | NOT NULL | food + overhead |
| gross_profit | numeric(15,2) | NOT NULL | net_revenue − cogs |
| gp_pct | numeric(5,2) | NOT NULL | gross_profit / net_revenue × 100 |
| suggest_price | numeric(12,2) | NULLABLE | Jika null → blok hidden |
| suggest_net_revenue | numeric(15,2) | NULLABLE | Proyeksi di suggest_price |
| suggest_gp | numeric(15,2) | NULLABLE | |
| suggest_gp_pct | numeric(5,2) | NULLABLE | |
| created_by | uuid | FK → users.id | Harus Cost Controller — enforce di API |

### 8.11 `ib_food_items`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| ib_id | uuid | FK → ib.id | |
| recipe_id | uuid | FK → master_recipes.id | Source recipe |
| menu_name | varchar(200) | NOT NULL | Snapshot nama saat IB dibuat |
| pax | integer | NOT NULL | |
| price_per_pax | numeric(12,4) | NOT NULL | **Snapshot** dari master_recipes saat dibuat |
| total | numeric(15,2) | NOT NULL | price_per_pax × pax |
| pct_of_revenue | numeric(5,2) | NOT NULL | total / net_revenue × 100 |
| sort_order | smallint | DEFAULT 0 | |

### 8.12 `ib_overhead_items`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| ib_id | uuid | FK → ib.id | |
| item_name | varchar(200) | NOT NULL | Nama overhead |
| qty | numeric(10,2) | NOT NULL | |
| unit | varchar(30) | NOT NULL | unit/hari/trip/dll |
| unit_price | numeric(12,2) | NOT NULL | |
| total | numeric(15,2) | NOT NULL | qty × unit_price |
| pct_of_revenue | numeric(5,2) | NOT NULL | total / net_revenue × 100 |

### 8.13 `beo`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| loa_id | uuid | FK → loa.id, UNIQUE | 1:1 dengan LoA |
| beo_no | varchar(30) | NOT NULL, UNIQUE | Nomor BEO |
| revision_no | smallint | DEFAULT 0 | Naik setiap amendment |
| revision_reason | text | NULLABLE | Wajib jika revision_no > 0 |
| is_emergency | boolean | DEFAULT false | BEO Darurat — Ops wajib reconfirm |
| person_incharge | varchar(100) | NOT NULL | PIC Operasional |
| setup_date | date | NULLABLE | Tanggal setup (bisa beda dari event_date) |
| setup_time | time | NULLABLE | Jam tim Ops harus tiba |
| table_arrangement | varchar(100) | NULLABLE | Theatre/Classroom/Round Table/dll |
| banquet_notes | text | NULLABLE | Instruksi khusus untuk banquet/food |
| transport_notes | text | NULLABLE | Catatan logistik/transportasi |
| total_billing | numeric(15,2) | NOT NULL | Dari loa.grand_total |
| payment_status | enum | NOT NULL | progress/paid/overdue/dp_only |
| created_by | uuid | FK → users.id | Sales pembuat |

### 8.14 `master_recipes`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| sku | varchar(20) | NOT NULL, UNIQUE | Kode SKU (FG-0001 dst) |
| product_name | varchar(200) | NOT NULL | Nama produk lengkap |
| menu_structure | varchar(100) | NULLABLE | BUFFET/PRASMANAN/NASI BOX/dll |
| segment_menu | varchar(100) | NULLABLE | Segmen target (CORPORATE/HDM/dll) |
| unit_size | varchar(50) | NULLABLE | Deskripsi unit/paket |
| uom | varchar(20) | NULLABLE | PORSI/BOX/dll |
| price_per_pax | numeric(12,4) | NOT NULL | **Harga cost per pax** — source food cost IB |
| is_active | boolean | DEFAULT true | False = hidden dari dropdown IB, data tetap |
| updated_at | timestamptz | DEFAULT now() | Auto-update via trigger |

### 8.15 `overhead_library`
| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| item_name | varchar(200) | NOT NULL, UNIQUE | Nama item overhead |
| default_unit | varchar(30) | NULLABLE | Unit terakhir dipakai (prefill suggestion) |
| last_unit_price | numeric(12,2) | NULLABLE | Harga terakhir (prefill suggestion) |
| usage_count | integer | DEFAULT 0 | Makin tinggi = makin atas di autocomplete |
| updated_at | timestamptz | DEFAULT now() | |

### 8.16 `menu_packages`
> Dropdown paket menu di form LoA. Pre-seeded 25 paket dari Katalog_Umum_Umara.csv.

| Field | Type | Constraint | Keterangan |
|-------|------|-----------|-----------|
| id | uuid | PK | |
| kategori | varchar(100) | NOT NULL | Buffet / Meal Box / Meeting Package / Snack Box & Kue Tampah / Stall (Gubukan) |
| nama_paket | varchar(200) | NOT NULL | Nama paket (e.g., Indonesian Buffet, Full Day - Asian Buffet) |
| harga_minimum | numeric(15,2) | NULLABLE | Harga jual minimum per satuan dalam IDR |
| harga_maksimum | numeric(15,2) | NULLABLE | Harga jual maksimum. NULL jika harga tunggal. |
| satuan | varchar(50) | NOT NULL | per pax / per box / per tampah / per tumpeng / dll |
| ketentuan | text | NULLABLE | Syarat paket (e.g., Min order Rp 12.000.000) |
| is_active | boolean | DEFAULT true | False = tidak muncul di dropdown LoA |
| created_at | timestamptz | DEFAULT now() | |

**Catatan implementasi:**
- Sales pilih paket dari dropdown → `harga_minimum` auto-fill sebagai `price_per_pax` di loa_items (bisa override manual)
- Tidak ada FK ke `master_recipes` — relasi 1 paket → banyak resep ditambah di fase 2 jika dibutuhkan
- Harga di loa_items **selalu snapshot** — bukan live dari menu_packages

---

## 9. Relationship Matrix

| From | To | Cardinality | Keterangan |
|------|----|------------|-----------|
| leads | lead_contacts | 1 : N | Unlimited PIC per lead |
| leads | bookings | 1 : N | Satu klien bisa banyak Order |
| bookings | loa | 1 : 1 | Satu Order = satu LoA |
| loa | loa_items | 1 : N | LoA bisa banyak line item |
| loa | ib | 1 : 1 | Satu LoA = satu IB |
| loa | beo | 1 : 1 | Satu LoA = satu BEO |
| ib | ib_food_items | 1 : N | IB bisa banyak menu item |
| ib | ib_overhead_items | 1 : N | IB bisa banyak overhead item |
| master_recipes | ib_food_items | 1 : N | Satu recipe bisa dipakai banyak IB |
| bookings | booking_status_logs | 1 : N | Full audit trail status |
| users | roles | N : 1 | Banyak user berbagi satu role |

---

## 10. Reporting Dashboard

6 tab interaktif. Filter global: per bulan, per sales, per segmen.

### Tab 1 — P&L (Profit & Loss)
- Kolom: Order, Klien, Sales, Event Date, Pax, Net Revenue, Food Cost, Overhead, GP, GP%
- Row total di bawah
- Chart: Bar chart Net Revenue vs COGS per bulan
- Export: Excel + PDF

### Tab 2 — Top 10 Spending Accounts
- Ranking klien berdasarkan total Net Revenue (Actual)
- Kolom: Rank, Perusahaan, Segmen, Jumlah Event, Total Revenue, GP Rata-rata
- Chart: Horizontal bar chart
- Export: Excel + PDF

### Tab 3 — Top Sales
- Ranking sales berdasarkan total revenue Actual
- Kolom: Rank, Sales, Jumlah Order, Total Revenue, GP Total, Rata-rata GP%
- Chart: Bar chart per sales

### Tab 4 — MTD (Month to Date)
- Progress bulan berjalan vs target
- Kolom: Sales, Target (share), Actual MTD, % Achievement, Sisa
- Chart: Gauge / progress bar per sales
- Update real-time saat Order berubah ke Actual

### Tab 5 — Variance
- Perbandingan plan (Definite) vs actual (Actual) per bulan
- Kolom: Bulan, Total Definite, Total Actual, Selisih, Variance%
- Chart: Line chart plan vs actual

### Tab 6 — Forecasting
- Proyeksi revenue bulan-bulan ke depan berdasarkan pipeline
- Kolom: Bulan, Tentative, Definite, Projected Revenue, Target, Gap
- Chart: Stacked bar + line target

---

## 11. Aturan Implementasi Kritis

Semua aturan ini wajib di-enforce di level API/server-action, bukan hanya UI.

1. **IB hanya oleh Cost Controller** — cek role di server-side sebelum create/update IB
2. **IB hanya setelah LoA Final** — block endpoint jika `loa.status ≠ 'final'`
3. **Food cost snapshot** — saat add recipe ke IB, copy `price_per_pax` ke `ib_food_items`. Jangan recalculate dari live recipe saat IB dibuka kembali
4. **Overhead Library auto-grow** — saat CC save overhead item baru, upsert ke `overhead_library` + increment `usage_count`
5. **Suggest Selling Price null = blok hidden** — jangan tampilkan field kosong atau error
6. **Approval token** — `crypto.randomBytes(32).toString('hex')`, one-time use, invalidate setelah klik atau expired
7. **Signature stamp pdf-lib** — overlay `users.signature_url` + nama + jabatan + timestamp ke LoA PDF setelah approved. Simpan ke Supabase Storage
8. **BEO Darurat** — `is_emergency = true` → banner warning di UI Ops. Flag tidak dihapus setelah reconfirm
9. **Order status transitions** — hanya enforce: tentative→definite, definite→actual, tentative/definite→cancel. Log semua ke `booking_status_logs`
10. **lead_contacts primary** — partial unique index: `CREATE UNIQUE INDEX ON lead_contacts (lead_id) WHERE is_primary = true`. Toggle di UI harus auto-unset previous primary
11. **LoA/BEO PIC prefill** — ambil dari `lead_contacts WHERE is_primary = true` untuk default PIC
12. **Supabase RLS** — Sales: `WHERE sales_id = auth.uid()`. GM + Super Admin: lihat semua. Cost Controller: read LoA, write IB
13. **Version history** — LoA, IB, BEO pakai `revision_no`. Active = max(revision_no). Versi lama read-only
14. **Billing Actual** — mengikuti pax aktual saat event (bisa beda dari Definite), update di `bookings` saat status → Actual
15. **Revenue recognition** — hanya status Actual yang masuk kalkulasi achievement vs target dan P&L

---

## 12. Struktur Folder & File

```
UCR-SALES-FUNNEL/
├── docs/                          ← semua dokumentasi ada di sini
│   ├── PROJECT_BRIEF_UCR.md       ← file ini, baca pertama kali
│   ├── DEVELOPMENT_GUIDE.md       ← setup Next.js, shadcn, folder structure, roadmap 6 bulan
│   ├── migration_001_init.sql     ← DDL 16 tabel + RLS + roles. Jalankan pertama di Supabase
│   ├── seeder.sql                 ← master_recipes (30 SKU) + menu_packages (25 paket)
│   ├── seeder_leads.sql           ← 1,054 leads + 1,079 lead_contacts dari data sales
│   ├── BRD_Sales_Dashboard_UCR_v3.docx
│   ├── ERD_UCR_v1.docx            ← ERD 16 tabel lengkap
│   ├── LoA_Struktur_Requirements_UCR_v1.docx
│   ├── IB_Struktur_Requirements_UCR_v1.docx
│   ├── BEO_Struktur_Requirements_UCR_v1.docx
│   ├── Permission_Matrix_UCR_v1.docx
│   ├── Format_Reporting_UCR_v1.docx
│   └── flowchart_ucr_v2.png
│
└── ucr-sales-funnel/              ← Next.js project (dibuat saat development mulai)
    ├── src/
    ├── package.json
    └── ...
```

**Urutan jalankan SQL di Supabase SQL Editor:**
1. `migration_001_init.sql` → create semua tabel, enum, RLS, default roles
2. `seeder.sql` → master_recipes + menu_packages
3. `seeder_leads.sql` → leads + lead_contacts (1,054 records)
4. Set Super Admin: `UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'Super Admin') WHERE email = 'arnoldsupriyadi@gmail.com';`

**File yang sudah dihapus:**
- `BRD_PRD_Sales_Dashboard_UCR.pdf` — v1.0, sudah tidak berlaku
- `BRD_Sales_Dashboard_UCR_v2.docx` — digantikan v3.0
- `flowchart_umara.png` — digantikan flowchart_ucr_v2.png

---

## 13. Cara Lanjutkan di Device Lain (Claude Code)

Buka folder `UCR-SALES-FUNNEL/docs/` di Claude Code, lalu ketik:

> *"Baca file PROJECT_BRIEF_UCR.md dan DEVELOPMENT_GUIDE.md, lalu lanjutkan development UCR Sales Funnel."*

Claude Code akan langsung paham konteks penuh tanpa perlu penjelasan ulang.

**Kalau ada perubahan requirement:**
1. Update `PROJECT_BRIEF_UCR.md` dulu (section yang relevan)
2. Kalau ada perubahan schema → buat `migration_002_nama_perubahan.sql` (jangan edit migration_001)
3. Kalau ada perubahan fitur → update section yang relevan di brief ini

---

*Terakhir diupdate: 25 Mei 2026 — Arnold Supriyadi / PT Umara Cipta Rasa*
