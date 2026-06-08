# Redesign Menu & Multi-Event LoA — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) atau superpowers:executing-plans untuk implementasi task-by-task. Step pakai checkbox (`- [ ]`).

**Goal:** Ubah LoA dari satu-event/menu-katalog-kaku menjadi multi-event dengan menu pohon bebas (Event → Header → [sub-grup] → Item), amount manual, keterangan per baris, dan Order berbasis rentang tanggal.

**Architecture:** Order menyimpan rentang (`event_date` start + `event_date_end`). LoA menyimpan pohon: `loa_events` → `loa_items`(Header) → `loa_subgroups` → `loa_menu_items`. Kalkulasi memakai Σ amount Header. UI wizard LoA diubah jadi editor multi-event + editor pohon menu dengan autocomplete item & quick-fill paket. Dokumen render multi-event.

**Tech Stack:** Next.js 16 (App Router, Server Actions), Supabase (RLS, migration SQL manual), shadcn/ui, Vitest, TypeScript.

**Spec:** `docs/superpowers/specs/2026-06-08-loa-menu-event-redesign-design.md`

---

## Catatan Konvensi (baca sebelum mulai)
- SQL dijalankan **manual** di Supabase SQL Editor (file migration berurutan; jangan reset, jangan edit file lama). Boleh juga diterapkan via Supabase MCP (idempotent).
- Server client RLS: `import { createClient } from '@/lib/supabase/server'` → `await createClient()`. Bypass RLS (baca global): `createAdminClient()` (sudah ada).
- Generator nomor: `generateLoaDocNo()` (counter atomik) — TIDAK berubah di plan ini.
- Auth/izin: `await getAppUser()`; cek `user.permissions[...]`.
- Test `*.test.ts` bersebelahan dgn sumber di `lib/`.
- Reducer LoA: `features/loa/loa-form-reducer.ts`; context: `features/loa/loa-form-context.tsx`; tipe: `features/loa/types.ts`.
- Data LoA saat ini KOSONG → rebuild skema aman.

## File Structure
- `db/migrations/006_loa_multi_event.sql` (create)
- `types/database.ts` (modify — orders + tabel loa baru)
- `features/orders/components/order-form.tsx` (modify — date range)
- `features/orders/actions.ts` (modify — payload event_date_end)
- `app/(dashboard)/orders/[id]/page.tsx`, `features/orders/components/loa-orders-table.tsx`, dashboard recent (modify — tampil rentang)
- `lib/utils/format.ts` (modify — helper `formatDateRange`)
- `features/loa/types.ts` (modify — tipe pohon)
- `lib/loa/calculations.ts` + `.test.ts` (modify — basis Σ amount)
- `features/loa/loa-form-reducer.ts` + `.test.ts` (modify — operasi pohon)
- `lib/loa/catalog-suggest.ts` + `.test.ts` (create — pencarian item + map paket→pohon)
- `features/loa/components/step-detail.tsx` (modify — editor multi-event)
- `features/loa/components/menu-tree-editor.tsx` (create — editor pohon) + `item-combobox.tsx` (create)
- `features/loa/components/step-items.tsx` (modify — pakai menu-tree-editor)
- `features/loa/components/price-panel.tsx`, `step-review.tsx`, `doc-preview.tsx` (modify)
- `features/loa/actions.ts` (modify — persist pohon + events)
- `app/(dashboard)/orders/[id]/loa/page.tsx` (modify — load pohon + events)

---

## FASE 0 — Order rentang tanggal

### Task 1: Migration 006 + types
**Files:** Create `db/migrations/006_loa_multi_event.sql`; Modify `types/database.ts`

- [ ] **Step 1: Tulis migration**

```sql
-- 006: Order rentang tanggal + rebuild struktur menu LoA jadi pohon multi-event.
-- Data LoA kosong → aman drop/rebuild. Idempotent sebisa mungkin.

-- A) Order: tanggal selesai (event_date = mulai, tetap NOT NULL)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS event_date_end DATE;
COMMENT ON COLUMN orders.event_date_end IS 'Tanggal selesai event (rentang). NULL = 1 hari (sama dgn event_date).';

-- B) Buang struktur menu lama
DROP TABLE IF EXISTS loa_item_selections CASCADE;

-- C) loa_events: 1 baris per hari event dalam 1 LoA → tabel Waktu & Tempat
CREATE TABLE IF NOT EXISTS loa_events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loa_id         UUID NOT NULL REFERENCES loa(id) ON DELETE CASCADE,
  event_date     DATE,
  serving_time   TEXT,
  venue          TEXT,
  setup_location TEXT,
  pax            INTEGER,
  sort_order     SMALLINT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_loa_events_loa ON loa_events(loa_id);

-- D) loa_items = Header berharga (di bawah event). Rombak kolom (tabel kosong).
ALTER TABLE loa_items
  ADD COLUMN IF NOT EXISTS event_id  UUID REFERENCES loa_events(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS keterangan TEXT;
ALTER TABLE loa_items RENAME COLUMN package_name TO name;
ALTER TABLE loa_items DROP COLUMN IF EXISTS order_date;
ALTER TABLE loa_items DROP COLUMN IF EXISTS menu_detail;
ALTER TABLE loa_items DROP COLUMN IF EXISTS price_per_pax;
CREATE INDEX IF NOT EXISTS idx_loa_items_event ON loa_items(event_id);

-- E) Sub-grup (opsional) di bawah Header
CREATE TABLE IF NOT EXISTS loa_subgroups (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  header_id  UUID NOT NULL REFERENCES loa_items(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  keterangan TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_loa_subgroups_header ON loa_subgroups(header_id);

-- F) Item menu (di bawah Header, opsional di dalam sub-grup)
CREATE TABLE IF NOT EXISTS loa_menu_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  header_id    UUID NOT NULL REFERENCES loa_items(id) ON DELETE CASCADE,
  subgroup_id  UUID REFERENCES loa_subgroups(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  keterangan   TEXT,
  sort_order   SMALLINT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_loa_menu_items_header ON loa_menu_items(header_id);

-- G) RLS: akses bila pemilik LoA induk atau admin/GM. Mirror pola loa_items lama.
ALTER TABLE loa_events     ENABLE ROW LEVEL SECURITY;
ALTER TABLE loa_subgroups  ENABLE ROW LEVEL SECURITY;
ALTER TABLE loa_menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY loa_events_all ON loa_events FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM loa l WHERE l.id = loa_events.loa_id AND (l.created_by = auth.uid() OR is_admin_or_gm())))
  WITH CHECK (EXISTS (SELECT 1 FROM loa l WHERE l.id = loa_events.loa_id AND (l.created_by = auth.uid() OR is_admin_or_gm())));

CREATE POLICY loa_subgroups_all ON loa_subgroups FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM loa_items h JOIN loa l ON l.id = h.loa_id WHERE h.id = loa_subgroups.header_id AND (l.created_by = auth.uid() OR is_admin_or_gm())))
  WITH CHECK (EXISTS (SELECT 1 FROM loa_items h JOIN loa l ON l.id = h.loa_id WHERE h.id = loa_subgroups.header_id AND (l.created_by = auth.uid() OR is_admin_or_gm())));

CREATE POLICY loa_menu_items_all ON loa_menu_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM loa_items h JOIN loa l ON l.id = h.loa_id WHERE h.id = loa_menu_items.header_id AND (l.created_by = auth.uid() OR is_admin_or_gm())))
  WITH CHECK (EXISTS (SELECT 1 FROM loa_items h JOIN loa l ON l.id = h.loa_id WHERE h.id = loa_menu_items.header_id AND (l.created_by = auth.uid() OR is_admin_or_gm())));
```

- [ ] **Step 2: Jalankan di Supabase** (SQL Editor paste→Run, atau via MCP). Expected: "Success. No rows returned".
- [ ] **Step 3: `supabase db advisors` / MCP get_advisors** — perbaiki temuan (mis. search_path fungsi bila ada yang baru; tabel RLS-no-policy seharusnya tidak muncul karena kita beri policy).
- [ ] **Step 4: Update `types/database.ts`** — `orders` Row/Insert/Update: `event_date_end: string | null`. Tambah definisi tabel `loa_events`, `loa_subgroups`, `loa_menu_items` (Row/Insert/Update). `loa_items`: ganti `package_name`→`name`, hapus `order_date`/`menu_detail`/`price_per_pax`, tambah `event_id: string | null`, `keterangan: string | null`. Hapus tipe `loa_item_selections`.
- [ ] **Step 5: Typecheck** `npx tsc --noEmit` (akan muncul error di kode yang pakai field lama — itu wajar, diperbaiki di task berikut; pastikan error hanya di file yang memang akan diubah).
- [ ] **Step 6: Commit** `git commit -m "feat(db): migration 006 — order date range + struktur menu LoA pohon multi-event"`

---

### Task 2: Order form — input rentang tanggal
**Files:** Modify `features/orders/components/order-form.tsx`, `features/orders/actions.ts`

- [ ] **Step 1:** Di `order-form.tsx`: tambah state `const [eventDateEnd, setEventDateEnd] = useState(order?.event_date_end ?? '')`. Ganti field "Tanggal Event" jadi dua input date berdampingan: **"Tanggal Mulai"** (`event_date`, wajib, existing) + **"Tanggal Selesai"** (`event_date_end`, opsional). Validasi: bila `eventDateEnd` terisi dan `< eventDate` → error "Tanggal selesai tidak boleh sebelum tanggal mulai" (tambah ke `validate()` + `FIELD_LABELS`).
- [ ] **Step 2:** Payload: tambah `event_date_end: eventDateEnd || null`. Update tipe `OrderCreateInput`/`updateOrder` di `features/orders/actions.ts` (otomatis lewat `TablesInsert<'orders'>` setelah types diupdate).
- [ ] **Step 3:** Typecheck + lint: `npx tsc --noEmit && npm run lint`.
- [ ] **Step 4: Verifikasi browser** — `/orders/new`: isi mulai 2026-07-01, selesai 2026-07-03 → simpan → cek DB `event_date_end` terisi. Coba selesai < mulai → muncul error validasi.
- [ ] **Step 5: Commit** `git commit -m "feat(orders): input rentang tanggal (mulai–selesai)"`

---

### Task 3: Tampilkan rentang tanggal di list & detail order
**Files:** Modify `lib/utils/format.ts`, `app/(dashboard)/orders/[id]/page.tsx`, `features/orders/components/loa-orders-table.tsx`, dashboard recent (cari pemakai `event_date` di list)

- [ ] **Step 1:** Tambah helper di `lib/utils/format.ts`:

```ts
export const formatDateRange = (start: string, end?: string | null) =>
  !end || end === start ? formatDate(start) : `${formatDate(start)} – ${formatDate(end)}`
```

- [ ] **Step 2:** Ganti tampilan `formatDate(order.event_date)` → `formatDateRange(order.event_date, order.event_date_end)` di: detail order (`[id]/page.tsx` baris Tanggal Event), `loa-orders-table.tsx` (kolom TGL EVENT), dan dashboard recent bila menampilkan tanggal. Pastikan query masing-masing meng-select `event_date_end` (tambahkan ke `.select(...)`).
- [ ] **Step 3:** Typecheck `npx tsc --noEmit`.
- [ ] **Step 4: Verifikasi browser** — list & detail order menampilkan "01 Jul 2026 – 03 Jul 2026"; order 1 hari tetap satu tanggal.
- [ ] **Step 5: Commit** `git commit -m "feat(orders): tampilkan rentang tanggal di list & detail"`

---

## FASE 1 — Tipe & kalkulasi LoA

### Task 4: Tipe pohon LoA
**Files:** Modify `features/loa/types.ts`

- [ ] **Step 1:** Tambah/ubah tipe (pertahankan `LoaPricingDraft`, `InitialLoaData`, `SalesUser`, `MenuCatalog` yang sudah ada):

```ts
export interface MenuItemDraft {
  key: string
  name: string
  keterangan: string
}
export interface SubGroupDraft {
  key: string
  name: string
  keterangan: string
  items: MenuItemDraft[]
}
export interface HeaderDraft {
  key: string
  name: string
  keterangan: string
  pax: number
  amount: number            // manual; price/pax = amount/pax (turunan tampilan)
  subGroups: SubGroupDraft[] // boleh kosong
  items: MenuItemDraft[]     // item langsung di header (di luar sub-grup)
}
export interface EventDraft {
  key: string
  eventDate: string         // 'YYYY-MM-DD'
  servingTime: string
  venue: string
  setupLocation: string
  pax: number               // manual, utk tabel Waktu & Tempat
  headers: HeaderDraft[]
}
```

- [ ] **Step 2:** Hapus tipe lama yang tak terpakai (`LoaItemDraft`, `DraftSelection`) bila tidak dirujuk lagi. (Akan ada error di reducer/komponen — diperbaiki di task berikut.)
- [ ] **Step 3: Commit** `git commit -m "feat(loa): tipe state pohon Event→Header→SubGroup→Item"`

---

### Task 5: `calculateLoa` basis Σ amount (TDD)
**Files:** Modify `lib/loa/calculations.ts`, `lib/loa/calculations.test.ts`

- [ ] **Step 1: Ganti test (pastikan gagal dulu).** Basis sekarang daftar amount Header, bukan `{pricePerPax,pax}`:

```ts
import { describe, it, expect } from 'vitest'
import { calculateLoa, PB1_PCT } from './calculations'

// amounts = total tiap Header (manual). subTotal1 = Σ amounts.
const amounts = [9_000_000, 1_070_000] // = 10.070.000

describe('calculateLoa (basis Σ amount Header)', () => {
  it('Event SC 10%, diskon flat 1jt, handling 5% persen', () => {
    const r = calculateLoa(amounts, {
      scPct: 10, handlingType: 'percent', handlingValue: 5,
      discountType: 'flat', discountValue: 1_000_000,
    })
    expect(r.subTotal1).toBe(10_070_000)
    expect(r.discountAmt).toBe(1_000_000)
    expect(r.serviceChargeAmt).toBe(907_000)   // 10% × 9.070.000
    expect(r.subTotal2).toBe(9_977_000)
    expect(r.netRevenue).toBe(9_977_000)
    expect(r.pb1Amt).toBe(997_700)
    expect(r.handlingFeeAmt).toBe(498_850)     // 5% × 9.977.000
    expect(r.grandTotal).toBe(11_473_550)
  })
  it('diskon persen = % dari Sub Total 1', () => {
    const r = calculateLoa([10_000_000], { scPct: 5, handlingType: 'percent', handlingValue: 15, discountType: 'percent', discountValue: 10 })
    expect(r.discountAmt).toBe(1_000_000)
  })
  it('handling flat dipakai langsung', () => {
    const r = calculateLoa([10_000_000], { scPct: 5, handlingType: 'flat', handlingValue: 250_000, discountType: 'flat', discountValue: 0 })
    expect(r.handlingFeeAmt).toBe(250_000)
  })
  it('diskon di-clamp ke [0, subTotal1]', () => {
    const r = calculateLoa([10_000_000], { scPct: 5, handlingType: 'percent', handlingValue: 0, discountType: 'flat', discountValue: 99_999_999 })
    expect(r.discountAmt).toBe(10_000_000)
    expect(r.subTotal2).toBe(0)
  })
  it('PB1 konstan 10%', () => { expect(PB1_PCT).toBe(10) })
})
```

- [ ] **Step 2: Jalankan — pastikan gagal** `npx vitest run lib/loa/calculations.test.ts`.
- [ ] **Step 3: Implementasi.** Ganti signature jadi `calculateLoa(amounts: number[], pricing: LoaPricingInput)`. `LoaPricingInput` & `LoaCalcResult` TETAP seperti sekarang (scPct, handlingType, handlingValue, discountType, discountValue). Body: `subTotal1 = round2(Σ amounts)`, sisanya waterfall sama persis dgn versi sekarang.
- [ ] **Step 4: Jalankan — lulus** `npx vitest run lib/loa/calculations.test.ts`.
- [ ] **Step 5: Commit** `git commit -m "feat(loa): calculateLoa basis Σ amount Header"`

---

### Task 6: Reducer pohon (TDD ringkas)
**Files:** Modify `features/loa/loa-form-reducer.ts`, `features/loa/loa-form-reducer.test.ts`, `features/loa/loa-form-context.tsx`

- [ ] **Step 1: Test (gagal dulu)** untuk operasi inti pohon. Tambah di `loa-form-reducer.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { loaReducer, initialState } from './loa-form-reducer'

describe('loaReducer pohon', () => {
  it('ADD_EVENT menambah event kosong', () => {
    const s = loaReducer(initialState([]), { type: 'ADD_EVENT' })
    expect(s.events).toHaveLength(1)
    expect(s.events[0].headers).toEqual([])
  })
  it('ADD_HEADER menambah header ke event', () => {
    let s = loaReducer(initialState([]), { type: 'ADD_EVENT' })
    const ek = s.events[0].key
    s = loaReducer(s, { type: 'ADD_HEADER', eventKey: ek })
    expect(s.events[0].headers).toHaveLength(1)
  })
  it('SET_HEADER_FIELD mengubah amount', () => {
    let s = loaReducer(initialState([]), { type: 'ADD_EVENT' })
    const ek = s.events[0].key
    s = loaReducer(s, { type: 'ADD_HEADER', eventKey: ek })
    const hk = s.events[0].headers[0].key
    s = loaReducer(s, { type: 'SET_HEADER_FIELD', eventKey: ek, headerKey: hk, field: 'amount', value: 5000 })
    expect(s.events[0].headers[0].amount).toBe(5000)
  })
})
```

- [ ] **Step 2: Jalankan — gagal** `npx vitest run features/loa/loa-form-reducer.test.ts`.
- [ ] **Step 3: Implementasi reducer.** State: `{ detail, pricing, events: EventDraft[] }` (pertahankan `detail`/`pricing` yang ada; ganti `items` → `events`). Action (semua immutable, pakai `crypto.randomUUID()` utk key):
  - `ADD_EVENT` / `REMOVE_EVENT{eventKey}` / `SET_EVENT_FIELD{eventKey,field,value}`
  - `ADD_HEADER{eventKey}` / `REMOVE_HEADER{eventKey,headerKey}` / `SET_HEADER_FIELD{eventKey,headerKey,field,value}`
  - `ADD_SUBGROUP{eventKey,headerKey}` / `REMOVE_SUBGROUP{...}` / `SET_SUBGROUP_FIELD{...}`
  - `ADD_ITEM{eventKey,headerKey,subGroupKey?|null}` / `REMOVE_ITEM{...,itemKey}` / `SET_ITEM_FIELD{...,itemKey,field,value}`
  - `FILL_HEADER_FROM_PACKAGE{eventKey,headerKey,header:HeaderDraft}` (ganti isi header dari hasil map paket — Task 7)
  - `SET_PRICING_FIELD`, `TOGGLE_DISCOUNT` (pertahankan dari versi lama)
  Sediakan helper internal `mapEvent`/`mapHeader` agar update bersarang DRY.
- [ ] **Step 4:** `initialState(events: EventDraft[])` mengembalikan state dgn `events` (default `[]`) + `DEFAULT_PRICING`. Update `loa-form-context.tsx` Provider: terima `initialEvents?: EventDraft[]` (ganti `initialItems`), expose `state.events`, hitung `calc` via `calculateLoa(allHeaderAmounts, pricing)` di mana `allHeaderAmounts = state.events.flatMap(e=>e.headers).map(h=>h.amount)`.
- [ ] **Step 5: Jalankan — lulus** `npx vitest run features/loa/loa-form-reducer.test.ts`.
- [ ] **Step 6: Commit** `git commit -m "feat(loa): reducer pohon event/header/subgroup/item"`

---

## FASE 2 — Suggestion katalog

### Task 7: Helper suggestion (TDD)
**Files:** Create `lib/loa/catalog-suggest.ts` + `lib/loa/catalog-suggest.test.ts`

- [ ] **Step 1: Test (gagal dulu).**

```ts
import { describe, it, expect } from 'vitest'
import { searchMenuItems, packageToHeader } from './catalog-suggest'
import type { MenuCatalog } from '@/features/loa/types'

const catalog = { /* minimal fixture: 1 paket hasSelection dgn 1 komponen+kategori+item, + daftar item global */ } as unknown as MenuCatalog

describe('catalog-suggest', () => {
  it('searchMenuItems memfilter case-insensitive', () => {
    expect(searchMenuItems(catalog, 'nas').some((n) => /nasi/i.test(n))).toBe(true)
    expect(searchMenuItems(catalog, '')).toEqual([]) // query kosong → tak ada saran
  })
  it('packageToHeader memetakan paket→HeaderDraft (sub-grup dari kategori)', () => {
    const h = packageToHeader(catalog, /* packageId */ 'pkg-1')
    expect(h?.name).toBeTruthy()
    expect(Array.isArray(h?.subGroups)).toBe(true)
  })
})
```

- [ ] **Step 2: Jalankan — gagal** `npx vitest run lib/loa/catalog-suggest.test.ts`.
- [ ] **Step 3: Implementasi.**
  - `searchMenuItems(catalog, query): string[]` — kumpulkan semua nama item unik dari `catalog` (lewat `categoriesByComponentType`/kategori), filter `query` (trim; kosong→`[]`), batasi 20.
  - `packageToHeader(catalog, packageId): HeaderDraft | null` — temukan paket; `name = namaPaket`; `pax=0; amount=0; keterangan=''`; untuk tiap komponen/kategori paket buat `SubGroupDraft` (name = nama kategori) berisi `MenuItemDraft` default dari item kategori (atau kosong bila tak ada default). Semua dapat `key` baru.
- [ ] **Step 4: Jalankan — lulus** `npx vitest run lib/loa/catalog-suggest.test.ts`.
- [ ] **Step 5: Commit** `git commit -m "feat(loa): helper suggestion item + map paket→header (tested)"`

---

## FASE 3 — UI

### Task 8: Step Detail → editor multi-event
**Files:** Modify `features/loa/components/step-detail.tsx`

**Tanggung jawab:** render daftar **event** yang bisa tambah/hapus. Tiap event = card berisi field: Tanggal (date), Waktu siap saji (text), Tempat (text/textarea), Set Up (text), Pax (number). Hari auto (`hariID(eventDate)`). Header dokumen (kop, judul, data klien dari `meta.client`) tetap. Bagian "Pihak Umara/Sales" tetap (pakai `detail.salesId`).

- [ ] **Step 1:** Ganti bagian "Detail Kegiatan" jadi map `state.events` → EventCard. Tiap field dispatch `SET_EVENT_FIELD{eventKey,field,value}`. Tombol "+ Tambah Event" → `ADD_EVENT`. Tiap card ada tombol hapus → `REMOVE_EVENT`. Bila `events.length===0` tampil ajakan tambah.
- [ ] **Step 2: Typecheck** `npx tsc --noEmit`.
- [ ] **Step 3: Verifikasi browser** — buka LoA, step Detail: tambah 2 event, isi tanggal/tempat berbeda, hapus salah satu → state benar (cek via React state / lanjut ke preview di Task 11).
- [ ] **Step 4: Commit** `git commit -m "feat(loa): step Detail editor multi-event"`

---

### Task 9: Editor pohon menu + autocomplete + quick-fill paket
**Files:** Create `features/loa/components/menu-tree-editor.tsx`, `features/loa/components/item-combobox.tsx`; Modify `features/loa/components/step-items.tsx`

**Tanggung jawab:** Step Items menampilkan, **per event**, daftar Header. Tiap Header: input Nama + Keterangan + Pax + Amount (Price tampil auto = amount/pax), tombol "Pakai paket" (quick-fill via `packageToHeader` + `FILL_HEADER_FROM_PACKAGE`), daftar Item langsung, dan daftar Sub-grup (tiap sub-grup: nama + keterangan + daftar item). Tombol tambah: + Header (per event), + Sub-grup (per header), + Item (per header atau per sub-grup). Item name pakai `ItemCombobox` (autocomplete `searchMenuItems`, tetap bisa ketik bebas). Semua punya tombol hapus.

- [ ] **Step 1: `item-combobox.tsx`** — combobox bebas-ketik dgn saran. Pakai pola `PackageCombobox` (Popover+Command) TAPI: nilai = teks bebas; `CommandInput` = nilai saat ini; tampilkan hasil `searchMenuItems(catalog, query)` sebagai opsi; pilih opsi → set teks; teks bebas tetap diterima (onBlur commit). **Wajib** teruskan `container` (node body Sheet/panel) ke `PopoverContent` agar wheel-scroll tak diblokir (lihat fix b1526a7).
- [ ] **Step 2: `menu-tree-editor.tsx`** — komponen `{ event: EventDraft, catalog }` me-render header/subgroup/item + semua tombol & dispatch sesuai action reducer Task 6. Quick-fill: tombol "Pakai paket" buka `PackageCombobox`; onChange → `FILL_HEADER_FROM_PACKAGE{..., header: packageToHeader(catalog, id)!}`.
- [ ] **Step 3: `step-items.tsx`** — map `state.events` → judul tanggal + `<MenuTreeEditor event=... catalog=... />`. Hapus pemakaian `MenuDrawer`/`LoaItemDraft` lama. Tombol Lanjut disabled bila tak ada satupun header (`state.events.every(e=>e.headers.length===0)`).
- [ ] **Step 4: Typecheck + lint** `npx tsc --noEmit && npm run lint`.
- [ ] **Step 5: Verifikasi browser** — tambah header, isi pax+amount (cek Price auto), ketik item dgn saran muncul + keterangan, "Pakai paket" mengisi sub-grup/item lalu edit/hapus. Cek list paket bisa di-scroll (regресi b1526a7).
- [ ] **Step 6: Commit** `git commit -m "feat(loa): editor pohon menu + autocomplete item + quick-fill paket"`

---

### Task 10: Price panel & step Review (Σ amount)
**Files:** Modify `features/loa/components/price-panel.tsx`, `features/loa/components/step-review.tsx`

- [ ] **Step 1: price-panel.tsx** — sudah baca `calc` dari context (kini berbasis Σ amount). Pastikan label tetap (Sub Total 1, Diskon, SC, Net, PB1, Handling, Grand Total). Tidak perlu perubahan logika bila context sudah menyuplai `calc` baru — verifikasi saja.
- [ ] **Step 2: step-review.tsx** — ringkasan: jumlah event, jumlah header, Grand Total, Net Revenue dari `calc`. Tombol "Simpan Draft"/"Batal" tetap.
- [ ] **Step 3: Typecheck** `npx tsc --noEmit`.
- [ ] **Step 4: Commit** `git commit -m "feat(loa): ringkasan harga & review berbasis Σ amount multi-event"`

---

### Task 11: Dokumen (preview form + doc-preview)
**Files:** Modify `features/loa/components/doc-preview.tsx` (dan `step-detail` bagian tabel Waktu&Tempat bila ada)

**Tanggung jawab:** render multi-event sesuai spec §5.
- **Section "1. Waktu & Tempat"** (judul angka biasa, bukan Romawi): tabel multi-baris, 1 per `event`: `tanggalID(eventDate) · hariID(eventDate) · servingTime · venue · setupLocation · pax`.
- **Section "2. Biaya Jasa Katering"**: untuk tiap event → untuk tiap header baris berharga `name · price(=amount/pax, 0→"—") · pax · amount`; lalu item langsung (`• name — keterangan`); lalu tiap sub-grup (nama tebal) + itemnya. Setelah semua event: `Sub Total 1 → [Diskon bila aktif] → Service Charge (scPct%) → Net (Sub Total 2) → PB1 → Handling → GRAND TOTAL` dari `calc`.

- [ ] **Step 1:** Implementasi render di `doc-preview.tsx` (dan komponen preview pada `step-review`/`doc` yang relevan). Keterangan tampil sebagai teks kecil setelah nama.
- [ ] **Step 2: Typecheck** `npx tsc --noEmit`.
- [ ] **Step 3: Verifikasi browser** — buat 2 event dgn header+menu+keterangan, toggle "Preview Dokumen": Section 1 dua baris, Section 2 dikelompokkan per tanggal, total benar. Angka section bukan Romawi.
- [ ] **Step 4: Commit** `git commit -m "feat(loa): dokumen multi-event (Waktu&Tempat + Biaya pohon menu)"`

---

## FASE 4 — Persistence

### Task 12: `saveLoaDraft` / `getLoaForEdit` untuk pohon + events
**Files:** Modify `features/loa/actions.ts`, `app/(dashboard)/orders/[id]/loa/page.tsx`

**Tanggung jawab:** simpan & muat pohon. Re-kalkulasi server pakai `calculateLoa(allHeaderAmounts, pricing)` (SC dari tipe order spt sekarang). Strategi: upsert header `loa`; lalu **delete-reinsert** anak (events→headers→subgroups→menu_items) dalam urutan FK benar.

- [ ] **Step 1: `saveLoaDraft`** terima `{ setupLocation? (deprecated), events: EventDraft[], pricing }`. Hitung `amounts = events.flatMap(e=>e.headers).map(h=>h.amount)`; `calc = calculateLoa(amounts, {scPct,...})` (scPct dari `order.order_type`, guard 0/null spt sekarang). Upsert `loa` (angka dari `calc`). Hapus anak lama: `delete loa_events where loa_id` (CASCADE ikut menghapus headers/subgroups/menu_items karena FK on delete cascade — verifikasi rantai FK; bila loa_items.loa_id juga ada, hapus loa_items where loa_id juga). Insert ulang: events → simpan id; headers (event_id) → simpan id; subgroups (header_id) → id; menu_items (header_id, subgroup_id|null). Pakai `sort_order` sesuai urutan array. Guard izin `loa.create` + ownership.
- [ ] **Step 2: `getLoaForEdit`** muat `loa` + `loa_events(*, loa_items(*, loa_subgroups(*), loa_menu_items(*)))` (atau query bertingkat), rakit jadi `EventDraft[]` (susun item ke sub-grup via `subgroup_id`; item dgn `subgroup_id=null` jadi item langsung header), urut by `sort_order`. Kembalikan `{ events, pricing }` (`pricing` dari kolom loa, `discountEnabled` derive dari `discount_value>0`; `scPct` di-override di page dari tipe order).
- [ ] **Step 3: `loa/page.tsx`** — hidrasi `initialEvents` dari `getLoaForEdit`. Bila belum ada LoA tersimpan & order punya `event_date`/`event_date_end`, seed 1 event default per hari dalam rentang (opsional; minimal seed 1 event dari `event_date`). `initialPricing.scPct = serviceChargePctForType(order.order_type)`.
- [ ] **Step 4: Typecheck** `npx tsc --noEmit`.
- [ ] **Step 5: Verifikasi (service-role smoke / browser)** — simpan draft multi-event → cek DB: `loa_events`, `loa_items`(name/pax/amount/keterangan/event_id), `loa_subgroups`, `loa_menu_items` sesuai; buka ulang LoA → pohon ter-hidrasi sama; angka `loa` (sub_total_1=Σamount, grand_total) benar. Edit → simpan lagi → tidak ada duplikat (delete-reinsert).
- [ ] **Step 6: Commit** `git commit -m "feat(loa): persist & load pohon multi-event (server re-kalkulasi Σ amount)"`

---

## Verifikasi Akhir
- [ ] `npx vitest run` → semua test lulus (calculations, catalog-suggest, reducer, + existing).
- [ ] `npx tsc --noEmit` → tak ada error sumber.
- [ ] `npm run build` → sukses.
- [ ] **Manual (browser):** Order rentang tanggal tersimpan & tampil rentang. LoA: multi-event, header pax+amount (price auto), item autocomplete + keterangan, quick-fill paket (editable, list scroll OK), preview multi-event tanpa Romawi, total Σ amount benar, simpan→muat ulang konsisten. Akun sales bisa buat order & simpan LoA tanpa duplicate-key (cek runtime logs bersih).

## Peta Spec → Task
| Spec | Task |
|------|------|
| §1 Order rentang tanggal | 1, 2, 3 |
| §2 Model pohon Event→Header→SubGroup→Item + keterangan | 1, 4, 6, 8, 9, 12 |
| §3 Suggestion item + quick-fill paket | 7, 9 |
| §4 Kalkulasi Σ amount | 5, 6, 10, 12 |
| §5 Dokumen multi-event (tanpa Romawi) | 11 |
| §6 Persistence skema baru (migration 006) | 1, 12 |
