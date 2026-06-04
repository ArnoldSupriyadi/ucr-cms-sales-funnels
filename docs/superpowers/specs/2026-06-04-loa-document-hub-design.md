# Keputusan Arsitektur: LoA sebagai Pusat Dokumen

**Tanggal:** 2026-06-04
**Status:** Disepakati
**Pemicu:** Pertanyaan "apakah tabel `orders` masih diperlukan, mengingat IB & BEO digenerate dari LoA?"

## Konteks

Alur produk: **Lead → Order → LoA → (IB + BEO)**.
- `orders` = lapisan booking/CRM (pipeline Tentative/Definite/Actual/Cancel, `order_no`, lead, sales, event detail).
- `loa` = lapisan perjanjian (1:1 dgn order via `loa.booking_id`, harga, item, status dokumen draft/approved/...).
- IB (Internal Breakdown) & BEO (Banquet Event Order) = dokumen turunan dari LoA.

## Keputusan

1. **`orders` TETAP dipertahankan.** Order dan LoA adalah dua lapisan berbeda dari satu acara, bukan duplikat:
   - Order lahir **sebelum** LoA; banyak order (Tentative/Cancel) **tak pernah** jadi LoA.
   - Status order (pipeline CRM) ortogonal terhadap status LoA (workflow dokumen) — order bisa "Definite" saat LoA masih "draft".
   - Laporan/target/funnel sales menghitung dari order; `order_no` terbit saat booking, sebelum LoA ada.
   - "Ambil dari LoA id" hanya mungkin SETELAH LoA ada — seluruh funnel pra-LoA butuh order.

2. **LoA = pusat (hub) rantai dokumen.** IB & BEO mengambil sumber data dari **LoA (`loa_id`)**, bukan dari order:
   - IB ← `net_revenue` (basis revenue) + item LoA.
   - BEO ← daftar item + `menu_detail` LoA.

3. **IB & BEO terbuka begitu LoA ADA (draft cukup).** Tidak menunggu approval. Sebelum LoA dibuat, tombol IB/BEO terkunci dengan keterangan "Buat LoA dulu".

4. **Tanpa perubahan DB & URL.** Skema database tidak berubah. Route tetap `/orders/[id]/{loa,ib,beo}` (LoA 1:1 dgn order → resolusi otomatis). Perubahan murni di lapisan UX + arah aliran data.

## Catatan: redundansi data sudah minim

Tidak ada kolom yang disalin ganda. Order menyimpan event detail; LoA menyimpan miliknya sendiri (setup_location, harga, item); IB/BEO baca dari LoA. "Rasa ribet" yang dikeluhkan adalah **navigasi berlapis**, bukan data ganda — diselesaikan lewat gating + entry point, bukan ubah skema.

## Implikasi untuk pekerjaan berikutnya

- **Gating UI (kecil):** di kartu Dokumen detail order, kunci IB/BEO sampai LoA ada; setelah LoA tersimpan, munculkan "Generate IB" & "Generate BEO".
- **IB & BEO (besar, nanti):** server action + halaman, sumber `loa_id`.
- **PDF LoA (berikutnya):** target dokumen = LoA; keputusan ini menegaskan LoA sebagai dokumen yang di-PDF-kan dan menjadi sumber IB/BEO.
