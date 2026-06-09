-- 007: Longgarkan loa_items.pax check (model lama wajib >0; model pohon baru pax Header boleh 0).
-- Di redesign multi-event, amount Header = sumber kebenaran; pax untuk display/price (amount/pax).
-- Header tanpa pax (0) valid → CHECK(pax > 0) lama menolaknya saat simpan.

ALTER TABLE loa_items DROP CONSTRAINT IF EXISTS loa_items_pax_check;
ALTER TABLE loa_items ADD CONSTRAINT loa_items_pax_check CHECK (pax >= 0);
