-- ============================================================================
-- RESET DATA TRANSAKSI (Order + LOA) — UNTUK TESTING / MULAI BERSIH
-- ============================================================================
-- Menghapus SEMUA order & LOA beserta turunannya, lalu reset penomoran ke -0001.
-- Data MASTER (leads, menu/paket, users, roles) TIDAK tersentuh.
--
-- Cara pakai: Supabase Dashboard → SQL Editor → paste seluruh isi file → Run.
-- (Atau via Supabase MCP.) Hanya jalankan SAAT UAT/testing — JANGAN di produksi
-- yang sudah berisi order asli.
--
-- Urutan aman (anak → induk). FK ON DELETE CASCADE sebenarnya menangani sebagian,
-- tapi DELETE eksplisit di tiap tabel = jelas & idempotent.
-- ============================================================================

BEGIN;

-- 1) Pohon menu LOA (anak-anak loa)
DELETE FROM loa_menu_items;
DELETE FROM loa_subgroups;
DELETE FROM loa_sections;
DELETE FROM loa_items;
DELETE FROM loa_events;

-- 2) Header LOA
DELETE FROM loa;

-- 3) Order + log status
DELETE FROM order_status_logs;
DELETE FROM orders;

-- 4) Reset penomoran (counter atomik). AMAN di sini karena SEMUA order dihapus.
--    ⚠️ Kalau kamu TIDAK menghapus semua order (mis. hanya sebagian), JANGAN
--    DELETE counter — nanti nomor baru bisa bentrok (duplicate key). Sebagai
--    gantinya re-seed dari nomor terakhir (lihat blok di bawah, dikomentari).
DELETE FROM doc_counters;

COMMIT;

-- Verifikasi (opsional): semua transaksi 0, master tetap.
SELECT
  (SELECT count(*) FROM orders)        AS orders,
  (SELECT count(*) FROM loa)           AS loa,
  (SELECT count(*) FROM loa_events)    AS events,
  (SELECT count(*) FROM doc_counters)  AS counters,
  (SELECT count(*) FROM leads)         AS leads_master,
  (SELECT count(*) FROM menu_packages) AS menu_master;

-- ============================================================================
-- ALTERNATIF: re-seed counter (pakai HANYA bila masih ada order tersisa dan
-- kamu sempat menghapus doc_counters). Set last_seq = nomor terakhir yang ada.
-- ----------------------------------------------------------------------------
-- INSERT INTO doc_counters (prefix, last_seq)
-- SELECT left(order_no, 8), max(split_part(order_no, '-', 3)::int)
-- FROM orders WHERE order_no ~ '^UCR-\d{4}-\d+$' GROUP BY left(order_no, 8)
-- ON CONFLICT (prefix) DO UPDATE SET last_seq = excluded.last_seq;
-- INSERT INTO doc_counters (prefix, last_seq)
-- SELECT left(doc_no, 8), max(split_part(doc_no, '-', 3)::int)
-- FROM loa WHERE doc_no ~ '^LOA-\d{4}-\d+$' GROUP BY left(doc_no, 8)
-- ON CONFLICT (prefix) DO UPDATE SET last_seq = excluded.last_seq;
-- ============================================================================
