# LOA Prefill Paket + Menu 3-Level — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development atau superpowers:executing-plans untuk implementasi task-by-task. Step pakai checkbox (`- [ ]`).

**Goal:** Tambah level "Section/Komponen" pada menu LOA (Event→Header→Section→Sub-kategori→Item) + tombol "Tambah dari Paket" yang prefill struktur paket katalog (Header+Komponen+Sub-kategori daun+3 item contoh), semua editable; "+ Sub-kategori" pakai combobox kategori katalog.

**Architecture:** Sisipkan tabel `loa_sections` antara `loa_items`(Header) & `loa_subgroups`(Sub-kategori). Item bisa menempel di Header (langsung), Section (langsung), atau Sub-kategori. Prefill via helper murni `packageToHeader` (3-level, 3 item contoh). Kalkulasi & penomoran TIDAK berubah (Σ amount Header).

**Tech Stack:** Next.js 16 (Server Actions), Supabase (migration SQL manual / MCP), shadcn/ui, Vitest, TypeScript.

**Spec:** `docs/superpowers/specs/2026-06-09-loa-package-prefill-3level-design.md`

---

## Catatan Konvensi
- SQL manual di Supabase SQL Editor / MCP (file migration berurutan; jangan reset).
- Client RLS: `await createClient()`. Generator nomor/admin: `createAdminClient()` (tak relevan di plan ini).
- Test `*.test.ts` bersebelahan dgn sumber.
- Data LOA saat ini KOSONG → rebuild aman.
- Model draft saat ini (sebelum plan): `EventDraft.headers[]`; `HeaderDraft{key,name,keterangan,pax,amount,items[],subGroups[]}`; `SubGroupDraft{key,name,keterangan,items[]}`; `MenuItemDraft{key,name,keterangan}`. Reducer di `features/loa/loa-form-reducer.ts`; editor di `features/loa/components/menu-tree-editor.tsx`.

## File Structure
- `db/migrations/008_loa_sections.sql` (create)
- `types/database.ts` (modify — `loa_sections` + kolom `section_id`)
- `features/loa/types.ts` (modify — `SectionDraft`, `HeaderDraft.sections`)
- `features/loa/loa-form-reducer.ts` + `.test.ts` (modify — section ops + item per-level)
- `lib/loa/catalog-suggest.ts` + `.test.ts` (modify — `searchCategories` + `packageToHeader` 3-level)
- `features/loa/components/category-combobox.tsx` (create — combobox sub-kategori dari katalog)
- `features/loa/components/package-combobox.tsx` (create ulang — picker paket)
- `features/loa/components/menu-tree-editor.tsx` (modify — render 3 level)
- `features/loa/components/step-items.tsx` (modify — tombol "+ Tambah dari Paket")
- `features/loa/actions.ts` (modify — persist/load 4-tingkat)
- `features/loa/components/doc-preview.tsx` (modify — render 3 level)

---

## FASE 0 — DB & Tipe

### Task 1: Migration 008 + types/database.ts
**Files:** Create `db/migrations/008_loa_sections.sql`; Modify `types/database.ts`

- [ ] **Step 1: Tulis migration**

```sql
-- 008: Tambah level Section (Komponen) antara Header (loa_items) & Sub-kategori (loa_subgroups).
-- Data LOA kosong → aman. Idempotent sebisa mungkin.

CREATE TABLE IF NOT EXISTS loa_sections (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  header_id  UUID NOT NULL REFERENCES loa_items(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  keterangan TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_loa_sections_header ON loa_sections(header_id);

-- Sub-kategori kini di bawah Section (data kosong → ganti header_id jadi section_id)
ALTER TABLE loa_subgroups ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES loa_sections(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_loa_subgroups_section ON loa_subgroups(section_id);

-- Item bisa langsung di section juga
ALTER TABLE loa_menu_items ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES loa_sections(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_loa_menu_items_section ON loa_menu_items(section_id);

-- RLS
ALTER TABLE loa_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS loa_sections_all ON loa_sections;
CREATE POLICY loa_sections_all ON loa_sections FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM loa_items h JOIN loa l ON l.id=h.loa_id WHERE h.id=loa_sections.header_id AND (l.created_by=auth.uid() OR is_admin_or_gm())))
  WITH CHECK (EXISTS (SELECT 1 FROM loa_items h JOIN loa l ON l.id=h.loa_id WHERE h.id=loa_sections.header_id AND (l.created_by=auth.uid() OR is_admin_or_gm())));
```

- [ ] **Step 2: Jalankan di Supabase** (paste/Run atau MCP). Expected "Success".
- [ ] **Step 3: Advisors** (`get_advisors security`) — pastikan tak ada temuan baru (RLS doc_sections sudah ber-policy).
- [ ] **Step 4: types/database.ts** — tambah definisi tabel `loa_sections` (Row/Insert/Update + Relationship header_id→loa_items). Tambah `section_id: string | null` ke `loa_subgroups` & `loa_menu_items` (Row + opsional Insert/Update) + Relationships ke `loa_sections`.
- [ ] **Step 5: Typecheck** `npx tsc --noEmit` (error hanya di file yg akan diubah berikut = wajar).
- [ ] **Step 6: Commit** `git commit -m "feat(db): migration 008 — loa_sections (level Komponen)"`

---

### Task 2: Tipe SectionDraft
**Files:** Modify `features/loa/types.ts`

- [ ] **Step 1:** Tambah `SectionDraft` & ubah `HeaderDraft`:

```ts
export interface SectionDraft {
  key: string
  name: string
  keterangan: string
  items: MenuItemDraft[]      // item langsung di section
  subGroups: SubGroupDraft[]
}
export interface HeaderDraft {
  key: string
  name: string
  keterangan: string
  pax: number
  amount: number
  items: MenuItemDraft[]      // item langsung di header
  sections: SectionDraft[]
}
```
(`SubGroupDraft` & `MenuItemDraft` tetap.)

- [ ] **Step 2: Commit** `git commit -m "feat(loa): tipe SectionDraft + HeaderDraft.sections"`

---

## FASE 1 — Reducer & Helper

### Task 3: Reducer section + item per-level (TDD)
**Files:** Modify `features/loa/loa-form-reducer.ts`, `features/loa/loa-form-reducer.test.ts`

Lokasi item diidentifikasi `(headerKey, sectionKey: string|null, subGroupKey: string|null)`:
- section null & sub null → `header.items`
- section set & sub null → `section.items`
- section set & sub set → `subGroup.items`

- [ ] **Step 1: Tambah test (gagal dulu)** di `loa-form-reducer.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { loaFormReducer, initialState, newPrefilledHeader } from './loa-form-reducer'
import type { HeaderDraft } from './types'

function withHeader() {
  let s = loaFormReducer(initialState([]), { type: 'ADD_EVENT' })
  const ek = s.events[0].key
  s = loaFormReducer(s, { type: 'ADD_HEADER', eventKey: ek })
  const hk = s.events[0].headers[0].key
  return { s, ek, hk }
}

describe('reducer section 3-level', () => {
  it('ADD_SECTION + ADD_SUBGROUP + ADD_ITEM ke subgroup', () => {
    let { s, ek, hk } = withHeader()
    s = loaFormReducer(s, { type: 'ADD_SECTION', eventKey: ek, headerKey: hk })
    const sk = s.events[0].headers[0].sections[0].key
    s = loaFormReducer(s, { type: 'ADD_SUBGROUP', eventKey: ek, headerKey: hk, sectionKey: sk })
    const gk = s.events[0].headers[0].sections[0].subGroups[0].key
    s = loaFormReducer(s, { type: 'ADD_ITEM', eventKey: ek, headerKey: hk, sectionKey: sk, subGroupKey: gk })
    expect(s.events[0].headers[0].sections[0].subGroups[0].items).toHaveLength(1)
  })

  it('ADD_ITEM langsung di header (section null, sub null)', () => {
    let { s, ek, hk } = withHeader()
    s = loaFormReducer(s, { type: 'ADD_ITEM', eventKey: ek, headerKey: hk, sectionKey: null, subGroupKey: null })
    expect(s.events[0].headers[0].items).toHaveLength(1)
  })

  it('ADD_PREFILLED_HEADER menambah header siap pakai', () => {
    let s = loaFormReducer(initialState([]), { type: 'ADD_EVENT' })
    const ek = s.events[0].key
    const header: HeaderDraft = { key: 'x', name: 'Full Day', keterangan: '', pax: 0, amount: 0, items: [], sections: [] }
    s = loaFormReducer(s, { type: 'ADD_PREFILLED_HEADER', eventKey: ek, header })
    expect(s.events[0].headers[0].name).toBe('Full Day')
  })
})
```

- [ ] **Step 2: Jalankan — gagal** `npx vitest run features/loa/loa-form-reducer.test.ts`.

- [ ] **Step 3: Implementasi reducer.** Tambah factory `newSection()` & `newPrefilledHeader()` (re-key supaya unik); ganti helper agar `upsertItems` menerima `sectionKey`+`subGroupKey`; tambah/ubah action:
  - `ADD_HEADER` (tetap; `newHeader()` kini `{...,items:[],sections:[]}`)
  - `ADD_PREFILLED_HEADER{eventKey, header}` → push header (re-key semua node via `rekeyHeader`)
  - `ADD_SECTION{eventKey,headerKey}` / `REMOVE_SECTION{...,sectionKey}` / `SET_SECTION_FIELD{...,sectionKey,field:'name'|'keterangan',value}`
  - `ADD_SUBGROUP{eventKey,headerKey,sectionKey}` / `REMOVE_SUBGROUP{...,subGroupKey}` / `SET_SUBGROUP_FIELD{...,sectionKey,subGroupKey,field,value}`
  - `ADD_ITEM/REMOVE_ITEM/SET_ITEM_FIELD{eventKey,headerKey,sectionKey:string|null,subGroupKey:string|null,...}`
  - `newHeader()` & `newSection()` exported. `rekeyHeader(h)` deep-clone dgn `crypto.randomUUID()` di tiap node.
  Pakai helper `mapHeader`/`mapSection`/`mapSubGroup` immutable (DRY).

- [ ] **Step 4: Jalankan — lulus** `npx vitest run features/loa/loa-form-reducer.test.ts`.
- [ ] **Step 5: Commit** `git commit -m "feat(loa): reducer 3-level (section) + item per-level"`

---

### Task 4: catalog-suggest — searchCategories + packageToHeader 3-level (TDD)
**Files:** Modify `lib/loa/catalog-suggest.ts`, `lib/loa/catalog-suggest.test.ts`

- [ ] **Step 1: Tambah test (gagal dulu)** (pertahankan test `searchMenuItems`):

```ts
import { describe, it, expect } from 'vitest'
import { searchMenuItems, searchCategories, packageToHeader } from './catalog-suggest'
import type { MenuCatalog } from '@/features/loa/types'

const catalog = {
  packages: [{ id: 'pkg-1', namaPaket: 'Full Day Meeting', kategori: 'Meeting Package', hargaPerPax: null, hargaMinimum: null, hasSelection: true,
    components: [
      { componentType: 'coffee_break', nama: 'Coffee Break', qty: 2, sortOrder: 0 },
      { componentType: 'buffet', nama: 'Buffet', qty: 1, sortOrder: 1 },
    ] }],
  categoriesByComponentType: {
    coffee_break: [
      { id: 'c-sav', componentType: 'coffee_break', nama: 'Savoury', rule: {}, groupName: null, items: [
        { id: 'i1', nama: 'Risoles' }, { id: 'i2', nama: 'Lemper' }, { id: 'i3', nama: 'Pastel' }, { id: 'i4', nama: 'Sosis' } ] },
    ],
    buffet: [
      { id: 'c-beef', componentType: 'buffet', nama: 'Beef', rule: {}, groupName: 'Main Course', items: [{ id: 'b1', nama: 'Rendang' }] },
    ],
  },
} as unknown as MenuCatalog

describe('searchCategories', () => {
  it('cari nama kategori daun (case-insensitive)', () => {
    expect(searchCategories(catalog, 'sav')).toContain('Savoury')
    expect(searchCategories(catalog, '')).toEqual([])
  })
})

describe('packageToHeader 3-level', () => {
  it('komponen qty 2 → 2 section bernomor; sub-kategori dari kategori; 3 item contoh', () => {
    const h = packageToHeader(catalog, 'pkg-1')!
    expect(h.name).toBe('Full Day Meeting')
    expect(h.sections.map((s) => s.name)).toEqual(['Coffee Break 1', 'Coffee Break 2', 'Buffet'])
    const cb1 = h.sections[0]
    expect(cb1.subGroups[0].name).toBe('Savoury')
    expect(cb1.subGroups[0].items).toHaveLength(3) // 3 contoh dari 4
    expect(cb1.subGroups[0].items.map((i) => i.name)).toEqual(['Risoles', 'Lemper', 'Pastel'])
  })
  it('paket tak ada → null', () => { expect(packageToHeader(catalog, 'zz')).toBeNull() })
})
```

- [ ] **Step 2: Jalankan — gagal** `npx vitest run lib/loa/catalog-suggest.test.ts`.

- [ ] **Step 3: Implementasi:**

```ts
import type { MenuCatalog, HeaderDraft, SectionDraft, SubGroupDraft, MenuItemDraft } from '@/features/loa/types'

const uid = () => crypto.randomUUID()
const SAMPLE = 3

// searchMenuItems: TETAP seperti yang ada.

/** Nama kategori daun unik dari katalog cocok query. Query kosong → []. Maks 20. */
export function searchCategories(catalog: MenuCatalog, query: string): string[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const names = new Set<string>()
  for (const cats of Object.values(catalog.categoriesByComponentType))
    for (const c of cats) if (c.nama.toLowerCase().includes(q)) names.add(c.nama)
  return [...names].slice(0, 20)
}

/** Buat 1 SubGroupDraft dari kategori katalog + N item contoh. */
export function categoryToSubGroup(catalog: MenuCatalog, componentType: string, categoryName: string): SubGroupDraft {
  const cat = (catalog.categoriesByComponentType[componentType] ?? []).find((c) => c.nama === categoryName)
  const items: MenuItemDraft[] = (cat?.items ?? []).slice(0, SAMPLE).map((it) => ({ key: uid(), name: it.nama, keterangan: '' }))
  return { key: uid(), name: categoryName, keterangan: '', items }
}

/** Paket → HeaderDraft 3-level (section per komponen+occasion, sub-kategori daun, 3 item contoh). */
export function packageToHeader(catalog: MenuCatalog, packageId: string): HeaderDraft | null {
  const pkg = catalog.packages.find((p) => p.id === packageId)
  if (!pkg) return null
  const sections: SectionDraft[] = []
  for (const comp of pkg.components) {
    const cats = catalog.categoriesByComponentType[comp.componentType] ?? []
    for (let o = 1; o <= comp.qty; o++) {
      const subGroups: SubGroupDraft[] = cats.map((c) => {
        const items = c.items.slice(0, SAMPLE).map((it) => ({ key: uid(), name: it.nama, keterangan: '' }))
        return { key: uid(), name: c.nama, keterangan: '', items }
      })
      sections.push({ key: uid(), name: comp.qty > 1 ? `${comp.nama} ${o}` : comp.nama, keterangan: '', items: [], subGroups })
    }
  }
  return { key: uid(), name: pkg.namaPaket, keterangan: '', pax: 0, amount: 0, items: [], sections }
}
```

- [ ] **Step 4: Jalankan — lulus** `npx vitest run lib/loa/catalog-suggest.test.ts`.
- [ ] **Step 5: Commit** `git commit -m "feat(loa): searchCategories + packageToHeader 3-level (tested)"`

---

## FASE 2 — UI

### Task 5: category-combobox + package-combobox
**Files:** Create `features/loa/components/category-combobox.tsx`, `features/loa/components/package-combobox.tsx`

- [ ] **Step 1: `category-combobox.tsx`** — sama pola `ItemCombobox` (input bebas + dropdown saran ringan, TANPA portal/Sheet) tapi sumber saran `searchCategories(catalog, value)`. Props `{ value, onChange, catalog, placeholder='Nama sub-kategori' }`.
- [ ] **Step 2: `package-combobox.tsx`** — buat ulang picker paket (Popover+Command) seperti versi yang dihapus: props `{ packagesByKategori: [string, CatalogPackage[]][], value, onChange(id), container? }`, trigger "Pilih paket...", grup per kategori, CommandItem `value={namaPaket+' '+kategori}`. (Akan dipakai di dalam Sheet/dialog "Tambah dari Paket" → sediakan `container`.)
- [ ] **Step 3: Typecheck** `npx tsc --noEmit`.
- [ ] **Step 4: Commit** `git commit -m "feat(loa): category-combobox + package-combobox (picker)"`

---

### Task 6: menu-tree-editor 3-level + "Tambah dari Paket"
**Files:** Modify `features/loa/components/menu-tree-editor.tsx`, `features/loa/components/step-items.tsx`

**Tanggung jawab editor:** render Header → (item langsung) + Section[]. Tiap Section: nama+keterangan, (item langsung), + Sub-kategori (`CategoryCombobox` → `ADD_SUBGROUP` lalu set namanya; ATAU sederhana: tombol "+ Sub-kategori" buka CategoryCombobox inline), Sub-kategori[] (nama via CategoryCombobox + item via `ItemCombobox`). Tombol: "+ item" (di header/section/subgroup), "+ Komponen" (header→ADD_SECTION), "+ Sub-kategori" (section→ADD_SUBGROUP), hapus di tiap node.

- [ ] **Step 1: menu-tree-editor.tsx** — tambah komponen `SectionCard` (render section + subgroups + items) di antara HeaderCard & SubGroupCard. HeaderCard: items langsung + map `header.sections` → `SectionCard` + tombol "+ Komponen". SectionCard: items langsung + map `section.subGroups` → `SubGroupCard` + "+ Sub-kategori" (pakai `CategoryCombobox`: saat pilih/ketik → `ADD_SUBGROUP` lalu `SET_SUBGROUP_FIELD name`). SubGroupCard: nama (CategoryCombobox) + items (ItemCombobox), dispatch dgn `sectionKey`+`subGroupKey`. Semua `ADD_ITEM/REMOVE_ITEM/SET_ITEM_FIELD` kirim `sectionKey`/`subGroupKey` sesuai posisi (header: null,null).
- [ ] **Step 2: step-items.tsx** — di akhir tiap event, di samping kelola header, tambah tombol **"+ Tambah dari Paket"** → buka `Sheet`/dialog berisi `PackageCombobox` (pakai `packagesByKategori` dari catalog + `container`=node sheet) → onChange(id): `dispatch({ type:'ADD_PREFILLED_HEADER', eventKey, header: packageToHeader(catalog, id)! })` lalu tutup. Pertahankan "+ Tambah Header" (kosong). Guard "Lanjut" tetap (ada ≥1 header).
- [ ] **Step 3: Typecheck + lint** `npx tsc --noEmit && npm run lint`.
- [ ] **Step 4: Verifikasi browser** — "+ Tambah dari Paket" → pilih Full Day Meeting → muncul Header + Coffee Break 1/2 + Buffet + sub-kategori + 3 item contoh; bisa edit/hapus; "+ Sub-kategori" tawarkan kategori katalog; item autocomplete jalan; scroll picker OK.
- [ ] **Step 5: Commit** `git commit -m "feat(loa): editor 3-level + Tambah dari Paket (prefill)"`

---

## FASE 3 — Persistence & Dokumen

### Task 7: saveLoaDraft / getLoaForEdit 4-tingkat
**Files:** Modify `features/loa/actions.ts`

**Save (delete-reinsert):** setelah hapus pohon lama (`delete loa_items where loa_id` → cascade sections/subgroups/menu_items; `delete loa_events where loa_id`), insert: event → header → (header.items: `loa_menu_items{header_id, section_id:null, subgroup_id:null}`) → section (`loa_sections{header_id}`) → (section.items: `loa_menu_items{header_id, section_id, subgroup_id:null}`) → subgroup (`loa_subgroups{section_id, header_id}`) → (subgroup.items: `loa_menu_items{header_id, section_id, subgroup_id}`). `sort_order` urut array.

**Load:** query `loa → loa_events → loa_items(→ loa_sections(→ loa_subgroups), loa_menu_items)`; rakit: untuk tiap header, `header.items` = menu_items dgn `section_id=null && subgroup_id=null`; tiap section: `section.items` = menu_items `section_id=X && subgroup_id=null`; tiap subgroup: items `subgroup_id=Y`. Urut `sort_order`.

- [ ] **Step 1:** Perbarui `saveLoaDraft` loop sesuai di atas (amounts & calc TIDAK berubah: `headers.flatMap`→amount). 
- [ ] **Step 2:** Perbarui `getLoaForEdit` query + perakitan jadi `HeaderDraft{items,sections[]}`, `SectionDraft{items,subGroups[]}`, `SubGroupDraft{items}`. Helper `bySort`.
- [ ] **Step 3: Typecheck** `npx tsc --noEmit`.
- [ ] **Step 4: Verifikasi** (browser/MCP) — prefill paket → Simpan Draft → cek DB: `loa_sections`(2 coffee break+buffet), `loa_subgroups.section_id` terisi, `loa_menu_items` lokasinya benar. Buka ulang → pohon ter-hidrasi sama. Edit → simpan → tak duplikat.
- [ ] **Step 5: Commit** `git commit -m "feat(loa): persist & load pohon 4-tingkat (section)"`

---

### Task 8: doc-preview render 3 level
**Files:** Modify `features/loa/components/doc-preview.tsx`

- [ ] **Step 1:** Di Section II, untuk tiap Header → baris berharga; lalu `header.items` (• item); lalu tiap `section` (sub-judul tebal) → `section.items` (• item) → tiap `subGroup` (sub-judul kecil/indent) → `subGroup.items` (• item — keterangan). Pertahankan kolom & total.
- [ ] **Step 2: Typecheck** `npx tsc --noEmit`.
- [ ] **Step 3: Verifikasi browser** — Preview Dokumen menampilkan Komponen → Sub-kategori → item bertingkat; total benar.
- [ ] **Step 4: Commit** `git commit -m "feat(loa): dokumen render 3 level (komponen→sub-kategori→item)"`

---

## Verifikasi Akhir
- [ ] `npx vitest run` → semua lulus (reducer, catalog-suggest, + existing).
- [ ] `npx tsc --noEmit` → bersih.
- [ ] `npm run build` → sukses.
- [ ] **Manual:** "+ Tambah dari Paket" → Full Day Meeting → struktur 3 level + 3 item contoh; edit/hapus/tambah sub-kategori (combobox katalog) & item (autocomplete); isi pax+amount header; simpan→muat ulang konsisten; preview dokumen rapi; kalkulasi Σ amount benar.

## Peta Spec → Task
| Spec | Task |
|------|------|
| §1 Model +Section | 1,2,3,7 |
| §2 Prefill paket (qty bernomor, 3 contoh) | 4,6 |
| §3 Tambah sub-kategori dari katalog | 4,5,6 |
| §4 UX "Tambah dari Paket" (bukan di kartu) | 5,6 |
| §5 Editing manual semua level | 3,6 |
| §6 Kalkulasi tetap + dokumen 3 level | 8 |
| §7 Migration 008 + persistence | 1,7 |
