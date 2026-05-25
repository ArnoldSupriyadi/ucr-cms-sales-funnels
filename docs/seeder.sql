-- ============================================================
-- SEEDER: master_recipes
-- Source: Data_Resep_Katering.csv
-- 29 SKUs. NULL price_per_pax = unit Batch/GR, update manual.
-- ============================================================

INSERT INTO master_recipes (sku, product_name, menu_structure, segment_menu, unit_size, uom, price_per_pax, is_active)
VALUES
  ('FG-0027', 'Nasi Putih', 'Main Course', 'Carbohydrate', '36', 'pax', 3389.0903, true),
  ('FG-0040', 'Telur Pindang', 'Main Course', 'Protein', '3', 'PCS', 6891.8314, true),
  ('FG-0211', 'Ayam Goreng Lengkuas', 'Main Course', 'Carbohydrate', '10', 'pax', 17585.8859, true),
  ('FG-0220', 'Tumis Buncis Wortel', 'Main Course', 'Protein', '10', 'Pax', 1791.4435, true),
  ('FG-0227', 'Tumis Daun Singkong', 'Main Course', 'Vegetable', '50', 'GR', NULL, true),
  ('FG-0578', 'Kerupuk', 'Side Dish / Condiment', 'Indonesian Heritage', '1', 'pax', 1405.3575, true),
  ('FG-0607', 'Ikan Cakalang Fufu', 'Main Course', 'Fish', '10.714285714285714', 'Pax', 7580.5472, true),
  ('FG-0729', 'Kering Kentang', 'Side Dish', 'Vegetables', '1', 'Batch', NULL, true),
  ('FG-0730', 'Tumis Labu Siam', 'Vegetable', 'Vegetables', '1', 'Batch', NULL, true),
  ('FG-0739', 'Tahu Goreng Tepung', 'Side Dish', 'Vegetables', '1', 'Batch', NULL, true),
  ('FG-0760', 'Tempe Goreng', 'Side Dish', 'Vegetables', '1', 'Batch', NULL, true),
  ('FG-0883', 'Bihun Goreng', 'Main Course', 'Protein', '10', 'pax', 4499.6600, true),
  ('FG-1151', 'Sambal Terasi Sachet', 'Sauce', 'Sambal', '1', 'Pcs', 434.3583, true),
  ('FG-1157', 'Tempe Balado', 'Side Dish', 'Vegetables', '1', 'Batch', NULL, true),
  ('FG-1158', 'Beef Rolade Kuah Semur', 'Base', 'Broth', '11.111111111111112', 'Pax', 10377.4049, true),
  ('FG-0026', 'Lemongrass Iced Tea', 'Beverages', 'Tea', '10', 'pax', 2989.7121, true),
  ('FG-0055', 'Sambal Bawang', 'WIP', '0', '1', 'Pax', 866.6840, true),
  ('FG-0163', 'Ayam Singgang', 'Main Course', 'Protein', '10', 'pax', 7125.2562, true),
  ('FG-0188', 'Dendeng Kering Batoko', 'Main Course', 'Protein', '10', 'pax', 15561.0438, true),
  ('FG-0198', 'Tumis Daun Melinjo Ikan Teri', 'Main Course', 'Vegetables', '10', 'pax', 5280.5393, true),
  ('FG-0282', 'Choco Éclair CB', 'Snack', 'Carbohydrate', '1', 'Pax', 3314.7480, true),
  ('FG-0300', 'Lychee Pudding', 'Dessert', 'Carbohydrate + Dairy', '1', 'Pax', 2242.5591, true),
  ('FG-0304', 'Choco Mouse Cup', 'Dessert', 'Fat + Dairy', '1', 'pax', 5159.9651, true),
  ('FG-0332', 'Lemper Ayam-CB', 'Snack', 'Carbohydrate + Protein', '1', 'Pax', 4541.8719, true),
  ('FG-0444', 'Coffee & Tea', 'Beverages', 'Coffe And Tea', '50', 'pax', 6029.0825, true),
  ('FG-0452', 'Assorted Sliced Fruit', 'Dessert', 'Fruit & Refreshment', '100', 'pax', 5111.9570, true),
  ('FG-0535', 'Mineral Water By Dispenser', 'Dispenser', '0', '0', '0', NULL, true),
  ('FG-0595', 'Sup Baso Sapi', 'Soup', 'Beef', '5', 'Pax', 12488.7360, true),
  ('FG-0925', 'Mineral Water by Bottle', 'Subcon', '0', '1', 'Batch', NULL, true);

-- SKUs dengan price_per_pax NULL (unit Batch/GR) — update manual via UI:
-- FG-0227: Tumis Daun Singkong (unit: 50 GR)
-- FG-0729: Kering Kentang (unit: 1 Batch)
-- FG-0730: Tumis Labu Siam (unit: 1 Batch)
-- FG-0739: Tahu Goreng Tepung (unit: 1 Batch)
-- FG-0760: Tempe Goreng (unit: 1 Batch)
-- FG-1157: Tempe Balado (unit: 1 Batch)
-- FG-0535: Mineral Water By Dispenser (unit: 0 0)
-- FG-0925: Mineral Water by Bottle (unit: 1 Batch)

-- ============================================================
-- SEEDER: menu_packages
-- Source: Katalog_Umum_Umara.csv
-- 25 paket menu dengan harga jual (untuk dropdown LoA).
-- ++ = belum include tax & delivery.
-- ============================================================

INSERT INTO menu_packages (kategori, nama_paket, harga_minimum, harga_maksimum, satuan, ketentuan, is_active)
VALUES
  ('Stall (Gubukan)', 'Indonesian Rice Stall', 120000, 135000, 'per pax', 'Min order Rp 12.000.000++ (Belum Tax & Delivery)', true),
  ('Stall (Gubukan)', 'Indonesian Breakfast Stall', 55000, 85000, 'per pax', 'Min order Rp 12.000.000++ (Belum Tax & Delivery)', true),
  ('Stall (Gubukan)', 'Aneka Jajanan', 50000, 80000, 'per pax', 'Min order Rp 12.000.000++ (Belum Tax & Delivery)', true),
  ('Stall (Gubukan)', 'Kambing Guling', 4400000, NULL, 'per 30-40 pax', 'Min order Rp 12.000.000++ (Belum Tax & Delivery)', true),
  ('Snack Box & Kue Tampah', 'Snack Box Premium', 50000, NULL, 'per box', 'Min 50 box (Belum Tax & Delivery)', true),
  ('Snack Box & Kue Tampah', 'Snack Box Regular', 35000, NULL, 'per box', 'Min 50 box (Belum Tax & Delivery)', true),
  ('Snack Box & Kue Tampah', 'Kue Tampah Small (70 pcs)', 750000, NULL, 'per tampah', 'Min order berlaku', true),
  ('Snack Box & Kue Tampah', 'Kue Tampah Medium (90 pcs)', 850000, NULL, 'per tampah', 'Min order berlaku', true),
  ('Snack Box & Kue Tampah', 'Kue Tampah Large (110 pcs)', 1050000, NULL, 'per tampah', 'Min order berlaku', true),
  ('Meal Box', 'Signature Meal Box', 75000, NULL, 'per box', 'Min 50 box (Belum Tax & Delivery)', true),
  ('Meal Box', 'Premium Meal Box', 60000, NULL, 'per box', 'Min 50 box (Belum Tax & Delivery)', true),
  ('Meal Box', 'Medium Meal Box', 40000, NULL, 'per box', 'Min 50 box (Belum Tax & Delivery)', true),
  ('Meal Box', 'Regular Meal Box', 35000, NULL, 'per box', 'Min 50 box (Belum Tax & Delivery)', true),
  ('Meal Box', 'Long Box Premium', 135000, 140000, 'per box', 'Min 50 box (Belum Tax & Delivery)', true),
  ('Meal Box', 'Nasi Besek Umara', 98000, 100000, 'per besek', 'Min 50 box (Belum Tax & Delivery)', true),
  ('Meal Box', 'Nasi Bakul Umara (6 pax)', 980000, NULL, 'per bakul', 'Min 50 box/order', true),
  ('Meal Box', 'Nasi Bakul Umara (12 pax)', 1700000, NULL, 'per bakul', 'Min 50 box/order', true),
  ('Meal Box', 'Nasi Tumpeng (12 pax)', 1700000, NULL, 'per tumpeng', '-', true),
  ('Meal Box', 'Nasi Tumpeng (25 pax)', 3100000, NULL, 'per tumpeng', '-', true),
  ('Meal Box', 'Nasi Tumpeng (40 pax)', 4800000, NULL, 'per tumpeng', '-', true),
  ('Buffet', 'Indonesian Buffet', 189000, NULL, 'per pax', 'Min order Rp 12.000.000++ (Belum Tax & Delivery)', true),
  ('Buffet', 'Asian Buffet', 199000, NULL, 'per pax', 'Min order Rp 12.000.000++ (Belum Tax & Delivery)', true),
  ('Buffet', 'Western Buffet', 239000, NULL, 'per pax', 'Min order Rp 12.000.000++ (Belum Tax & Delivery)', true),
  ('Meeting Package', 'Full Day - Indonesian Buffet', 369000, NULL, 'per pax', 'Min order Rp 12.000.000++ (Belum Tax & Delivery)', true),
  ('Meeting Package', 'Full Day - Asian Buffet', 389000, NULL, 'per pax', 'Min order Rp 12.000.000++ (Belum Tax & Delivery)', true);