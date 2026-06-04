# Tipe Order & Pricing LoA — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: gunakan superpowers:subagent-driven-development atau superpowers:executing-plans untuk implementasi task-by-task. Step pakai checkbox (`- [ ]`).

**Goal:** Tambah Tipe Order (Package/Event) + kategori pada Order yang menentukan Service Charge LoA; ubah `calculateLoa` (diskon dari Sub Total 1, handling flat/percent); jadikan Service Charge LoA read-only mengikuti tipe order; ubah tampilan "Item Layanan" jadi heading + list.

**Spec:** `docs/superpowers/specs/2026-06-04-order-type-pricing.md` (delta dari `2026-06-02-loa-form-design.md`).

**Tech Stack:** Next.js 16 (App Router, Server Actions), Supabase, shadcn/ui, Vitest, TypeScript.

---

## Catatan Konvensi (baca sebelum mulai)

- SQL dijalankan **manual** di Supabase SQL Editor (file migration berurutan; jangan reset, jangan edit file yang sudah dijalankan — strategi UAT di `DEVELOPMENT_GUIDE.md`).
- Server client: `import { createClient } from '@/lib/supabase/server'` → `await createClient()`.
- Auth/izin: `await getAppUser()`; cek `user.permissions[...]`.
- Server action return `ActionResult<T>` dari `@/types/domain`.
- Tes `*.test.ts` bersebelahan dengan sumber di `lib/`.
- Reducer LoA ada di `features/loa/loa-form-reducer.ts` (tipe `LoaFormAction`); context di `features/loa/loa-form-context.tsx` (`LoaFormProvider` menerima `initialPricing`).
- Form order: `features/orders/components/order-form.tsx`; action `createOrder`/`updateOrder` di `features/orders/actions.ts`.
- Route order: detail `app/(dashboard)/orders/[id]/page.tsx`, baru `.../orders/new`, edit `.../orders/[id]/edit`, LoA `.../orders/[id]/loa`.

---

## FASE 0 — Schema & Konstanta

### Task 1: Migration 004 — kolom order_type/order_category + handling fee flat/percent

**Files:**
- Create: `db/migrations/004_order_type_handling.sql`
- Modify: `types/database.ts` (tabel `orders` + `loa`: Row/Insert/Update)

- [ ] **Step 1: Tulis migration**

Create `db/migrations/004_order_type_handling.sql`:
```sql
-- 1) Tipe & kategori order (klasifikasi + penentu service charge)
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

- [ ] **Step 2: Jalankan di Supabase** → SQL Editor → paste → Run. Expected: "Success. No rows returned".

- [ ] **Step 3: Update `types/database.ts`**
  - `orders` → `Row`: `order_type: string | null`, `order_category: string | null`. `Insert`/`Update`: keduanya `?: string | null`.
  - `loa` → `Row`: `handling_fee_type: string`, `handling_fee_value: number`. `Insert`/`Update`: keduanya optional.

- [ ] **Step 4: Typecheck** — `npx tsc --noEmit` (abaikan error stale `.next/`).

- [ ] **Step 5: Commit**
```bash
git add db/migrations/004_order_type_handling.sql types/database.ts
git commit -m "feat(db): migration 004 — order_type/category + handling fee flat/percent"
```

---

### Task 2: Konstanta tipe order + helper Service Charge (TDD)

**Files:**
- Create: `lib/constants/order-type.ts`
- Test: `lib/constants/order-type.test.ts`

- [ ] **Step 1: Tulis tes yang gagal**

Create `lib/constants/order-type.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import {
  ORDER_TYPES, ORDER_TYPE_KEYS, serviceChargePctForType, categoriesForType,
} from './order-type'

describe('order-type konstanta', () => {
  it('Package SC 5, Event SC 10', () => {
    expect(serviceChargePctForType('Package')).toBe(5)
    expect(serviceChargePctForType('Event')).toBe(10)
  })
  it('tipe tak dikenal / null → 0', () => {
    expect(serviceChargePctForType(null)).toBe(0)
    expect(serviceChargePctForType('Xxx' as never)).toBe(0)
  })
  it('kategori per tipe', () => {
    expect(categoriesForType('Package')).toEqual(['Box Package', 'Gift Box'])
    expect(categoriesForType('Event')).toContain('Canape')
    expect(categoriesForType(null)).toEqual([])
  })
  it('hanya 2 tipe', () => {
    expect(ORDER_TYPE_KEYS).toEqual(['Package', 'Event'])
    expect(Object.keys(ORDER_TYPES)).toHaveLength(2)
  })
})
```

- [ ] **Step 2: Jalankan — pastikan gagal** — `npx vitest run lib/constants/order-type.test.ts`.

- [ ] **Step 3: Implementasi**

Create `lib/constants/order-type.ts`:
```ts
export type OrderTypeKey = 'Package' | 'Event'

export const ORDER_TYPES: Record<OrderTypeKey, { label: string; scPct: number; categories: string[] }> = {
  Package: {
    label: 'Package Order',
    scPct: 5,
    categories: ['Box Package', 'Gift Box'],
  },
  Event: {
    label: 'Event Order',
    scPct: 10,
    categories: ['Meeting / Open House', 'Buffet & Stall', 'Coffee Break / Takjil', 'Canape', 'Set Menu'],
  },
}

export const ORDER_TYPE_KEYS = Object.keys(ORDER_TYPES) as OrderTypeKey[]

export function serviceChargePctForType(type: string | null | undefined): number {
  if (type && type in ORDER_TYPES) return ORDER_TYPES[type as OrderTypeKey].scPct
  return 0
}

export function categoriesForType(type: string | null | undefined): string[] {
  if (type && type in ORDER_TYPES) return ORDER_TYPES[type as OrderTypeKey].categories
  return []
}
```

> Catatan: "isi" tiap kategori (Nasi/Snack/… , Tumpeng/Bakul/…) **tidak** dimodelkan — hanya keterangan, tidak dipilih/disimpan (spec §2).

- [ ] **Step 4: Jalankan — pastikan lulus** — `npx vitest run lib/constants/order-type.test.ts`.

- [ ] **Step 5: Commit**
```bash
git add lib/constants/order-type.ts lib/constants/order-type.test.ts
git commit -m "feat(orders): konstanta tipe order + helper service charge (tested)"
```

---

## FASE 1 — Kalkulasi (TDD, mengubah logika inti)

### Task 3: Ubah `calculateLoa` ke urutan baru

**Files:**
- Modify: `lib/loa/calculations.ts`
- Modify: `lib/loa/calculations.test.ts`

- [ ] **Step 1: Ganti tes ke urutan baru (pastikan gagal dulu)**

Ganti `lib/loa/calculations.test.ts` agar mencerminkan spec §4. Tambahkan `handlingType` ke `LoaPricingInput`. Kasus wajib:
```ts
import { describe, it, expect } from 'vitest'
import { calculateLoa, PB1_PCT } from './calculations'

const items = [{ pricePerPax: 100000, pax: 100 }] // sub_total_1 = 10.000.000

describe('calculateLoa (urutan baru: diskon dari Sub Total 1)', () => {
  it('Event SC 10%, diskon flat 1jt, handling 5% persen', () => {
    const r = calculateLoa(items, {
      scPct: 10, handlingType: 'percent', handlingValue: 5,
      discountType: 'flat', discountValue: 1000000,
    })
    expect(r.subTotal1).toBe(10000000)
    expect(r.discountAmt).toBe(1000000)
    expect(r.serviceChargeAmt).toBe(900000)   // 10% × 9.000.000
    expect(r.subTotal2).toBe(9900000)
    expect(r.netRevenue).toBe(9900000)        // = sub_total_2 (setelah diskon)
    expect(r.pb1Amt).toBe(990000)
    expect(r.handlingFeeAmt).toBe(495000)     // 5% × 9.900.000
    expect(r.grandTotal).toBe(11385000)
  })

  it('diskon persen = % dari SUB TOTAL 1', () => {
    const r = calculateLoa(items, {
      scPct: 5, handlingType: 'percent', handlingValue: 15,
      discountType: 'percent', discountValue: 10,
    })
    expect(r.discountAmt).toBe(1000000)       // 10% × 10.000.000
  })

  it('handling flat dipakai langsung (bukan persen)', () => {
    const r = calculateLoa(items, {
      scPct: 5, handlingType: 'flat', handlingValue: 250000,
      discountType: 'flat', discountValue: 0,
    })
    expect(r.handlingFeeAmt).toBe(250000)
  })

  it('diskon di-clamp ke [0, subTotal1]', () => {
    const r = calculateLoa(items, {
      scPct: 5, handlingType: 'percent', handlingValue: 0,
      discountType: 'flat', discountValue: 99999999,
    })
    expect(r.discountAmt).toBe(10000000)
    expect(r.subTotal2).toBe(0)               // dpp 0 → SC 0 → ST2 0
  })

  it('PB1 konstan 10%', () => { expect(PB1_PCT).toBe(10) })
})
```

- [ ] **Step 2: Jalankan — pastikan gagal** — `npx vitest run lib/loa/calculations.test.ts`.

- [ ] **Step 3: Implementasi urutan baru**

Ganti isi `lib/loa/calculations.ts`:
```ts
export const PB1_PCT = 10

export interface LoaCalcItem { pricePerPax: number; pax: number }

export interface LoaPricingInput {
  scPct: number
  handlingType: 'percent' | 'flat'
  handlingValue: number
  discountType: 'percent' | 'flat'
  discountValue: number
}

export interface LoaCalcResult {
  subTotal1: number
  discountAmt: number
  dppAfterDiscount: number
  serviceChargeAmt: number
  subTotal2: number
  pb1Amt: number
  handlingFeeAmt: number
  grandTotal: number
  netRevenue: number
}

function round2(n: number): number { return Math.round(n * 100) / 100 }

export function calculateLoa(items: LoaCalcItem[], pricing: LoaPricingInput): LoaCalcResult {
  const subTotal1 = round2(items.reduce((s, i) => s + i.pricePerPax * i.pax, 0))

  const rawDiscount = pricing.discountType === 'percent'
    ? round2((subTotal1 * pricing.discountValue) / 100)
    : pricing.discountValue
  const discountAmt = round2(Math.min(Math.max(rawDiscount, 0), subTotal1))

  const dppAfterDiscount = round2(subTotal1 - discountAmt)
  const serviceChargeAmt = round2((dppAfterDiscount * pricing.scPct) / 100)
  const subTotal2 = round2(dppAfterDiscount + serviceChargeAmt)
  const pb1Amt = round2((subTotal2 * PB1_PCT) / 100)

  const handlingFeeAmt = pricing.handlingType === 'percent'
    ? round2((subTotal2 * pricing.handlingValue) / 100)
    : round2(Math.max(pricing.handlingValue, 0))

  return {
    subTotal1,
    discountAmt,
    dppAfterDiscount,
    serviceChargeAmt,
    subTotal2,
    pb1Amt,
    handlingFeeAmt,
    grandTotal: round2(subTotal2 + pb1Amt + handlingFeeAmt),
    netRevenue: subTotal2,
  }
}
```

- [ ] **Step 4: Jalankan — pastikan lulus** — `npx vitest run lib/loa/calculations.test.ts`.

- [ ] **Step 5: Commit**
```bash
git add lib/loa/calculations.ts lib/loa/calculations.test.ts
git commit -m "feat(loa): urutan kalkulasi baru — diskon dari ST1, handling flat/percent"
```

---

## FASE 2 — Tipe State LoA

### Task 4: Update `LoaPricingDraft` + reducer

**Files:**
- Modify: `features/loa/types.ts`
- Modify: `features/loa/loa-form-reducer.ts`

- [ ] **Step 1: Ubah `LoaPricingDraft` & `DEFAULT_PRICING`** (`features/loa/types.ts`):
```ts
export interface LoaPricingDraft {
  scPct: number                 // read-only di UI, diturunkan dari tipe order
  handlingType: 'percent' | 'flat'
  handlingValue: number
  discountEnabled: boolean
  discountType: 'percent' | 'flat'
  discountValue: number
}

export const DEFAULT_PRICING: LoaPricingDraft = {
  scPct: 5,
  handlingType: 'percent',
  handlingValue: 15,
  discountEnabled: false,
  discountType: 'flat',
  discountValue: 0,
}
```
(Hapus `handlingPct`. Sesuaikan `SavedLoaDraft` bila merujuk field lama.)

- [ ] **Step 2: Update reducer** (`features/loa/loa-form-reducer.ts`): pastikan `SET_PRICING_FIELD` menerima `field: keyof LoaPricingDraft` (sudah generik); tambah penanganan toggle handling bila perlu (mis. set default saat ganti `handlingType`). Tidak ada perubahan struktural besar.

- [ ] **Step 3: Typecheck** — `npx tsc --noEmit`. Perbaiki referensi `handlingPct` yang error (akan muncul di `step-pricing.tsx`, `actions.ts` — diperbaiki di task berikut; di sini cukup pastikan `types`/`reducer` konsisten).

- [ ] **Step 4: Commit**
```bash
git add features/loa/types.ts features/loa/loa-form-reducer.ts
git commit -m "feat(loa): pricing draft — handlingType/value, scPct read-only"
```

---

## FASE 3 — UI Order (tipe + kategori)

### Task 5: Order form — pilih Tipe Order + kategori (cascading)

**Files:**
- Modify: `features/orders/components/order-form.tsx`
- Modify: `features/orders/actions.ts` (payload `createOrder`/`updateOrder`)

**Tanggung jawab:** tambah seksi "Tipe Order" sebelum/di dalam Detail Event. Dua kontrol: Tipe (Package/Event) → saat berubah, daftar Kategori di-refresh dari `categoriesForType(type)` dan kategori di-reset. Keduanya wajib untuk order baru.

- [ ] **Step 1: State + UI**
  - Tambah `const [orderType, setOrderType] = useState(order?.order_type ?? '')` dan `const [orderCategory, setOrderCategory] = useState(order?.order_category ?? '')`.
  - Render pilihan Tipe (mis. dua tombol/RadioGroup atau `Combobox` dari `ORDER_TYPE_KEYS` dengan label `ORDER_TYPES[k].label`). `onChange` tipe → `setOrderType(v); setOrderCategory('')`.
  - Render Kategori (`Combobox`/RadioGroup) dari `categoriesForType(orderType)`; disabled bila tipe kosong.
  - Tampilkan hint SC: "Service Charge: {serviceChargePctForType(orderType)}%".
  - **Hapus field "Jenis Event" (`event_type`) dari form** (keputusan 4 Juni 2026): hapus input + state `eventType`/`setEventType`. Kolom DB tetap; tidak lagi diisi via form. **Pertahankan** field "Nama Event" (`event_name`).
  - Validasi: `orderType` wajib; `orderCategory` wajib bila tipe terpilih. Tambah ke `validate()` + `FIELD_LABELS`.
- [ ] **Step 2: Payload** — tambah `order_type: orderType || null`, `order_category: orderCategory || null` ke objek `payload`; **hapus `event_type` dari payload**. Update tipe payload `createOrder`/`updateOrder` di `features/orders/actions.ts` (terima dua field baru; `event_type` tak lagi dikirim — kolom tetap ada di DB, nilainya tidak diubah saat update).
- [ ] **Step 3: Typecheck + lint** — `npx tsc --noEmit && npm run lint`.
- [ ] **Step 4: Commit** — `git commit -m "feat(orders): pilih tipe order + kategori (cascading) di form"`

---

### Task 6: Order detail — tampilkan tipe/kategori + bisa ganti

**Files:**
- Modify: `app/(dashboard)/orders/[id]/page.tsx` (tampilkan Tipe/Kategori + SC)
- (Pakai ulang form/edit yang sudah ada untuk ganti)

**Tanggung jawab:** di halaman detail order, tampilkan Tipe Order, Kategori, dan Service Charge (`serviceChargePctForType`). "Bisa diganti" terpenuhi via tombol **Edit** yang sudah ada (`/orders/[id]/edit` memakai `OrderForm` dari Task 5, kini sudah ada field tipe/kategori). Pastikan halaman edit meneruskan `order` lengkap (sudah, karena `OrderForm` menerima `order`).

- [ ] **Step 1:** Tambah baris "Tipe Order", "Kategori", "Service Charge" pada blok info order di detail page. Bila `order_type` null → tampilkan badge "Belum diisi" + ajakan edit.
- [ ] **Step 2: Typecheck** — `npx tsc --noEmit`.
- [ ] **Step 3: Commit** — `git commit -m "feat(orders): tampilkan tipe/kategori/service charge di detail order"`

---

## FASE 4 — UI LoA (SC read-only, handling, item heading+list)

### Task 7: Step Harga — SC read-only + toggle handling persen/flat

**Files:**
- Modify: `features/loa/components/step-pricing.tsx`

**Tanggung jawab:**
- Service Charge: ubah dari `Input` editable jadi **read-only** menampilkan `pricing.scPct%` dengan keterangan "mengikuti Tipe Order".
- Handling Fee: tambah `RadioGroup` `percent | flat` (pola sama dengan diskon) + 1 `Input` `handlingValue`. Dispatch `SET_PRICING_FIELD` untuk `handlingType` & `handlingValue`.
- PB1 tetap read-only 10%; diskon tetap (urutan baru sudah ditangani di kalkulasi).

- [ ] **Step 1: Implementasi** (hapus referensi `handlingPct`).
- [ ] **Step 2: Typecheck** — `npx tsc --noEmit`.
- [ ] **Step 3: Commit** — `git commit -m "feat(loa): step Harga — SC read-only + handling persen/flat"`

---

### Task 8: Service Charge mengalir dari Order ke LoA

**Files:**
- Modify: `app/(dashboard)/orders/[id]/loa/page.tsx` (prefill `initialPricing.scPct`)
- Modify: panel ringkasan harga bila menampilkan label SC (opsional)

**Tanggung jawab:** saat render form LoA, `scPct` awal = `serviceChargePctForType(order.order_type)`. Bila order belum punya tipe → tampilkan peringatan & arahkan isi tipe order dulu (form tetap boleh dibuka, tapi SC 0 / blok simpan di server).

- [ ] **Step 1:** Di `loa/page.tsx`, ambil `order.order_type`, hitung `scPct = serviceChargePctForType(order.order_type)`, masukkan ke `initialPricing` (gabung dengan pricing dari `getLoaForEdit` bila edit — SC selalu di-override dari tipe order, bukan dari LoA tersimpan).
- [ ] **Step 2: Typecheck** — `npx tsc --noEmit`.
- [ ] **Step 3: Commit** — `git commit -m "feat(loa): service charge mengalir dari tipe order ke form LoA"`

---

### Task 9: Item Layanan — rendering heading + list (FORM saja)

**Files:**
- Create: `lib/loa/menu-detail-lines.ts` + test
- Modify: `features/loa/components/step-items.tsx`

**Tanggung jawab:** ubah tampilan **di form** dari teks sebaris (`generateMenuDetail`) menjadi **heading (packageName + harga) + daftar menu** (nama item, tanpa harga). `generateMenuDetail` (string) **tetap dipertahankan** untuk mengisi kolom `loa_items.menu_detail`.

> **Scope:** section rincian item di **PDF/`doc-preview.tsx` DITUNDA** ke spec generate-PDF terpisah (keputusan 4 Juni 2026). Saat ini section item di preview memang belum ada — tidak dibangun di plan ini. Hanya tampilan form (`step-items.tsx`) yang diubah.

- [ ] **Step 1: Helper (TDD)** — `lib/loa/menu-detail-lines.ts`: `groupSelectionLines(selections)` → array baris untuk list. Aturan: kelompokkan per `componentName`+`occasionNo` (beri nomor sesi bila >1 occasion, seperti `generateMenuDetail`), keluarkan `{ group: string; items: string[] }[]`. Tulis test kasus: occasion tunggal, multi-occasion, kosong.
- [ ] **Step 2: step-items.tsx** — ganti baris `{menuDetail}` (line ~32) jadi render list: `<div className="font-semibold">{it.packageName}</div>` lalu `<ul>` item dari `groupSelectionLines(it.selections)`. Harga tetap di kanan (`formatRupiah(it.pax * it.pricePerPax)`).
- [ ] **Step 3: Typecheck + vitest** — `npx tsc --noEmit && npx vitest run`.
- [ ] **Step 4: Commit** — `git commit -m "feat(loa): tampilkan item layanan sebagai heading + list menu (form)"`

---

## FASE 5 — Persistence

### Task 10: `saveLoaDraft` / `getLoaForEdit` — handling type/value + SC dari tipe order

**Files:**
- Modify: `features/loa/actions.ts`

**Tanggung jawab:**
- `saveLoaDraft`: ambil `order.order_type` (sudah query order untuk ownership) → `scPct = serviceChargePctForType(order_type)`; **tolak** bila 0/null ("Tipe order belum diisi"). Re-kalkulasi `calculateLoa` dengan `scPct` + `handlingType`/`handlingValue` + diskon. Simpan ke `loa`: `service_charge_pct = scPct`, `handling_fee_type`, `handling_fee_value`, `handling_fee_pct = (type==='percent' ? value : 0)` (kompat), `handling_fee_amt = calc.handlingFeeAmt`, plus `sub_total_1/discount/service_charge_amt/sub_total_2/pb1_amt/grand_total/net_revenue` dari hasil baru.
- `getLoaForEdit`: muat `handling_fee_type`/`handling_fee_value` ke `pricing.handlingType`/`handlingValue`. `scPct` **tidak** dari LoA — di-override di page dari tipe order (Task 8). `discountEnabled` tetap di-derive dari `discount_value > 0`.

- [ ] **Step 1: Update query order** di `saveLoaDraft` → `.select('id, sales_id, order_type')`. Hitung `scPct`; guard bila kosong.
- [ ] **Step 2: Update payload `loa`** sesuai field baru (hapus referensi `handlingPct`).
- [ ] **Step 3: Update `getLoaForEdit`** mapping handling type/value.
- [ ] **Step 4: Typecheck** — `npx tsc --noEmit`.
- [ ] **Step 5: Commit** — `git commit -m "feat(loa): persist handling type/value + SC dari tipe order (server re-derive)"`

---

## Verifikasi Akhir

- [ ] `npx vitest run` → semua unit test lulus (`calculations`, `order-type`, `menu-detail-lines`, + existing).
- [ ] `npx tsc --noEmit` → tidak ada error sumber.
- [ ] `npm run build` → sukses.
- [ ] **Manual (browser):**
  - Buat order baru → wajib pilih Tipe (Package/Event) → kategori muncul sesuai tipe → simpan.
  - Detail order menampilkan Tipe/Kategori/SC; Edit bisa ganti tipe → kategori ikut berganti.
  - Buka `/orders/[id]/loa` → SC read-only = 5% (Package) / 10% (Event).
  - Handling Fee bisa toggle persen/flat; total live benar.
  - Diskon: nilai/persen mengurangi dari Sub Total 1 (cek breakdown panel).
  - Item Layanan tampil sebagai heading (berharga) + list menu (tanpa harga).
  - Simpan Draft → cek di Supabase: `orders.order_type/order_category`, `loa.handling_fee_type/value`, angka kalkulasi sesuai.

---

## Peta Spec → Task

| Spec | Task |
|------|------|
| §2 Tipe order + kategori (atribut order) | 1, 2, 5, 6 |
| §3 SC mengalir Order→LoA (read-only) | 2, 7, 8, 10 |
| §4 Urutan kalkulasi baru (diskon dari ST1) | 3 |
| §5 Handling flat/percent | 1, 4, 7, 10 |
| §6 Item Layanan heading + list | 9 |
| §7 Migrasi DB 004 | 1 |
| §8 Validasi (form + server re-derive) | 5, 10 |
