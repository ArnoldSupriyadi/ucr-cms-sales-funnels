-- Bersihkan 5 package duplikat di menu_packages (nama sama, UUID beda).
-- Versi yang DIHAPUS adalah versi "rusak": harga_per_pax NULL & has_selection=false,
-- dan terbukti punya 0 baris di menu_package_components (tidak ada anak/komponen).
-- Versi yang BENAR (ada harga + has_selection=true) tetap dipertahankan.
--
-- Diverifikasi 3 Juni 2026: kelima UUID di bawah punya 0 components.
-- menu_package_components ber-FK ON DELETE CASCADE, jadi tidak ada baris yatim.
-- Tabel turunan LoA belum dibangun, jadi tidak ada referensi lain.

BEGIN;

DELETE FROM menu_packages
WHERE id IN (
  '1f2a340c-8024-453e-956b-8dc976bd97fe',  -- Indonesian Buffet (rusak: harga NULL, has_selection=false)
  'b14b1031-d866-4a36-9c5d-62d05b84b751',  -- Asian Buffet      (rusak: harga NULL, has_selection=false)
  '01014bf9-b6d1-4883-b473-4916b4fdb0b0',  -- Western Buffet    (rusak: harga NULL, has_selection=false)
  '643bfbf6-3a4c-4904-85df-8c5cc046a86a',  -- Nasi Bakul Umara (6 pax)  (duplikat)
  '0c4d714a-b9a2-4fc5-87ea-4ae3f6e663a7'   -- Nasi Bakul Umara (12 pax) (duplikat)
);
-- Harus menghapus tepat 5 baris. Kalau jumlahnya beda, ROLLBACK dan cek dulu.

COMMIT;

-- Verifikasi sesudah jalan (harus 0 baris):
--   SELECT nama_paket, kategori, COUNT(*)
--   FROM menu_packages
--   GROUP BY nama_paket, kategori
--   HAVING COUNT(*) > 1;
