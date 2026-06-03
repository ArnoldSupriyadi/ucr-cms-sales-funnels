# Desain — Form LoA (Wizard + Preview Dokumen)

**Tanggal:** 2026-06-03
**Status:** Disetujui untuk implementasi
**Acuan visual:** `.superpowers/mockups/loa-form.html`
**Halaman target:** `app/(dashboard)/orders/[id]/loa/page.tsx`

## 1. Tujuan & Ruang Lingkup

Implementasikan mockup `loa-form.html` menjadi halaman LoA Next.js yang nyata:
wizard 4 langkah + panel ringkasan harga sticky + drawer pilih menu + toggle
**Preview Dokumen** ber-layout A4 siap-print.

**Lingkup iterasi ini:** UI lengkap + **prefill data nyata** dari order & lead di
Supabase. Field manual bersifat *ephemeral* (hidup di state lokal, hilang saat
refresh) karena **persistence ke DB belum dikerjakan di iterasi ini**.

### Di luar lingkup (sengaja ditunda)
- Simpan ke DB (`loa` / `loa_items` / `loa_item_selections`) + generate `doc_no`.
  Tombol "Simpan Draft" jadi stub (toast "belum diaktifkan").
- Export PDF betulan (cukup print browser via `@media print`).
- Approval flow GM, revisi dokumen, BEO/IB.

## 2. Arsitektur (Approach A — disetujui)

`useReducer` di satu root client component, dengan **Context tipis** untuk
mengekspos `state` + `dispatch` + nilai turunan, supaya `PricePanel` & `DocPreview`
tidak prop-drilling panjang. Server Component mem-prefetch semua data read-only.

```
app/(dashboard)/orders/[id]/loa/page.tsx   (Server Component)
  ├─ fetch: order (+ leads(*, lead_contacts(*)), users(name,phone,email))
  ├─ fetch: loadMenuCatalog()
  ├─ fetch: sales users (users where role = 'sales')
  └─ <LoaForm initialData catalog salesUsers />   (Client)
```

### Struktur file
```
features/loa/
├─ types.ts                     (sudah ada — tambah InitialLoaData, SalesUser, perluas LoaDetailDraft)
├─ loa-form-reducer.ts          (reducer + actions, fungsi murni)
├─ loa-form-context.tsx         (Context tipis: state + dispatch + derived calc)
├─ company.ts                   (konstanta kop surat Umara — hardcode)
└─ components/
   ├─ loa-form.tsx              (root client: provider + stepper + panel kiri/kanan + toggle view)
   ├─ loa-stepper.tsx
   ├─ step-detail.tsx           (kop, data klien readonly, detail kegiatan, sales, tabel Section I)
   ├─ step-items.tsx            (daftar item + tombol buka MenuDrawer)
   ├─ step-pricing.tsx          (SC%, handling%, PB1, diskon)
   ├─ step-review.tsx           (ringkasan + tombol Simpan Draft stub)
   ├─ price-panel.tsx           (ringkasan harga sticky)
   ├─ doc-preview.tsx           (layout A4 + CSS print, CSS module)
   ├─ menu-drawer.tsx           (sudah ada — refactor ringan: prop onAddItem)
   └─ menu-selection-group.tsx  (sudah ada — tetap)

lib/utils/date-id.ts            (baru — hariID(), tanggalID() + test)
```

## 3. Mapping Data → Field Detail

| Field di form     | Sumber                                   | Sifat               |
|-------------------|------------------------------------------|---------------------|
| Nama klien        | `leads.company_name`                     | readonly            |
| Segmen            | `leads.segmen` + `leads.line_business`   | readonly            |
| Alamat (kantor)   | `leads.address`                          | readonly            |
| PIC               | `lead_contacts` (is_primary) `.name`     | readonly            |
| HP PIC            | `lead_contacts` (is_primary) `.phone`    | readonly            |
| Nama Kegiatan     | `orders.event_name`                      | editable (prefill)  |
| Alamat Kegiatan   | `orders.venue`                           | editable (prefill)  |
| Tanggal Kegiatan  | `orders.event_date`                      | editable → Hari auto |
| Waktu             | `orders.event_time`                      | editable            |
| Pax               | `orders.pax`                             | editable            |
| Set Up            | (kosong; belum ada baris `loa`)          | editable            |
| Sales in charge   | default `orders.sales_id`; dropdown sales users | editable → HP/Email auto |
| Kop surat Umara   | `company.ts` (hardcode)                  | fixed               |

## 4. State & Reducer

State pakai `LoaWizardState` (sudah ada), dengan `LoaDetailDraft` diperluas:

```ts
interface LoaDetailDraft {
  eventName: string
  eventAddress: string   // venue
  eventDate: string      // ISO 'YYYY-MM-DD'
  eventTime: string
  pax: number
  setupLocation: string
  salesId: string
}

interface InitialLoaData {
  orderNo: string
  client: { name: string; segmen: string; address: string; picName: string; picPhone: string }
  detail: LoaDetailDraft       // hasil prefill
}
interface SalesUser { id: string; name: string; phone: string; email: string }
```

**Reducer** (`loa-form-reducer.ts`, murni):

| Action                          | Efek                                            |
|---------------------------------|-------------------------------------------------|
| `SET_DETAIL_FIELD {field,value}`| update satu field Detail                        |
| `ADD_ITEM {item}`               | push `LoaItemDraft`                             |
| `REMOVE_ITEM {key}`             | hapus item by key                               |
| `SET_PRICING_FIELD {field,value}`| update SC%/handling%/discountType/discountValue |
| `TOGGLE_DISCOUNT {on}`          | off → discountValue=0 (baris diskon hilang)     |

**Tidak disimpan di reducer (derived/UI-only):**
- `step` (0–3) → `useState` lokal di `LoaForm` (navigasi UI murni).
- Nama hari ID → `hariID(detail.eventDate)`.
- Seluruh angka harga → `calculateLoa(items, pricing)` lewat Context.
  Panel harga & preview dokumen selalu sinkron, tanpa duplikasi state.

**Validasi antar-langkah:** "Lanjut →" di Step 2 disable bila `items.length === 0`.
Validasi menu (radio = pilih tepat 1, checkbox = pilih ≥ 1) tetap di dalam drawer.

## 5. Perilaku Komponen Kunci

**`MenuDrawer` (refactor ringan).** Tambah prop `onAddItem(item: LoaItemDraft)`.
Saat "Simpan Item", drawer merakit `LoaItemDraft`
(`{ key: crypto.randomUUID(), packageId, packageName, pricePerPax, pax, selections }`)
lalu memanggil `onAddItem` → reducer `ADD_ITEM` → tutup & reset. Logika pemilihan &
validasi internal **tidak diubah**. `menu_detail` tampilan dirakit via
`generateMenuDetail()` (sudah ada).

**`StepItems`.** Daftar item-card (nama paket, `pax × harga`, `menu_detail`,
subtotal, tombol hapus) + tombol "+ Tambah Item". Kosong → hint "Belum ada item".

**`PricePanel` (sticky kanan).** Konsumsi `calculateLoa` dari Context: Sub Total 1,
Service Charge (%), Net Revenue (Sub Total 2, hijau), PB1 10%, Handling (%), baris
Diskon (muncul hanya bila diskon aktif), Grand Total + catatan "Net Revenue tidak
terpengaruh diskon".

**`DocPreview` (toggle A4).** Toggle "Form Input / Preview Dokumen" di header. Render
read-only dari state yang sama: kop (logo `public/logo-umara-catering.webp` + alamat
`company.ts`), blok meta (No. Dokumen `FR.SLS.03.a`, Revisi `00`), judul perjanjian +
nama klien, dua kolom (klien+kegiatan / pihak Umara+sales), tabel **I. Waktu & Tempat**
ter-generate dari Detail. CSS `@media print` + `@page A4` via CSS module agar tidak
bocor ke global.

**`Stepper`.** 4 langkah klik-able (active/done), tombol "← Kembali / Lanjut →" di
bawah panel kiri (Lanjut hilang di langkah 4).

**Tanggal Indonesia.** `lib/utils/date-id.ts`: `hariID()` / `tanggalID()` (reusable,
ditest), bukan di dalam komponen.

## 6. Testing

- `loa-form-reducer.test.ts` — tiap action (add/remove item, set field, toggle
  discount → value 0).
- `lib/utils/date-id.test.ts` — `hariID()` / `tanggalID()` beberapa tanggal.
- `calculateLoa`, `generateMenuDetail`, `selection-rules`, `catalog-shape` —
  sudah ada test, tidak diubah.
- Komponen React tidak ditest unit (belum ada infra RTL di repo); verifikasi manual
  via dev server.

## 7. Styling

Pakai `components/ui/*` yang ada (Card, Button, Input, Label, Select, Sheet, Checkbox,
RadioGroup, Separator) + Tailwind, mengikuti gaya repo. Layout grid `1fr 320px` (panel
harga sticky), turun 1 kolom di mobile. Style A4 + `@media print` via CSS module khusus
`doc-preview`.

## 8. Asumsi yang Dikunci

- Kop surat Umara di-hardcode di `company.ts`.
- "Simpan Draft" & "Batal" non-fungsional (stub) di iterasi ini.
- Semua input editable bersifat ephemeral (hilang saat refresh).
- "Alamat Kegiatan" → `orders.venue`; "Segmen" → gabungan `leads.segmen` +
  `leads.line_business` (dikonfirmasi user).
