-- ============================================================
-- UCR SALES FUNNEL — seeder_menus.sql
-- Seed: menu_packages, menu_package_components,
--       menu_catalog_categories, menu_catalog_items
-- Jalankan SETELAH migration_001_init.sql
-- ============================================================

BEGIN;

-- MEETING PACKAGES
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('87a7f19e-fa0d-4566-8c4b-185bc03746ad','Meeting Package','Full Day','Full Day Meeting Package (Indonesian Buffet)',369000,'per pax',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('86b91e1b-d809-46f2-9a19-dcc76f882b48','87a7f19e-fa0d-4566-8c4b-185bc03746ad','coffee_break','Coffee Break',2,0);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('8d117034-3e03-4d4f-8fac-75432741cd43','87a7f19e-fa0d-4566-8c4b-185bc03746ad','indonesian_buffet','Indonesian Buffet',1,1);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('b178744b-daaa-46fd-9d6f-1b8ca3e25283','Meeting Package','Full Day','Full Day Meeting Package (Asian Buffet)',389000,'per pax',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('546cd242-9078-40ff-8c10-0c64cd84b28a','b178744b-daaa-46fd-9d6f-1b8ca3e25283','coffee_break','Coffee Break',2,0);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('9c5e66de-b907-4f6b-a1a6-26e7373d4ddd','b178744b-daaa-46fd-9d6f-1b8ca3e25283','asian_buffet','Asian Buffet',1,1);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('b91ec01a-7667-4323-a104-93fd1fa23596','Meeting Package','Full Day','Full Day Meeting Package (Western Buffet)',399000,'per pax',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('8e54f405-3801-4a10-bc83-634ba3d83462','b91ec01a-7667-4323-a104-93fd1fa23596','coffee_break','Coffee Break',2,0);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('a9037957-435d-4394-a756-e7ed36594aed','b91ec01a-7667-4323-a104-93fd1fa23596','western_buffet','Western Buffet',1,1);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('f2b80585-7c02-423a-84a0-0041adf4bfd0','Meeting Package','Half Day','Half Day Meeting Package (Indonesian Buffet)',279000,'per pax',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('4a98cded-c040-4768-9aa8-a56a489f833a','f2b80585-7c02-423a-84a0-0041adf4bfd0','coffee_break','Coffee Break',1,0);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('72468910-b012-4149-b684-0cb01c27bf9b','f2b80585-7c02-423a-84a0-0041adf4bfd0','indonesian_buffet','Indonesian Buffet',1,1);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('559ff5b9-60f5-4353-b890-4e209d31cb99','Meeting Package','Half Day','Half Day Meeting Package (Asian Buffet)',289000,'per pax',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('fcfd1887-3779-438d-9098-8a9fd5741d00','559ff5b9-60f5-4353-b890-4e209d31cb99','coffee_break','Coffee Break',1,0);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('9501f0af-60ee-47de-8068-7cf55452452a','559ff5b9-60f5-4353-b890-4e209d31cb99','asian_buffet','Asian Buffet',1,1);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('2de2a0da-b2a8-4f46-b41c-20f67100afe2','Meeting Package','Half Day','Half Day Meeting Package (Western Buffet)',319000,'per pax',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('01f0cfc6-abb3-42b6-9be8-a69bfb9b78ff','2de2a0da-b2a8-4f46-b41c-20f67100afe2','coffee_break','Coffee Break',1,0);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('97a4c584-3c48-4a9d-8504-5e646e86d929','2de2a0da-b2a8-4f46-b41c-20f67100afe2','western_buffet','Western Buffet',1,1);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('546410d2-3d0a-4815-aeb6-5c8180d0dd7f','Buffet','Indonesian','Indonesian Buffet',189000,'per pax',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('fce52d29-ad14-4d24-817a-c59f9abdc0b8','546410d2-3d0a-4815-aeb6-5c8180d0dd7f','indonesian_buffet','Indonesian Buffet',1,0);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('64f13ad3-d585-43ab-b658-377ab5b2ce6a','Buffet','Asian','Asian Buffet',199000,'per pax',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('601bf2b6-e5ec-46e1-b691-6c3059f72f6b','64f13ad3-d585-43ab-b658-377ab5b2ce6a','asian_buffet','Asian Buffet',1,0);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('b447823f-3e88-4906-9a07-a9dc840982c6','Buffet','Western','Western Buffet',239000,'per pax',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('4ca07ae5-7184-4026-8bd7-ccc1c6bec050','b447823f-3e88-4906-9a07-a9dc840982c6','western_buffet','Western Buffet',1,0);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('d491ad95-4122-49ef-af88-543ffb161c83','Meeting Package','Coffee Break','Coffee Break',99000,'per pax',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('f9a3d44e-c998-4664-81a7-37e5dddf061b','d491ad95-4122-49ef-af88-543ffb161c83','coffee_break','Coffee Break',1,0);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('92b6039a-474b-4136-a49e-21ea43ab0bff','Meeting Package','Canape','Canape',135000,'per pax',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('2235f8eb-0a2e-44ea-850d-45dfa9138fd7','92b6039a-474b-4136-a49e-21ea43ab0bff','canape','Canape',1,0);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('dd713748-dae5-4269-9fe7-7d28a7b82f1d','Meeting Package','Beverage Package','Beverage Package (2 Hours)',95000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('bfcc57ca-ef92-49ce-9831-c4bf4a63690e','Meeting Package','Set Menu','Set Menu',575000,'per pax',false,false,NULL,true);

-- BUFFET CATALOG
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('eab966a3-ee66-43f3-9e3a-381c1bf7ec88','indonesian_buffet','Starters','one',NULL,0);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('58f6098b-5a36-4e5f-89fe-0c0817118c94','indonesian_buffet','Appetizer','one','eab966a3-ee66-43f3-9e3a-381c1bf7ec88',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7c3a7e86-698c-4fd0-ae0c-cbb88879e62c','58f6098b-5a36-4e5f-89fe-0c0817118c94','Selada Ayam Bali',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4ecdd992-8382-442f-b888-0612adb60cb3','58f6098b-5a36-4e5f-89fe-0c0817118c94','Asinan Jakarta',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('6a160d1d-bda6-4ac0-8ffc-1b564ed8bacd','58f6098b-5a36-4e5f-89fe-0c0817118c94','Rujak Pengantin',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('8db3948c-486d-41fd-bd7b-b988d0268038','58f6098b-5a36-4e5f-89fe-0c0817118c94','Asinan Buah Bogor',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2a3d1ea8-5986-49c5-bccf-15f4deb955a6','58f6098b-5a36-4e5f-89fe-0c0817118c94','Gado-gado Siram',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('08189c94-46ff-45d0-92ce-febf2ac1a307','58f6098b-5a36-4e5f-89fe-0c0817118c94','Karedok',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('292fda69-7b98-4b7f-bd42-a61b7359a2c6','58f6098b-5a36-4e5f-89fe-0c0817118c94','Lumpia Semarang',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1e41360f-744b-4782-ada5-09a841e7f929','58f6098b-5a36-4e5f-89fe-0c0817118c94','Kohu-Kohu Salad',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('5b3aa61a-4562-4aeb-bea4-84ad82c415eb','58f6098b-5a36-4e5f-89fe-0c0817118c94','Tahu Telor Surabaya',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('f428f5fe-e361-47e2-b1c7-df3b92a1e2ab','58f6098b-5a36-4e5f-89fe-0c0817118c94','Rujak Juhi',9);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('93dccf10-6086-4d96-80e8-6bf22c163a7c','indonesian_buffet','Soup','one','eab966a3-ee66-43f3-9e3a-381c1bf7ec88',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('db07aa21-307b-4692-aec6-f6e1d91067f6','93dccf10-6086-4d96-80e8-6bf22c163a7c','Sup Tekwan',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('20190a27-2d56-4642-8c4e-41f4390ebd65','93dccf10-6086-4d96-80e8-6bf22c163a7c','Soto Ayam Lamongan',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('c8c266ff-f01f-4b44-a032-3d9dc1b764d0','93dccf10-6086-4d96-80e8-6bf22c163a7c','Soto Bandung',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1e0900c9-2e36-45c8-9b90-edaef04ef1fe','93dccf10-6086-4d96-80e8-6bf22c163a7c','Soto Jakarta',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('491a6b15-911b-4b1e-b952-b0e1f64a365a','93dccf10-6086-4d96-80e8-6bf22c163a7c','Sup Baso Sapi',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('802508f3-b77b-4f6e-96f3-170319d13bb0','93dccf10-6086-4d96-80e8-6bf22c163a7c','Sup Kimlo',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9c5442f0-fbe5-48ee-aba2-e52ba5daf22c','93dccf10-6086-4d96-80e8-6bf22c163a7c','Soto Kuning Bogor',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('850df81c-c64d-4b7c-bfa1-68b13aaa884d','93dccf10-6086-4d96-80e8-6bf22c163a7c','Soto Banjar',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('d7d332c0-de83-474f-9cff-91dbeaec7550','93dccf10-6086-4d96-80e8-6bf22c163a7c','Soto Semarang',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('583ea63f-1aa1-4e7c-9991-dfbee2669122','93dccf10-6086-4d96-80e8-6bf22c163a7c','Soto Ayam Padang',9);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('297b7707-bcc7-4c5c-909f-16ae3490a7d1','93dccf10-6086-4d96-80e8-6bf22c163a7c','Soto Kudus',10);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('96dce080-fa2d-4b0f-aabf-2a6a7d1f4878','93dccf10-6086-4d96-80e8-6bf22c163a7c','Soto Ambengan',11);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('f5c20003-f2c3-4f93-8182-42f8518fbc67','indonesian_buffet','Rice','multiple',NULL,1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('14696064-7d5b-4b49-a95e-14b8f409a94d','f5c20003-f2c3-4f93-8182-42f8518fbc67','Nasi Putih',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('289b0e98-1e04-4c1d-a51d-643533fd9153','f5c20003-f2c3-4f93-8182-42f8518fbc67','Nasi Goreng Kampung',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('afd56790-411f-41ee-b206-e0d123a715fe','f5c20003-f2c3-4f93-8182-42f8518fbc67','Nasi Daun Jeruk',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e193a7ab-2f68-490d-ad3b-6fe31ebd8523','f5c20003-f2c3-4f93-8182-42f8518fbc67','Nasi Goreng Kecombrang',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('087c84a4-b45b-4729-ace3-4644f4993ff9','f5c20003-f2c3-4f93-8182-42f8518fbc67','Nasi Goreng Teri Sambal Ijo',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2b6d6b86-04ff-4cc6-a426-f48c55a1c012','f5c20003-f2c3-4f93-8182-42f8518fbc67','Nasi Minyak Palembang',5);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('b27d42de-9713-40cc-88e0-15fb76565c4a','indonesian_buffet','Main Course','multiple',NULL,2);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('a6ede4a1-f5b7-4f67-98a4-7de80e205186','indonesian_buffet','Beef','multiple','b27d42de-9713-40cc-88e0-15fb76565c4a',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0b9180b9-adf9-48b5-8e40-a4ecfa2f2d33','a6ede4a1-f5b7-4f67-98a4-7de80e205186','Dendeng Kering Batoko',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0aa826a9-927e-4f2c-bec5-3eba60db1692','a6ede4a1-f5b7-4f67-98a4-7de80e205186','Beef Rendang',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('645d1284-3468-4756-936c-e53f40653537','a6ede4a1-f5b7-4f67-98a4-7de80e205186','Empal Balado',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('09155659-daac-483c-82f1-4d21ac7e5cf9','a6ede4a1-f5b7-4f67-98a4-7de80e205186','Empal Serundeng',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('5e015049-6800-4b8f-ac3c-18f9fd63c17c','a6ede4a1-f5b7-4f67-98a4-7de80e205186','Bistik Sapi Umara',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b0929e19-7749-4132-a0e1-154cb803e88b','a6ede4a1-f5b7-4f67-98a4-7de80e205186','Sapi Sambal Lado Hijau',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('78880146-f638-4729-8bbe-0acce23dca03','a6ede4a1-f5b7-4f67-98a4-7de80e205186','Daging Sapi Karo',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('18f188ad-925b-4546-83f2-105ca0517b47','a6ede4a1-f5b7-4f67-98a4-7de80e205186','Terik Daging Sapi',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('abea6d77-1253-4e7d-aecb-5c68a91cb168','a6ede4a1-f5b7-4f67-98a4-7de80e205186','Daging Masak Tuha',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e8e08d2d-04d9-40a6-876e-0d6880436b93','a6ede4a1-f5b7-4f67-98a4-7de80e205186','Daging Sie Reuboh',9);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('99fc20d7-1d7c-4ead-b9d1-e33ba9bcfea9','indonesian_buffet','Chicken','multiple','b27d42de-9713-40cc-88e0-15fb76565c4a',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('5e93fe63-f9be-49b6-b98e-e55afbadce9f','99fc20d7-1d7c-4ead-b9d1-e33ba9bcfea9','Ayam Bakar Bali',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('76dda367-5cde-4229-81f8-81a4703e6042','99fc20d7-1d7c-4ead-b9d1-e33ba9bcfea9','Ayam Seset Pedas',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('6e1959a1-bf36-4cd7-aae8-8635f286e356','99fc20d7-1d7c-4ead-b9d1-e33ba9bcfea9','Ayam Suwir Kecombrang',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('64d6f6e7-7a33-48c7-ad83-8c4c43ded1f7','99fc20d7-1d7c-4ead-b9d1-e33ba9bcfea9','Ayam Singgang',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e638a7ce-fd68-4e57-b3ab-257b0c9d78e3','99fc20d7-1d7c-4ead-b9d1-e33ba9bcfea9','Ayam Goreng Kemangi',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('f1367926-84ab-45b2-894f-4c7524012cdf','99fc20d7-1d7c-4ead-b9d1-e33ba9bcfea9','Ayam Woku Belanga',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4e4104c8-6b60-44b1-946c-c528853ca065','99fc20d7-1d7c-4ead-b9d1-e33ba9bcfea9','Ayam Bakar Cincane',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('d4c29294-6884-4e2d-945d-3424ef616376','99fc20d7-1d7c-4ead-b9d1-e33ba9bcfea9','Ayam Bakar Taliwang',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('c4510039-36d3-47f4-9452-3d463539aacd','99fc20d7-1d7c-4ead-b9d1-e33ba9bcfea9','Ayam Goreng Bawang Putih',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('cdacfd0d-6c6d-45e3-8aaa-4232583e8235','99fc20d7-1d7c-4ead-b9d1-e33ba9bcfea9','Ayam Biromaru',9);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('0cbbcd64-d5d0-4e58-8bc6-be901bf70208','indonesian_buffet','Fish & Seafood','multiple','b27d42de-9713-40cc-88e0-15fb76565c4a',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1f2ff802-17b8-48d1-9e98-9d6294b932bf','0cbbcd64-d5d0-4e58-8bc6-be901bf70208','Ikan Bakar Kecap Limau',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2aee6d9b-3aee-416a-9497-3edca2c9dc75','0cbbcd64-d5d0-4e58-8bc6-be901bf70208','Cakalang Woku',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7273ae00-46aa-4b0a-894f-0d0029cf5d98','0cbbcd64-d5d0-4e58-8bc6-be901bf70208','Ikan Sambal Lado',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('f57f4d4b-9819-4c08-a07c-77eef3693b2a','0cbbcd64-d5d0-4e58-8bc6-be901bf70208','Sambal Goreng Udang Kapri',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ff2138fb-d68c-4e05-8027-bc7beca640f9','0cbbcd64-d5d0-4e58-8bc6-be901bf70208','Gulai Ikan Medan',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('8d5d3da3-627d-4505-b4c1-bf5f1c6b8b0a','0cbbcd64-d5d0-4e58-8bc6-be901bf70208','Ikan Kakap Putih Sambal Mangga',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1c7d7a56-d0e0-4d51-b859-9909f76a586f','0cbbcd64-d5d0-4e58-8bc6-be901bf70208','Ikan Goreng Kuah Pesmol',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('68aee355-d1d7-4979-9797-8475d8fe40b3','0cbbcd64-d5d0-4e58-8bc6-be901bf70208','Ikan Cakalang Fufu',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('64e73002-8d37-4510-bfc3-e96c110380f4','0cbbcd64-d5d0-4e58-8bc6-be901bf70208','Ikan Bakar Jimbaran',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4dc5ad21-a935-4814-8517-a35eab7c684a','0cbbcd64-d5d0-4e58-8bc6-be901bf70208','Ikan Steam Tauco',9);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('ebc1773e-931e-4f89-81be-4d0a7496adf1','indonesian_buffet','Noodle','multiple','b27d42de-9713-40cc-88e0-15fb76565c4a',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4282b233-1f49-46f9-952a-8f5a5416a7e8','ebc1773e-931e-4f89-81be-4d0a7496adf1','Bihun Goreng Sawi',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0c3c9eeb-f003-4573-a3b4-668ba7b15791','ebc1773e-931e-4f89-81be-4d0a7496adf1','Mie Goreng Jawa',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('56bd9bb0-7941-445c-8ed2-cea1b655b2ab','ebc1773e-931e-4f89-81be-4d0a7496adf1','Kwetiau Goreng',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('a123ce7a-74b2-4725-a5fa-4be7a6ba4c02','ebc1773e-931e-4f89-81be-4d0a7496adf1','Mie Titi Makassar',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('be4700c5-7b6f-4eb0-8852-da0f2c560fc6','ebc1773e-931e-4f89-81be-4d0a7496adf1','Mie Aceh',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('8a83fbe5-d61e-4a83-81bf-63cb463e1cac','ebc1773e-931e-4f89-81be-4d0a7496adf1','Mie Gomak',5);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('aa580d1c-d69c-4ce0-b9d1-f88d0ec25bdd','indonesian_buffet','Vegetable','multiple','b27d42de-9713-40cc-88e0-15fb76565c4a',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('3f488e95-4a4e-4e2d-b034-d15ae4aa5ae3','aa580d1c-d69c-4ce0-b9d1-f88d0ec25bdd','Tumis Buncis Jagung Muda',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e4b6e19c-482c-497d-a4e5-d197c8db28d6','aa580d1c-d69c-4ce0-b9d1-f88d0ec25bdd','Gulai Daun Singkong',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('afaed75a-b91c-408e-b494-815cb782ac59','aa580d1c-d69c-4ce0-b9d1-f88d0ec25bdd','Remet Nangka',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1e6017ff-fe41-4175-bdb5-3dd1918e35b7','aa580d1c-d69c-4ce0-b9d1-f88d0ec25bdd','Tumis Jagung Manis Ikan Jambal',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('70eda649-931d-4301-bda2-5826303a9aaf','aa580d1c-d69c-4ce0-b9d1-f88d0ec25bdd','Tumis Daun Melinjo Ikan Teri',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('478ddb3f-6910-4844-80e9-582e063907b3','aa580d1c-d69c-4ce0-b9d1-f88d0ec25bdd','Tumis Daun Singkong & Bunga Pepaya Ikan Teri',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4aaf7065-72d0-4d64-ba25-272b654afc40','aa580d1c-d69c-4ce0-b9d1-f88d0ec25bdd','Terong Raos',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('f0791feb-a0bf-497e-a8bb-ac3d6185590d','aa580d1c-d69c-4ce0-b9d1-f88d0ec25bdd','Serombotan Bali',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('37da86c5-a6b1-4aa7-b3a5-caf1520fa0f4','aa580d1c-d69c-4ce0-b9d1-f88d0ec25bdd','Tumis Kacang Panjang Tempe',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('6d642eda-eeed-4e87-9ade-ad9f577c834f','aa580d1c-d69c-4ce0-b9d1-f88d0ec25bdd','Capjae Jawa',9);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('1eb796ba-2623-441a-bd93-2a4f869f0cf7','indonesian_buffet','Desserts','multiple',NULL,3);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','indonesian_buffet','Mini Cakes','multiple','1eb796ba-2623-441a-bd93-2a4f869f0cf7',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('a9c2f776-0fb5-4b49-b659-cbe2ef0982d2','2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','Green Tea Cake',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('be2c8a8f-cf71-4b12-8f8e-3caca2931808','2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','Chocolate Mousse',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('10a3e795-cb5f-483e-a003-ff797fe62b7f','2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','Oreo Cheese Cake',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1e5aecb3-ef53-48c2-8732-d33094c8a45e','2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','Red Velvet Cake',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('48795081-c308-4716-a2f1-9605978d54d3','2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','Salted Choco Crunchy',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('57d8cb7d-1ba8-45a4-8bee-5651f644dc73','2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','Choco Eclair',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('179c02ec-45bf-4eb4-91de-ab5c86a3c651','2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','Strawberry Panacota',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ce20473d-1c30-4ce7-ada4-9c352d0b573e','2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','Berry Choux',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0cb7da29-11d2-4e20-bebf-7dd51e61530a','2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','Banofee Pie',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('cc8d0821-1ddb-40f3-acfa-c33cc95f318b','2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','Burnt Cheese Cake',9);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('a69e0ec1-7476-4b80-8e76-fb27c6d5d34f','2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','Taro Cake',10);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('c33c7ce8-4d67-43e2-ad47-f43cc5492d09','2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','Carrot Cake',11);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('12c0906d-5bd8-432a-bff7-69cf6bf7dcee','2da9a41a-2a48-4d7d-a272-b8b9afeb38c5','Lychee Cake',12);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('a8a05707-86f0-4189-8319-a3661fbdc725','indonesian_buffet','Puddings','multiple','1eb796ba-2623-441a-bd93-2a4f869f0cf7',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ef3e6a26-9fce-4c9e-a1b0-f70ad571bf0d','a8a05707-86f0-4189-8319-a3661fbdc725','Melon Pudding',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0cd66610-8bf3-4185-90cd-ac15164b29fd','a8a05707-86f0-4189-8319-a3661fbdc725','Pineapple Pudding',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4bb637e7-9472-46c6-8c4e-bbd8ac5307a3','a8a05707-86f0-4189-8319-a3661fbdc725','Chocolate Pudding',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('6070b291-4b54-4cdf-9451-3bcebc710e24','a8a05707-86f0-4189-8319-a3661fbdc725','Caramel Pudding',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('a2088b36-ac3a-44d5-a1c6-270f024b56e1','a8a05707-86f0-4189-8319-a3661fbdc725','Coffee Jelly Pudding',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0d6f34a5-1e14-4f26-ad04-3d369d557ead','a8a05707-86f0-4189-8319-a3661fbdc725','Pudding Lumut Pandan',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('229632f9-2955-493c-9147-21cb4cde08c1','a8a05707-86f0-4189-8319-a3661fbdc725','Orange Pudding',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('fe77a0c7-2ecc-4f32-b31b-e09584f79452','a8a05707-86f0-4189-8319-a3661fbdc725','Taro Pudding',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2d219083-4f97-40e5-be41-96141cc73846','a8a05707-86f0-4189-8319-a3661fbdc725','Lychee Pudding',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('741fa6b3-049d-46d0-9c5a-a90e4662d3a3','a8a05707-86f0-4189-8319-a3661fbdc725','Lime Cake',9);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('e7e3b2ed-1c83-4a85-bf42-7f9a440fa289','indonesian_buffet','Beverages','multiple',NULL,4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9e084df2-f14b-4468-8d35-0a94aee7cebc','e7e3b2ed-1c83-4a85-bf42-7f9a440fa289','Mineral Water',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('98157352-5a19-4dc2-b17c-220d0a80cdb0','e7e3b2ed-1c83-4a85-bf42-7f9a440fa289','Lemongrass Iced Tea',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('db42856b-7165-4ad5-b535-a2207cbfd361','e7e3b2ed-1c83-4a85-bf42-7f9a440fa289','Lemon Iced Tea',2);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('4b7fb7ea-48f5-46ac-937f-2f4fc3008075','asian_buffet','Starters','one',NULL,0);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('ac267c75-5229-491b-8a1f-7c1e10b04f8d','asian_buffet','Appetizer','one','4b7fb7ea-48f5-46ac-937f-2f4fc3008075',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('808ece6e-bc95-4ec3-8682-eb51a59cb1f7','ac267c75-5229-491b-8a1f-7c1e10b04f8d','Asian Green Salad',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('56215d3c-ab1b-47c9-8038-37843c426f8b','ac267c75-5229-491b-8a1f-7c1e10b04f8d','Japanese Salad',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e1761e3e-c43f-4aaa-84a7-d4a5acb718c5','ac267c75-5229-491b-8a1f-7c1e10b04f8d','Asian Spring Roll',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('94b3d1ea-ace4-4377-aab0-3c1073360e7b','ac267c75-5229-491b-8a1f-7c1e10b04f8d','Mango Salad',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('c677de30-8f54-469e-9781-b05bf9926f94','ac267c75-5229-491b-8a1f-7c1e10b04f8d','Vietnamese Green Salad',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('f4b8152a-7c3c-4cb5-8115-a2adb1aa9d5c','ac267c75-5229-491b-8a1f-7c1e10b04f8d','Honeysoy Mix Salad',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('12c40a41-4f83-410d-a442-48b5e2ac6e0f','ac267c75-5229-491b-8a1f-7c1e10b04f8d','Thai Beef Salad',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('8d31f54d-beab-41f9-a302-251c51fcf550','ac267c75-5229-491b-8a1f-7c1e10b04f8d','Thai Papaya Salad',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0ab9a73a-fbbb-4549-b6a4-d16012655e6c','ac267c75-5229-491b-8a1f-7c1e10b04f8d','Rice Paper Roll Chicken',8);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('9f6442ab-f4b8-4533-8b99-c5ca942c88ed','asian_buffet','Soup','one','4b7fb7ea-48f5-46ac-937f-2f4fc3008075',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('fe25d5bd-df18-48b9-b97f-61ea069aba19','9f6442ab-f4b8-4533-8b99-c5ca942c88ed','Chicken Corn Soup',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9c560074-a22e-4a17-ad2b-95b59b8ef713','9f6442ab-f4b8-4533-8b99-c5ca942c88ed','Asparagus Soup',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1561ba9a-b9c8-4400-b8ea-81b3a116468f','9f6442ab-f4b8-4533-8b99-c5ca942c88ed','Miso Soup',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('33c09b0d-c20e-4361-b133-e404f1271cbb','9f6442ab-f4b8-4533-8b99-c5ca942c88ed','Tom Yam Talay Soup',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ed59d9cf-3e1f-484a-8e4e-5663aa5c777d','9f6442ab-f4b8-4533-8b99-c5ca942c88ed','Tom Kha Gai',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('c0aef47a-66f9-4641-9dac-a1ea5bc29ce3','9f6442ab-f4b8-4533-8b99-c5ca942c88ed','Taiwanese Spicy Soup',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7ff7a6a2-6b4a-4525-9e66-bc8d675bf068','9f6442ab-f4b8-4533-8b99-c5ca942c88ed','Soup Hot and Sour',6);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('8a73345e-2122-4b87-8b65-06f584da0b94','asian_buffet','Rice','multiple',NULL,1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('aebcdae5-0486-41f4-b1d4-c65ac89a5620','8a73345e-2122-4b87-8b65-06f584da0b94','Steamed Jasmine Rice',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('697ac22c-ae35-4986-a2c2-4c1446949a3e','8a73345e-2122-4b87-8b65-06f584da0b94','Oriental Fried Rice',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b62b1de9-01c1-4717-b654-da578c6c973a','8a73345e-2122-4b87-8b65-06f584da0b94','Salted Fried Rice',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('13e730b2-9f49-465a-8875-efd29eac1dd6','8a73345e-2122-4b87-8b65-06f584da0b94','Nasi Lemak',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9b520c17-0f73-41ef-aa19-616494a7a979','8a73345e-2122-4b87-8b65-06f584da0b94','Garlic Fried Rice',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('54947614-4c90-4aa1-9160-beb0fc48c4ba','8a73345e-2122-4b87-8b65-06f584da0b94','Fried Rice Yangzhuo',5);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('a00aa14d-df27-487f-9f67-7352a125ad29','asian_buffet','Main Course','multiple',NULL,2);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('9252feb1-d06c-4703-be62-c1498ba29c0b','asian_buffet','Beef','multiple','a00aa14d-df27-487f-9f67-7352a125ad29',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0bc4917e-689c-482e-8b6b-6a3ce1793d63','9252feb1-d06c-4703-be62-c1498ba29c0b','Black Pepper Beef',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4efc9ab5-4b06-473a-923c-c8bbdbb21ee9','9252feb1-d06c-4703-be62-c1498ba29c0b','Beef Teriyaki',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1e106e6c-d506-4cbd-89b1-40c7644f7833','9252feb1-d06c-4703-be62-c1498ba29c0b','Asian Sliced Beef Steak',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b4eea0b8-6315-48e7-8255-bcc069137248','9252feb1-d06c-4703-be62-c1498ba29c0b','Beef Rollade',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('31d47dff-b3f1-4be8-8cd5-f2e83a1e72bb','9252feb1-d06c-4703-be62-c1498ba29c0b','Beef Katsu Curry',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('77338833-e3ab-45b3-a35f-025f8d2d52d0','9252feb1-d06c-4703-be62-c1498ba29c0b','Beef Yakiniku',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('911eae7e-b084-4d6d-8440-d8da37fb2662','9252feb1-d06c-4703-be62-c1498ba29c0b','Beef Tonkatsu Sauce',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7c0843e7-4f36-4aec-a4f1-ff63cd253693','9252feb1-d06c-4703-be62-c1498ba29c0b','Beef Bulgogi',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b4c21fe5-19fe-4368-b352-7e9bc74d6289','9252feb1-d06c-4703-be62-c1498ba29c0b','Pad Krapow Moo',8);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('ba0f2e6b-c755-4781-8571-95ba9c2d6f53','asian_buffet','Chicken','multiple','a00aa14d-df27-487f-9f67-7352a125ad29',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7c7c258a-83e0-4193-a606-3d02164a8d88','ba0f2e6b-c755-4781-8571-95ba9c2d6f53','General Tso Chicken',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('a0a45a02-10dc-4aaf-8f6d-fdf730cf3909','ba0f2e6b-c755-4781-8571-95ba9c2d6f53','Hongkong Fried Chicken',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e2f68c10-8101-4f6f-9749-96f2a6f5937c','ba0f2e6b-c755-4781-8571-95ba9c2d6f53','Sweet Sour Chicken',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('fe0c1340-4932-4fce-ac11-0d82cbd6e27a','ba0f2e6b-c755-4781-8571-95ba9c2d6f53','Chicken Teriyaki',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('64468d72-bb22-4443-99b4-dc0b442280a0','ba0f2e6b-c755-4781-8571-95ba9c2d6f53','Steamed Chicken Garlic Sauce',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0b63b301-8e52-4822-8247-38445edd7d36','ba0f2e6b-c755-4781-8571-95ba9c2d6f53','Chicken Nanban',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e7b28049-c648-4444-8842-f7848ece0998','ba0f2e6b-c755-4781-8571-95ba9c2d6f53','Thai Chicken Basil',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7989503c-f1b4-48f1-8e14-cee0893756ca','ba0f2e6b-c755-4781-8571-95ba9c2d6f53','Orange Chicken',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('facd1f91-5115-4a79-8597-4592ed80100a','ba0f2e6b-c755-4781-8571-95ba9c2d6f53','Chili Chicken Singapore',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('afb3c845-43c4-464a-9c18-ee9cbd226987','ba0f2e6b-c755-4781-8571-95ba9c2d6f53','Chicken Yakiniku',9);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('67fa7990-7664-43e3-86da-d535d785ac82','asian_buffet','Fish & Seafood','multiple','a00aa14d-df27-487f-9f67-7352a125ad29',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('01f0a90b-687e-4757-8c66-a6194dadc47b','67fa7990-7664-43e3-86da-d535d785ac82','Sweet Sour Fish',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ba7c26b4-4eb5-4774-95ae-c240781554c1','67fa7990-7664-43e3-86da-d535d785ac82','Deep Fried Fish Sweet Sour Sauce',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('582f9e22-98b3-4d17-a72a-4f148faa18c4','67fa7990-7664-43e3-86da-d535d785ac82','Sambal Singapore',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b5ab88e6-e9b0-497e-b53b-78c855a207e7','67fa7990-7664-43e3-86da-d535d785ac82','Seafood Salt & Pepper',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('5eb9a3f0-0e53-4687-83ca-97a5a01ce3dc','67fa7990-7664-43e3-86da-d535d785ac82','Black Bean Sauce',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('5fcc4af4-065f-4ad5-93ea-74d7c02ca056','67fa7990-7664-43e3-86da-d535d785ac82','Fried Fish with Mango Salsa',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('a3cbdd51-c115-409e-b2a4-6f519cd19d50','67fa7990-7664-43e3-86da-d535d785ac82','Steam Fish Ala Thai',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e41264c6-954a-40c9-ad2c-abf32d9ef28a','67fa7990-7664-43e3-86da-d535d785ac82','Fried Fish Gochujang Sauce',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('04635d50-daf8-458f-91be-77b2140a5da5','67fa7990-7664-43e3-86da-d535d785ac82','Garlic Prawn',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ce9885c4-2411-49d5-8371-a9562d93839c','67fa7990-7664-43e3-86da-d535d785ac82','Fried Fish Teriyaki',9);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('754cefe9-5445-4a67-95cf-0d1006893236','asian_buffet','Noodle','multiple','a00aa14d-df27-487f-9f67-7352a125ad29',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0adcbdc5-5e41-4a18-b277-f32ec008c606','754cefe9-5445-4a67-95cf-0d1006893236','I Fu Mie',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e34ba3d7-0186-4c5e-8bf4-f36136bd8373','754cefe9-5445-4a67-95cf-0d1006893236','Japchae',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('dc0a6b6f-7ae9-427f-8f62-80bcd5d91605','754cefe9-5445-4a67-95cf-0d1006893236','Mie Hongkong',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e99352f4-c866-4a16-969b-4d8d72a87e9d','754cefe9-5445-4a67-95cf-0d1006893236','Stir Fry Chicken Hor Fun',3);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('3e07d6d6-4d9b-4f8a-976e-02ad7592e0bd','asian_buffet','Vegetable','multiple','a00aa14d-df27-487f-9f67-7352a125ad29',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('91162511-9e57-455f-bea2-35b574218b6e','3e07d6d6-4d9b-4f8a-976e-02ad7592e0bd','Broccoli Garlic',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('38ec44c3-3034-470f-884b-73940b92a203','3e07d6d6-4d9b-4f8a-976e-02ad7592e0bd','Baby Kaylan Garlic',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7011421c-9e6a-4065-a5d6-f4c2cc867893','3e07d6d6-4d9b-4f8a-976e-02ad7592e0bd','Baby Pakcoy Oyster Sauce',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2335a3de-3e07-4a5a-bc98-ec7a3cd3fd87','3e07d6d6-4d9b-4f8a-976e-02ad7592e0bd','Baby Bean Green Szechuan',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('d6a2fdf4-8060-4598-b97f-a4e7d5176f04','3e07d6d6-4d9b-4f8a-976e-02ad7592e0bd','Broccoli Mushroom Oyster Sauce',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('82faa444-08d2-471b-802a-6011c532b765','3e07d6d6-4d9b-4f8a-976e-02ad7592e0bd','Stir Fry Kangkong',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('466914c7-9b2a-4c1d-9e4c-0e0a9fdf409b','3e07d6d6-4d9b-4f8a-976e-02ad7592e0bd','Stir Fry Korean Mix Mushroom',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ec95c943-174c-4270-871c-58ba4e3034eb','3e07d6d6-4d9b-4f8a-976e-02ad7592e0bd','Crispy Eggplant Gochujang Sauce',7);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('11109178-8762-4f3d-a3d6-51ff7f856a31','asian_buffet','Desserts','multiple',NULL,3);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','asian_buffet','Mini Cakes','multiple','11109178-8762-4f3d-a3d6-51ff7f856a31',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('6452ac6c-7b85-4d49-9cc9-34992518e11d','bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','Green Tea Cake',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('48b68c48-80f3-4d30-b8e9-e1b3f0d20dbc','bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','Chocolate Mousse',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('203b0bec-fdb3-46b0-8edb-1c90432b2ba6','bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','Oreo Cheese Cake',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('632bbf84-527d-4300-bdd5-d41155c34c1d','bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','Red Velvet Cake',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ee89321a-3316-4cd5-9be7-4f0b40e25ba0','bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','Salted Choco Crunchy',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7945d7ea-d71b-4075-8006-2ccf23bd4e1c','bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','Choco Eclair',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('23f9cca8-8fc7-4485-a7ee-7cfd51c4be8d','bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','Strawberry Panacota',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('47b046a0-5a7e-458b-93c2-de0ba9fdc953','bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','Berry Choux',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('04750be2-4057-4bb9-9ba3-1a06533f46a3','bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','Banofee Pie',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('90ecadec-5e48-475f-bdd5-5a9c05c46f1f','bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','Burnt Cheese Cake',9);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('abb7e588-4483-4391-93e9-c9c2c0fcb433','bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','Taro Cake',10);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('801ea724-4dd2-4e49-b5bf-d119d074a9a9','bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','Carrot Cake',11);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('a74d1e37-bacf-4519-9b7a-fff1beb9d26a','bbc75cf2-15c4-451b-8f8e-ce7be97e9c33','Lychee Cake',12);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('172370d4-18ab-4314-91e8-905058a39325','asian_buffet','Puddings','multiple','11109178-8762-4f3d-a3d6-51ff7f856a31',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b32e4f68-cd51-49bb-8cfc-1fafb8a92002','172370d4-18ab-4314-91e8-905058a39325','Melon Pudding',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('a354e912-1782-4eef-96b7-8dea54ab2052','172370d4-18ab-4314-91e8-905058a39325','Pineapple Pudding',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2a088853-24b6-4f05-9735-a393e079626b','172370d4-18ab-4314-91e8-905058a39325','Chocolate Pudding',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e6705995-29c7-4d2c-a888-a719aedcf8d8','172370d4-18ab-4314-91e8-905058a39325','Caramel Pudding',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('cd917e03-b305-42a7-ab18-658b12b70c42','172370d4-18ab-4314-91e8-905058a39325','Coffee Jelly Pudding',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('66a4c050-08f4-4a0e-9f20-cd03ce21e1aa','172370d4-18ab-4314-91e8-905058a39325','Pudding Lumut Pandan',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2d699bf9-609a-4c91-bca9-97f3a765a8ed','172370d4-18ab-4314-91e8-905058a39325','Orange Pudding',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2fd92d42-9758-4eab-bc4f-477df2338aa8','172370d4-18ab-4314-91e8-905058a39325','Taro Pudding',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('8a203171-11d0-42be-a8ba-74a49c5b98ea','172370d4-18ab-4314-91e8-905058a39325','Lychee Pudding',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('cf19a59d-9b8d-4251-871d-2a8e8a242434','172370d4-18ab-4314-91e8-905058a39325','Lime Cake',9);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('1fd307e8-4409-4612-a16a-a647de6eff05','asian_buffet','Beverages','multiple',NULL,4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('3067bae2-4932-459d-9dd1-8f5390fded81','1fd307e8-4409-4612-a16a-a647de6eff05','Mineral Water',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('91559d73-e6ed-4778-af11-769f9ce5975e','1fd307e8-4409-4612-a16a-a647de6eff05','Lemongrass Iced Tea',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0f0eefc3-2ae4-43cf-b65f-177e818791e8','1fd307e8-4409-4612-a16a-a647de6eff05','Lemon Iced Tea',2);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('c0ece225-d1a8-4ee5-bf40-15cc6cf28bb1','western_buffet','Starters','one',NULL,0);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('b42a9b7b-3841-4700-ba3f-bebc16da03f0','western_buffet','Appetizer','one','c0ece225-d1a8-4ee5-bf40-15cc6cf28bb1',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('8833a159-02c1-4245-bcc8-ecefe3a5263e','b42a9b7b-3841-4700-ba3f-bebc16da03f0','Traditional Caesar Salad with Chicken',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0d47307c-eb83-46f3-9f02-2d1bfe07d76a','b42a9b7b-3841-4700-ba3f-bebc16da03f0','Smoked Beef Fruit Salad',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('a23f439c-c312-4470-a4be-8b491ab4835f','b42a9b7b-3841-4700-ba3f-bebc16da03f0','Mesclun Mix Salad',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('846b1fcb-40b6-4a8f-b325-90156cbd69f7','b42a9b7b-3841-4700-ba3f-bebc16da03f0','Avocado Chicken Salad',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('74fbea3d-7c70-45c3-8b14-dab073e637be','b42a9b7b-3841-4700-ba3f-bebc16da03f0','Shrimp Cocktail',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1625cd81-3916-4a3b-b5fb-417687b89009','b42a9b7b-3841-4700-ba3f-bebc16da03f0','Orange Prawn Salad',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9d48cc34-aeae-42e1-8d3c-f21088ee56ef','b42a9b7b-3841-4700-ba3f-bebc16da03f0','Pasta Pesto Salad with Chicken',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0f036dea-1b75-492f-bff9-72f7f37d6830','b42a9b7b-3841-4700-ba3f-bebc16da03f0','Rock and Roll Salad',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('cb681830-e6a8-4595-9bfe-1a44a0326cbb','b42a9b7b-3841-4700-ba3f-bebc16da03f0','Mix Green Salad',8);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('957f845e-e9bd-4c9a-9c14-3f828eb667df','western_buffet','Soup','one','c0ece225-d1a8-4ee5-bf40-15cc6cf28bb1',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('239e71e6-9ff6-4549-b747-91f9ff43ec01','957f845e-e9bd-4c9a-9c14-3f828eb667df','Cream Corn Chicken Soup',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('5c356bcd-ca3a-45d0-866f-7a4d8d897200','957f845e-e9bd-4c9a-9c14-3f828eb667df','Cream Mushroom Soup',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ea3a7322-f87f-4814-9026-08be32954781','957f845e-e9bd-4c9a-9c14-3f828eb667df','Green Peas Soup',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2e794a63-165f-467a-9395-edb3e75160af','957f845e-e9bd-4c9a-9c14-3f828eb667df','Prawn Bisque Soup',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('a5bae837-6292-40e5-9cf1-0e2b5e3543f8','957f845e-e9bd-4c9a-9c14-3f828eb667df','Minestrone Soup',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('37b78d3d-6b20-4828-adaa-aac88ac66464','957f845e-e9bd-4c9a-9c14-3f828eb667df','Potato and Leek Soup',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('af020b6b-6910-4686-ad4d-b2173e992c80','957f845e-e9bd-4c9a-9c14-3f828eb667df','Tomato Pomodoro Soup',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('82081fec-2b38-45ad-818f-a7683d2d380f','957f845e-e9bd-4c9a-9c14-3f828eb667df','French Onion Soup',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9272e0d9-a41e-4458-8f5f-9af3f668ef45','957f845e-e9bd-4c9a-9c14-3f828eb667df','Shrimp Chowder Soup',8);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('37a6a2bc-bf63-4e5c-9d0f-69446e56f362','western_buffet','Rice & Pasta','multiple',NULL,1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9729de47-8ec1-4988-80f2-9e53b59f2850','37a6a2bc-bf63-4e5c-9d0f-69446e56f362','Pilaf Rice / Butter Rice',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('397c6362-7783-4c30-8702-93f675fc9e08','37a6a2bc-bf63-4e5c-9d0f-69446e56f362','Potato Gratin',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4ede8b86-02ee-4af5-9e42-0f9b222fd6fd','37a6a2bc-bf63-4e5c-9d0f-69446e56f362','Sauteed Potato',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1dc2d863-f379-4604-9680-f0a6048a14ff','37a6a2bc-bf63-4e5c-9d0f-69446e56f362','Penne Pesto Chicken',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2657e8c1-e7c7-4249-9485-e96ee94a4562','37a6a2bc-bf63-4e5c-9d0f-69446e56f362','Spaghetti Tomato Concase',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('49f18b83-8132-405e-8a46-b2f9c30e65ae','37a6a2bc-bf63-4e5c-9d0f-69446e56f362','Roasted Herb Potato',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('f723ece8-aa1d-4099-bc24-730a64da90e8','37a6a2bc-bf63-4e5c-9d0f-69446e56f362','Risotto Mushroom',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2a393a32-13ab-49c9-95f9-4cff6d8a14da','37a6a2bc-bf63-4e5c-9d0f-69446e56f362','Paella',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('052332c9-f095-4e72-b5c5-fdc3cf897f26','37a6a2bc-bf63-4e5c-9d0f-69446e56f362','Spaghetti Cartoccio',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('27fbcd87-f150-4091-b4ea-976a64a5cdbd','37a6a2bc-bf63-4e5c-9d0f-69446e56f362','Potato Gnocchi',9);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('bead8fcf-1bb1-4550-87eb-95bf6066ebd7','37a6a2bc-bf63-4e5c-9d0f-69446e56f362','Penne Alfredo',10);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('2745f989-491b-42c9-8291-7edf13335040','western_buffet','Main Course','multiple',NULL,2);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('ce5879d4-3ca4-46e8-9de5-e9e31e2eead3','western_buffet','Beef','multiple','2745f989-491b-42c9-8291-7edf13335040',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('fdbd5cce-08f5-4cab-a495-1768f96641ae','ce5879d4-3ca4-46e8-9de5-e9e31e2eead3','Beef Stroganoff',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('791396d7-9ac6-47e5-bd6d-b44a222db929','ce5879d4-3ca4-46e8-9de5-e9e31e2eead3','Beef Emince',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4d350a6d-5a60-4adb-afb9-091dc3013dcb','ce5879d4-3ca4-46e8-9de5-e9e31e2eead3','Mushroom Meatloaf',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2cf833ad-033a-455a-88c4-35e717426031','ce5879d4-3ca4-46e8-9de5-e9e31e2eead3','Beef Bourguignon',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('394992ba-132a-4329-bda6-29c921eaa399','ce5879d4-3ca4-46e8-9de5-e9e31e2eead3','Slow Cook Beef Stew',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('91ed0081-bceb-4ada-841d-2615c99f3814','ce5879d4-3ca4-46e8-9de5-e9e31e2eead3','Beef au Poivre',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ae11eaaa-4219-4cbf-b815-28f4c5f6d1fc','ce5879d4-3ca4-46e8-9de5-e9e31e2eead3','Italian Beef Red Tomato Sauce',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('063db4a5-40cf-4bf7-9c05-ad842f70ebde','ce5879d4-3ca4-46e8-9de5-e9e31e2eead3','Beef Goulash',7);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('60398a07-d5bf-4297-8440-95845a094a49','western_buffet','Chicken','multiple','2745f989-491b-42c9-8291-7edf13335040',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0038c2db-6f9b-45d8-8afa-60f1c8d30ab8','60398a07-d5bf-4297-8440-95845a094a49','Roast Chicken Grandmother Sauce',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4868cc0a-4bf6-4149-91e3-69320a4d613d','60398a07-d5bf-4297-8440-95845a094a49','Chicken Schnitzel',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9c3231b9-2bab-4e73-85d2-961989096011','60398a07-d5bf-4297-8440-95845a094a49','Stuffed Chicken Mushroom Sauce',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('41676100-ad78-4f04-bde9-a11b03ccdcb7','60398a07-d5bf-4297-8440-95845a094a49','BBQ Chicken Steak',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('d1ebafce-279b-428d-ac39-066d567dc5f6','60398a07-d5bf-4297-8440-95845a094a49','Pollo Ala Kaciatora',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('6b6b5716-cf94-4ade-ad80-c5e93af76cc4','60398a07-d5bf-4297-8440-95845a094a49','Pollo alla Biarra',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('3afb3dca-b265-478f-b306-1e713e46dd5d','60398a07-d5bf-4297-8440-95845a094a49','Coq au Vin',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ef53c6b4-82e8-4eb5-868e-1d68fb11f074','60398a07-d5bf-4297-8440-95845a094a49','Chicken Fricassee',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2bdd4d5f-f140-4c95-b743-373b3b6d2e7e','60398a07-d5bf-4297-8440-95845a094a49','Pollo Guisado',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('bc1cdb53-181f-4e49-a6b8-147c8795d662','60398a07-d5bf-4297-8440-95845a094a49','Italian Chicken Red Tomato Sauce',9);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('9eb08d7e-fb6e-4cf8-8039-572d89a79638','western_buffet','Fish & Seafood','multiple','2745f989-491b-42c9-8291-7edf13335040',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b7e27710-433f-4a89-8a6f-73dc3eda8cfe','9eb08d7e-fb6e-4cf8-8039-572d89a79638','Pan-seared Fish Lemon Butter Sauce',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('df7f8bfc-beb8-4ad8-8873-b84fe73b50b1','9eb08d7e-fb6e-4cf8-8039-572d89a79638','King Prawn Tomato Basil',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('70a9dc4b-6df5-403b-9a25-d699a209a6a5','9eb08d7e-fb6e-4cf8-8039-572d89a79638','John Dory Fish Lemon Butter Sauce',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('8661c108-ce2f-4066-a6cf-2f96d24d5307','9eb08d7e-fb6e-4cf8-8039-572d89a79638','Breaded Fish Tomato Salsa',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('3c5776fa-4434-4ce1-ac2c-b83b813a0a22','9eb08d7e-fb6e-4cf8-8039-572d89a79638','Grill Seabass Pomodoro Sauce',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('52a3a18c-e0b4-49ca-a88a-f38304ffd35a','9eb08d7e-fb6e-4cf8-8039-572d89a79638','Prawn Aglio Olio e Peperoncino',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('bcd381cb-bc99-4dc7-bdc6-66bea860f3f9','9eb08d7e-fb6e-4cf8-8039-572d89a79638','Fried Dory ala Meuniere',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('c9ba0bf0-3dc6-4723-b653-ab30f2bec50a','9eb08d7e-fb6e-4cf8-8039-572d89a79638','Seabass with Paprika Sauce',7);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('c2b7eef2-9ec2-4e31-a477-d28edae8c68c','western_buffet','Vegetable','multiple','2745f989-491b-42c9-8291-7edf13335040',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1b021c8d-c369-49f1-9535-e0c7209fd1c7','c2b7eef2-9ec2-4e31-a477-d28edae8c68c','Broccoli Mushroom Garlic Butter',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('5b4c57a5-0da5-4931-8a7a-abd7f908dd94','c2b7eef2-9ec2-4e31-a477-d28edae8c68c','Glazed Mix Vegetables',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('db04e801-8826-49da-b149-5b6178b54392','c2b7eef2-9ec2-4e31-a477-d28edae8c68c','Grilled Vegetables',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('93867f6f-c639-45fc-bec7-ad4ca354c316','c2b7eef2-9ec2-4e31-a477-d28edae8c68c','Spinach Mushroom Cream Sauce',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b69bf61c-d72f-4f88-95a4-51dd6b36bef2','c2b7eef2-9ec2-4e31-a477-d28edae8c68c','Roasted Tomato with Fresh Herbs',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4ea6ee56-d281-4e82-85bc-aafc2ca9bc9c','c2b7eef2-9ec2-4e31-a477-d28edae8c68c','Eggplant Parmigiana',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('072ea803-f27d-4b62-b6ff-c2ee56a0d434','c2b7eef2-9ec2-4e31-a477-d28edae8c68c','Roasted Mix Vegetables',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('989f1345-bd73-433c-8682-80fd6d1c0dfc','c2b7eef2-9ec2-4e31-a477-d28edae8c68c','Ratatouilles',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('bd81bec6-decf-4037-a625-575b23ae9b7d','c2b7eef2-9ec2-4e31-a477-d28edae8c68c','Vegetables Frites',8);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('f2e9fd2d-4ee5-4425-85aa-a7a30f0deb88','western_buffet','Desserts','multiple',NULL,3);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('9eb621ca-c076-4963-80a7-3864c25a09f7','western_buffet','Mini Cakes','multiple','f2e9fd2d-4ee5-4425-85aa-a7a30f0deb88',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('fcce53ed-0b55-4deb-a47c-96d9d06f440d','9eb621ca-c076-4963-80a7-3864c25a09f7','Green Tea Cake',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('8113dc37-2224-4759-9cfb-0d3ff1b61ea3','9eb621ca-c076-4963-80a7-3864c25a09f7','Chocolate Mousse',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7492af0c-3616-43fc-a013-828c715cecd2','9eb621ca-c076-4963-80a7-3864c25a09f7','Oreo Cheese Cake',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('3f1e7558-7941-4ada-a012-a1b02e0997fa','9eb621ca-c076-4963-80a7-3864c25a09f7','Red Velvet Cake',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('23afc9dc-20e7-4368-a7e0-e22046089056','9eb621ca-c076-4963-80a7-3864c25a09f7','Salted Choco Crunchy',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0e2443ae-dcd7-483d-8581-543ae80d008d','9eb621ca-c076-4963-80a7-3864c25a09f7','Choco Eclair',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('bf830c71-9d92-4cec-a6f7-b852f5954805','9eb621ca-c076-4963-80a7-3864c25a09f7','Strawberry Panacota',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('8fe94de0-e656-4de1-95a9-362eeddae5e7','9eb621ca-c076-4963-80a7-3864c25a09f7','Berry Choux',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('647ba89f-361b-491f-898c-14aa9c1b6439','9eb621ca-c076-4963-80a7-3864c25a09f7','Banofee Pie',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('60b57de6-d2cc-475c-ac4c-914b67f131a5','9eb621ca-c076-4963-80a7-3864c25a09f7','Burnt Cheese Cake',9);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('c50f49ba-5372-4940-a553-b85b3f31897e','9eb621ca-c076-4963-80a7-3864c25a09f7','Taro Cake',10);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('740587fc-98c1-4290-a3d7-c15312615257','9eb621ca-c076-4963-80a7-3864c25a09f7','Carrot Cake',11);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('5fd8fd29-2124-4a96-bae0-977cf5cd54b6','9eb621ca-c076-4963-80a7-3864c25a09f7','Lychee Cake',12);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('dcff9e41-f4cf-4972-a84c-49d81b1d81ea','western_buffet','Puddings','multiple','f2e9fd2d-4ee5-4425-85aa-a7a30f0deb88',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e3dbfc2a-ae5f-411e-98d5-71b5f22eebe7','dcff9e41-f4cf-4972-a84c-49d81b1d81ea','Melon Pudding',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('f9cceafa-b16c-4bf7-b8ae-5fe1bdf897a6','dcff9e41-f4cf-4972-a84c-49d81b1d81ea','Pineapple Pudding',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('6d07f11e-c29e-4905-98ac-e486f28943e5','dcff9e41-f4cf-4972-a84c-49d81b1d81ea','Chocolate Pudding',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7d2a116b-7940-46af-ad4f-e76b619034b2','dcff9e41-f4cf-4972-a84c-49d81b1d81ea','Caramel Pudding',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2b5ae500-e753-4756-b140-1e1252eb87f7','dcff9e41-f4cf-4972-a84c-49d81b1d81ea','Coffee Jelly Pudding',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7de4efa6-c591-42a7-b8e0-4513a43bc44e','dcff9e41-f4cf-4972-a84c-49d81b1d81ea','Pudding Lumut Pandan',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('29a214b0-aa32-4545-8ce6-9663b032a5a7','dcff9e41-f4cf-4972-a84c-49d81b1d81ea','Orange Pudding',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('3b98844a-efa8-482a-9271-a13f81d00f03','dcff9e41-f4cf-4972-a84c-49d81b1d81ea','Taro Pudding',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('70308ea2-3367-4337-b65c-373177650adb','dcff9e41-f4cf-4972-a84c-49d81b1d81ea','Lychee Pudding',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('be86fda8-f1f4-4ae7-92a8-80d31423bbb5','dcff9e41-f4cf-4972-a84c-49d81b1d81ea','Lime Cake',9);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('9a003882-730f-4665-b399-9e800398f1f4','western_buffet','Beverages','multiple',NULL,4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('8e4e4a2d-cebf-4e65-8b2e-1b93f1e1c44d','9a003882-730f-4665-b399-9e800398f1f4','Mineral Water',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7cc2650d-2c0b-4a02-99ee-c1a2cfc40c59','9a003882-730f-4665-b399-9e800398f1f4','Lemongrass Iced Tea',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('c3b28bc2-4eea-4920-8fa7-d9a111d03474','9a003882-730f-4665-b399-9e800398f1f4','Lemon Iced Tea',2);

-- COFFEE BREAK CATALOG
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('ff22a593-9692-4a5b-b081-46da3c4cf89f','coffee_break','Savoury','multiple',NULL,0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('6fe7cb0d-c898-4b0b-a9ad-2078d19dd3fd','ff22a593-9692-4a5b-b081-46da3c4cf89f','Arem Arem Ayam Sayur',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('285d2830-f199-494f-8e38-2acc35ba089c','ff22a593-9692-4a5b-b081-46da3c4cf89f','Lemper Ayam',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('5a197934-b5a4-4980-b45d-014f67b6d484','ff22a593-9692-4a5b-b081-46da3c4cf89f','Pastel Telur',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b2e9a0d7-cdd5-45f6-9172-975bb080e869','ff22a593-9692-4a5b-b081-46da3c4cf89f','Pastel Tutup',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('f0358945-edfd-4228-a47e-50066209dfd4','ff22a593-9692-4a5b-b081-46da3c4cf89f','Tahu Isi Ayam',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('f18de0f7-f2cd-4ad3-939a-cfaecffdabea','ff22a593-9692-4a5b-b081-46da3c4cf89f','Sosis Solo',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('d113f7c1-d483-41d9-8d87-6107210c410c','ff22a593-9692-4a5b-b081-46da3c4cf89f','Ketan Bumbu',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9b1cf1e5-6cd5-4045-aabb-549efa5566dd','ff22a593-9692-4a5b-b081-46da3c4cf89f','Mac & Cheese',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('85a4421e-b9de-4414-bf3a-3444190799d3','ff22a593-9692-4a5b-b081-46da3c4cf89f','Beef Curry Puff Pastry',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4247fdb7-414f-476b-bb7d-86158bd14098','ff22a593-9692-4a5b-b081-46da3c4cf89f','Beef Teriyaki Puff Pastry',9);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1d1fffc4-56fb-4bfb-8a8a-50a0e1975087','ff22a593-9692-4a5b-b081-46da3c4cf89f','Tuna Puff Pastry',10);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('45652387-2894-4220-8b4b-462a39d17913','ff22a593-9692-4a5b-b081-46da3c4cf89f','Vegetables Samosa',11);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9527f21e-f176-4421-9a92-f9ac25701fb6','ff22a593-9692-4a5b-b081-46da3c4cf89f','Cheese Bitter Ballen',12);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('3d7d1f3f-9402-4b79-84b4-2ebeb8730153','ff22a593-9692-4a5b-b081-46da3c4cf89f','Bitter Ballen',13);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('18a721a8-a766-4380-ba1f-a14d94b42d19','coffee_break','Bread & Viennoiserie','multiple',NULL,1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7c78025c-75f4-4b41-b6ec-4367b7ca5daf','18a721a8-a766-4380-ba1f-a14d94b42d19','Croissant Chocolate',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2db05e5e-dc1e-4d5b-bc56-5ea2f2baf310','18a721a8-a766-4380-ba1f-a14d94b42d19','Almond Danish Pastry',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('5f882cfe-8590-4a5f-a30b-465a86afee54','18a721a8-a766-4380-ba1f-a14d94b42d19','Chocolate Danish Pastry',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('8298d8d0-e851-46ad-8e5f-23384095f71d','18a721a8-a766-4380-ba1f-a14d94b42d19','Peach Danish Pastry',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('dfb643eb-1229-4788-b6cd-92af223a32f4','18a721a8-a766-4380-ba1f-a14d94b42d19','Strawberry Danish Pastry',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('81a6e8ff-20dd-49d7-8f2d-4c7d2b57c5b7','18a721a8-a766-4380-ba1f-a14d94b42d19','Raisin Danish Pastry',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('682d327b-af75-43e1-b8d3-c35257aa1527','18a721a8-a766-4380-ba1f-a14d94b42d19','Banana Bun',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('c08f86a3-f79f-481f-bd9d-054db0bfee93','18a721a8-a766-4380-ba1f-a14d94b42d19','Cheese Bun',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('a42381b2-bd6a-4458-b14a-927936890bab','18a721a8-a766-4380-ba1f-a14d94b42d19','Chicken Floss Bun',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9763687b-d80c-4185-b571-02d56f3c2810','18a721a8-a766-4380-ba1f-a14d94b42d19','Custard Bun',9);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('205ef116-2a17-4185-b78d-62493f1826a5','coffee_break','Sweets','multiple',NULL,2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1297cc07-0590-41be-baca-2bd083b93455','205ef116-2a17-4185-b78d-62493f1826a5','Onde Onde',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ce7c2374-3277-4b25-8b2c-c4b8dd493dd4','205ef116-2a17-4185-b78d-62493f1826a5','Kueku',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7c51b988-bcbb-4978-9ed6-4827002064b8','205ef116-2a17-4185-b78d-62493f1826a5','Kue Bugis Hijau',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('39c4c085-7816-4797-b721-9c0b8b6ea76b','205ef116-2a17-4185-b78d-62493f1826a5','Kue Lumpur',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ce5f7f4b-af32-4828-ac92-aa86e601c29d','205ef116-2a17-4185-b78d-62493f1826a5','Klepon',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('7e1ba31f-f226-48a9-a034-3415e4f6c1d6','205ef116-2a17-4185-b78d-62493f1826a5','Apple Turnover',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('69d4d1f6-7b86-43a4-a699-e8e4092e1580','205ef116-2a17-4185-b78d-62493f1826a5','Apple Pie Choco',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('42ed99d4-9c41-4023-9c8b-5922fedbed73','205ef116-2a17-4185-b78d-62493f1826a5','Chocolate Cupcake',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('69fc17e1-6ee8-487c-ac16-95a1f6af9e47','205ef116-2a17-4185-b78d-62493f1826a5','Mocha Cake',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('be9db196-e376-4bc2-a072-7b9806b8c54a','205ef116-2a17-4185-b78d-62493f1826a5','Oreo Cheese Cake',9);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('683b16a8-7dbd-4dc9-83bb-af4e034a477c','205ef116-2a17-4185-b78d-62493f1826a5','Strawberry Cheese Cake',10);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0b075848-7a3d-48fa-9704-fcc28ee5bfab','205ef116-2a17-4185-b78d-62493f1826a5','Blueberry Cheese Cake',11);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('689391c3-fd76-42b9-b441-877daba3f289','205ef116-2a17-4185-b78d-62493f1826a5','Pandan Cake',12);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b93b43d2-a0c0-4db9-b1f0-8287dc18d798','205ef116-2a17-4185-b78d-62493f1826a5','Chocolate Choux',13);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e6c4977e-808a-40a4-a552-317e404bdae6','205ef116-2a17-4185-b78d-62493f1826a5','Vanilla Choux',14);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e1c09054-79c9-40e4-aa2c-57e1b443631c','205ef116-2a17-4185-b78d-62493f1826a5','Strawberry Choux',15);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('d3a16261-d796-4565-b04e-9d0ff6b763fc','205ef116-2a17-4185-b78d-62493f1826a5','Choco Eclair',16);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('d46a4550-f9ea-4e5b-8908-1b67678a5543','205ef116-2a17-4185-b78d-62493f1826a5','Mix Fruit Puff',17);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('771a5db7-88a9-4fc7-a08b-0abfb8602759','205ef116-2a17-4185-b78d-62493f1826a5','Chocolate Muffin',18);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('c6116be6-52ad-4113-a1a3-0aad9e28f89a','205ef116-2a17-4185-b78d-62493f1826a5','Blueberry Muffin',19);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('51cc3857-fba6-4c27-b042-79658ab968b4','205ef116-2a17-4185-b78d-62493f1826a5','Orange Almond Muffin',20);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('56de4dcc-d0ff-44f2-bf0f-5baa770a80dd','205ef116-2a17-4185-b78d-62493f1826a5','Cheese Tart',21);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b8b13af0-2357-4632-bd16-c281f3b9895e','205ef116-2a17-4185-b78d-62493f1826a5','Strawberry Tart',22);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('8f967b63-9d7a-4248-84e4-2fd07b54b4ad','205ef116-2a17-4185-b78d-62493f1826a5','Egg Tart',23);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('6dbd9abb-98b1-440f-a68c-befd6d9b5361','205ef116-2a17-4185-b78d-62493f1826a5','Red Velvet Cheese Tart',24);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('f116c81d-0721-420e-bea2-1bbcde1a7ff1','205ef116-2a17-4185-b78d-62493f1826a5','Brownies Cake',25);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ee62bbb7-2574-4840-a114-1a9ad7c08e12','205ef116-2a17-4185-b78d-62493f1826a5','Banana Cake',26);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('20b215cb-f82a-438d-a259-154b75a6ec51','coffee_break','Beverages (Included)','multiple',NULL,3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b5b0d625-c398-4065-88af-3a03ce9ebb81','20b215cb-f82a-438d-a259-154b75a6ec51','Coffee & Tea',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('def558bd-8b48-4616-883c-9874dc13e93f','20b215cb-f82a-438d-a259-154b75a6ec51','Mineral Water',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9f6374e7-70e6-44e1-8857-432d887519ab','20b215cb-f82a-438d-a259-154b75a6ec51','Juice Orange',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2fec5b36-8bd5-4206-93a6-214582a28f66','20b215cb-f82a-438d-a259-154b75a6ec51','Juice Guava',3);

-- CANAPE CATALOG
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('443948e3-6407-47ba-95d9-f58b3076e2d3','canape','Savouries','multiple',NULL,0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ba2031a9-36d2-426a-8225-a4c0cf63d880','443948e3-6407-47ba-95d9-f58b3076e2d3','Smoked Beef Canape',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9a357fbc-542a-4ab1-b426-f12a3b5d24d0','443948e3-6407-47ba-95d9-f58b3076e2d3','Tuna Canape',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0f0c264c-cd4b-4187-b594-832250ba6e75','443948e3-6407-47ba-95d9-f58b3076e2d3','Chicken Canape',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('791121fb-1312-4db3-97cd-9c1802f70b30','443948e3-6407-47ba-95d9-f58b3076e2d3','Salmon Canape',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('18abe4ce-430e-461b-a604-548ee2523fca','443948e3-6407-47ba-95d9-f58b3076e2d3','Egg Canape',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2c5ad771-b23e-4733-8533-4ebf6547f895','443948e3-6407-47ba-95d9-f58b3076e2d3','Cheese Canape',5);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('bdb8b838-8c53-41c1-8b95-dd5e03c356b2','canape','Sweets','multiple',NULL,1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e79a27ed-4329-4384-8ab9-e61664793a17','bdb8b838-8c53-41c1-8b95-dd5e03c356b2','Fruit Tart',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('45d68784-25dc-4b95-8b13-9e2987b35de6','bdb8b838-8c53-41c1-8b95-dd5e03c356b2','Mini Eclair',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('d21de117-7ed3-466e-be7f-4724ab3d4b59','bdb8b838-8c53-41c1-8b95-dd5e03c356b2','Chocolate Canape',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('15d37dd7-bc78-48d8-a839-bda46ae5712e','bdb8b838-8c53-41c1-8b95-dd5e03c356b2','Strawberry Canape',3);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('b8473aab-214f-4a9f-963f-9b6c794b3d25','canape','Juice','multiple',NULL,2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0cb7f979-0303-4c71-af23-e9746266d212','b8473aab-214f-4a9f-963f-9b6c794b3d25','Orange Juice',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9b2e9498-1a26-4b07-be07-25ac94095542','b8473aab-214f-4a9f-963f-9b6c794b3d25','Guava Juice',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('3845f928-1a52-48d0-a9d5-8c4faba13485','b8473aab-214f-4a9f-963f-9b6c794b3d25','Lychee Juice',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('c4b06a48-6531-4ce4-b2ad-162f2ce56581','b8473aab-214f-4a9f-963f-9b6c794b3d25','Watermelon Juice',3);

-- MEAL BOX (fixed menus)
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('89b47a5f-bf25-4a2d-a384-6b2a39793521','Meal Box','Signature Meal Box','Nasi Umara',75000,'per box',false,true,'Nasi Daun Jeruk, Ayam Singgang, Paru Asem Manis, Lidah Cabe Ijo, Sayur Daun Singkong, Sambal Bawang, Sambal Terasi, Serundeng, Kerupuk',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('330d9022-6d24-444a-9874-6b7516493fb6','Meal Box','Signature Meal Box','Nasi Langgi',75000,'per box',false,false,'Nasi Gurih, Rendang Daging, Kering Kentang Daun Jeruk, Telur Balado, Kering Tempe, Lalapan, Abon, Sambel Terasi, Kerupuk',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('35d0050a-3d0c-4924-babc-088dd13120a2','Meal Box','Signature Meal Box','Nasi Putri Melayu',75000,'per box',false,false,'Nasi Putih, Ayam Singgang, Daging Sapi Karo, Sayur Kapau, Telur Dadar Padang, Sambal Bawang, Sambal Terasi, Serundeng, Kerupuk Udang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('23c60aa2-dabc-4706-aec1-a3cbc2c56371','Meal Box','Signature Meal Box','Nasi Biromaru',75000,'per box',false,false,'Nasi Kuning, Ayam Panggang Biromaru, Ikan Cakalang Fufu, Bakwan Jagung, Tumis Daun Singkong Kecombrang, Sambal Bawang, Sambal Terasi, Kerupuk Udang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('15675486-19c7-4815-af52-42572cbc2937','Meal Box','Signature Meal Box','Nasi Uduk',75000,'per box',false,false,'Nasi Uduk, Ayam Goreng Lengkuas, Semur Daging, Telur Dadar Iris, Bihun Goreng Sawi, Sambal Bawang, Sambal Terasi, Lalapan, Serundeng, Kerupuk',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('ea7e6c91-75b0-48a5-bd14-42acb655ba54','Meal Box','Signature Meal Box','Nasi Bali',75000,'per box',false,false,'Nasi Putih, Ayam Seset Pedas, Sate Lilit Ayam, Udang Kering Kremes, Tumis Buncis, Sambel Bawang, Sambel Terasi, Serundeng, Kerupuk Udang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('73742440-53f9-48fd-8e67-404d9d044f33','Meal Box','Signature Meal Box','Nasi Kandar',75000,'per box',false,false,'Nasi Lemak, Ayam Goreng Mamak, Daging Masak Kicap, Telur Asin Setengah, Tumis Kubis Kecombrang, Lalapan Timun, Sambal Bawang, Serundeng, Kerupuk Udang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('b49c62f0-c019-4a6d-86b8-ed65d1c1274a','Meal Box','Signature Meal Box','Nasi Bebek Madura',75000,'per box',false,false,'Nasi Daun Jeruk, Bebek Goreng Bumbu Hitam, Ikan Goreng, Tahu Tempe Goreng, Lalapan Timun, Sambal Bawang, Sambal Mangga Muda, Kerupuk Udang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5da63b8f-3569-4e16-9343-6fe71cbedb57','Meal Box','Premium Meal Box','Western Set A',60000,'per box',false,false,'Butter Rice, Beef Bourguignon, Dorry Lemon Butter, Scramble Egg, Sauteed Vegetables',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('edb20254-5956-4c31-9a6b-6288cc6d9142','Meal Box','Premium Meal Box','Western Set B',60000,'per box',false,false,'Mashed Potato, Slow Cook Beef Stew, Grilled Seabass Lemon Butter Sauce, Mix Salad, Roast Herb Vegetables',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('20813aa9-747d-4b61-a49e-f9ca28fe339a','Meal Box','Premium Meal Box','Western Set C',60000,'per box',false,false,'Potato Herbs, BBQ Chicken Steak, Dory with Tartare Sauce, Mix Salad, Scramble Egg',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('8edca276-55fb-42a7-8ebf-8961412b35d9','Meal Box','Premium Meal Box','Nusantara Set A',60000,'per box',false,false,'Nasi Putih, Ayam Bakar Cincane, Daging Sapi Garo, Kacang Panjang Khalas, Acar Kuning, Kerupuk',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('44e1f490-792e-4d87-90ce-487e9c86e455','Meal Box','Premium Meal Box','Nusantara Set B',60000,'per box',false,false,'Nasi Pandan, Ayam Goreng Sasando, Tuna Bumbu Taliwang, Plecing Kangkung, Tahu Goreng Tepung Sambal Matah, Kerupuk',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('c0a129ee-0ede-49a5-8f24-61c4a4b83e56','Meal Box','Premium Meal Box','Nusantara Set C',60000,'per box',false,false,'Nasi Bunga Telang, Ayam Panggang Bumbu Rujak, Ikan Kakap Sambal Mangga, Sayur Tahu Santan, Tempe Bacem, Kerupuk',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('d2b8f532-5623-43e2-86f1-08e66ea9f9e6','Meal Box','Medium Meal Box','Rumahan Set A (Medium)',40000,'per box',false,false,'Nasi Putih, Ayam Panggang Bacem, Telur Opor Putih, Tumis Tempe Buncis, Tahu Balado, Kerupuk',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('c9f0b7e1-7be5-40af-98ed-0465cd011ee8','Meal Box','Medium Meal Box','Rumahan Set B (Medium)',40000,'per box',false,false,'Nasi Putih, Ayam Goreng Mentega, Ikan Asam Manis, Tempe Goreng Tepung, Tumis Buncis Wortel, Kerupuk',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5d1848ed-136b-4cbf-995f-cf56ac4bedcf','Meal Box','Medium Meal Box','Rumahan Set C (Medium)',40000,'per box',false,false,'Nasi Putih, Terik Daging Sapi, Telur Balado 1/2, Tumis Tahu Buncis, Tempe Bacem, Kerupuk',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('96961655-86ab-4f2f-a1db-0b49fa102b08','Meal Box','Regular Meal Box','Rumahan Set A (Regular)',35000,'per box',false,false,'Nasi Putih, Ayam Goreng Tepung, Telur Balado Setengah, Tempe Goreng, Tumis Buncis, Sambal Bawang, Kerupuk Udang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('7c6d48fe-3396-4db2-9a07-c4a46b6d253e','Meal Box','Regular Meal Box','Rumahan Set B (Regular)',35000,'per box',false,false,'Nasi Putih, Ayam Panggang Rujak, Telur Dadar, Tahu Goreng, Tumis Kacang Panjang Tempe, Sambal Bawang, Kerupuk Udang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('8378196d-d2b8-4f47-bf40-a4dfd4aceb1e','Meal Box','Regular Meal Box','Rumahan Set C (Regular)',35000,'per box',false,false,'Nasi Putih, Ikan Sambal Matah, Telur Pindang, Kering Kentang, Kacang Panjang Khalas, Sambal Bawang, Kerupuk Udang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('fffa1ef0-6ecf-44cf-9c4f-de6954e07d98','Meal Box','Long Box Premium','Signature Set Long Box',140000,'per box',false,false,'Nasi Daun Jeruk, Bebek Goreng Bumbu Hitam, Ikan Kakap Sambal Mangga, Tahu Tempe Goreng, Lalapan, Sambal Bawang, Kerupuk, Mineral Water, Pisang, Chocolate Pudding',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('c59bd8e0-e208-4a12-b3b8-90050c3761db','Meal Box','Long Box Premium','Western Set Long Box',135000,'per box',false,false,'Pilaf Rice / Butter Rice, Beef Bourguignon, Dorry Lemon Butter, Scramble Egg, Sauteed Vegetables, Sambal Sachet, Kerupuk, Mineral Water, Pisang, Strawberry Pudding',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('4196a68d-8ed3-4aa5-908c-0dff28c8ad84','Meal Box','Long Box Premium','Nusantara Set Long Box',135000,'per box',false,false,'Nasi Putih, Ayam Panggang Rujak, Ikan Kakap Sambal Mangga, Sayur Tahu Santan, Tempe Bacem, Sambal Terasi, Kerupuk, Mineral Water, Pisang, Chocolate Pudding',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('15d5b690-a834-4760-8686-fda2f64d7fec','Meal Box','Long Box Premium','Rumahan Set Long Box',135000,'per box',false,false,'Nasi Putih, Ayam Panggang Bacem, Ikan Balado, Telur Opor Putih, Bakwan Jagung, Tumis Tempe Buncis, Sambal Bawang, Kerupuk, Mineral Water, Pisang, Strawberry Pudding',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('376d8772-e3b6-4160-b397-b4a48e849b13','Meal Box','Nasi Besek','Nasi Besek - Nasi Umara',100000,'per box',false,false,'Nasi Daun Jeruk, Lidah Cabe Ijo, Cakalang Woku, Ayam Singgang, Sayur Daun Singkong, Sambal Bawang, Kerupuk Udang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('7a063ad1-265a-4ca0-9dc4-8133babf8f82','Meal Box','Nasi Besek','Nasi Besek - Nasi Mataram',98000,'per box',false,false,'Nasi Bunga Telang, Ayam Suwir Kecombrang, Teri Kacang, Empal Serundeng, Tumis Daun Melinjo, Sauce Sambal Bajak, Kerupuk Udang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('d01e1d4b-ba4e-407b-b7a0-08bbafe1e62a','Meal Box','Nasi Besek','Nasi Besek - Nasi Bali',98000,'per box',false,false,'Nasi Bungkus Daun Pisang, Ayam Seset Pedas, Udang Kering Kremes, Sate Lilit, Sayur Kacang Panjang, Sambal Matah / Embe, Rempeyek Kacang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('a7759061-5c3b-43ef-a9a9-15d89db604ff','Meal Box','Nasi Besek','Nasi Besek - Nasi Putri Melayu',98000,'per box',false,false,'Nasi Lemak, Ayam Bakar Padang, Rendang Paru, Sambal Lado Udang Pete, Sayur Daun Singkong, Sambalado Hijau, Kerupuk Udang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('f4fc8579-6cb7-4cb9-83fe-586187b66d20','Meal Box','Hantaran & Sharing','Nasi Bakul Umara (6 pax)',NULL,'per bakul',false,false,'Nasi Daun Jeruk, Lidah Cabe Ijo, Cakalang Woku, Ayam Singgang, Paru Asam Manis, Sayur Daun Singkong, Sambal Bawang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('25561c93-28a2-4716-b885-e023b07501ec','Meal Box','Hantaran & Sharing','Nasi Bakul Umara (12 pax)',NULL,'per bakul',false,false,'Nasi Daun Jeruk, Lidah Cabe Ijo, Cakalang Woku, Ayam Singgang, Paru Asam Manis, Sayur Daun Singkong, Sambal Bawang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('4cb9a838-7b04-45af-9838-33dcd1b28540','Meal Box','Hantaran & Sharing','Nasi Tumpeng Umara (12 pax)',NULL,'per tumpeng',false,false,'Nasi Kuning, Ayam Goreng Lengkuas, Lidah Cabe Ijo, Paru Asam Manis, Perkedel Kentang, Telur Pindang, Kering Tempe, Telur Dadar Iris, Urap Sayur, Sambal Bawang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('cbd65011-6f90-4d06-ab92-ef08f161dc2b','Meal Box','Hantaran & Sharing','Nasi Tumpeng Umara (25 pax)',NULL,'per tumpeng',false,false,'Nasi Kuning, Ayam Goreng Lengkuas, Lidah Cabe Ijo, Paru Asam Manis, Perkedel Kentang, Telur Pindang, Kering Tempe, Telur Dadar Iris, Urap Sayur, Sambal Bawang',true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('2d355ed3-d86e-4841-bbdb-f8718de0fea1','Meal Box','Hantaran & Sharing','Nasi Tumpeng Umara (40 pax)',NULL,'per tumpeng',false,false,'Nasi Kuning, Ayam Goreng Lengkuas, Lidah Cabe Ijo, Paru Asam Manis, Perkedel Kentang, Telur Pindang, Kering Tempe, Telur Dadar Iris, Urap Sayur, Sambal Bawang',true);

-- SNACK BOX & KUE TAMPAH
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5ba887f1-5615-4cb4-836e-4780f9982c83','Snack Box','Snack Box','Snack Box Premium',50000,'per box',true,true,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('daba3be3-137d-4c03-acad-d76af39d78eb','5ba887f1-5615-4cb4-836e-4780f9982c83','snack_box_premium','Snack Box Premium',1,0);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('cb2eb0b7-81f1-426f-a82c-d04ce2423d18','Snack Box','Snack Box','Snack Box Regular',35000,'per box',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('4b9e1405-a444-40a4-84ae-5bd9ce4074cf','cb2eb0b7-81f1-426f-a82c-d04ce2423d18','snack_box_regular','Snack Box Regular',1,0);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('cd2dcc16-5205-4063-9679-b124446e6bf9','Kue Tampah','Kue Tampah','Kue Tampah - Small 70pcs',750000,'per tampah',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('232c3644-a0d5-4212-a454-0746ce357352','cd2dcc16-5205-4063-9679-b124446e6bf9','kue_tampah','Kue Tampah - Small 70pcs',1,0);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('c8de0354-4fe0-4c99-be5d-d872c052812d','Kue Tampah','Kue Tampah','Kue Tampah - Medium 90pcs',850000,'per tampah',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('559812dc-f8f7-45ad-8be0-b6e9130ed6c0','c8de0354-4fe0-4c99-be5d-d872c052812d','kue_tampah','Kue Tampah - Medium 90pcs',1,0);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('aae29548-026f-4c36-a943-5b954007b05d','Kue Tampah','Kue Tampah','Kue Tampah - Large 110pcs',1050000,'per tampah',true,false,NULL,true);
INSERT INTO menu_package_components (id,package_id,component_type,nama,qty,sort_order) VALUES
  ('cb3cb374-23d6-4a19-84c6-ce96aafff281','aae29548-026f-4c36-a943-5b954007b05d','kue_tampah','Kue Tampah - Large 110pcs',1,0);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('e4ac42c5-cae2-4586-902d-54f970e19a3f','snack_box_premium','Sweets','multiple',NULL,0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('e6772376-9657-426b-8482-81b110b04a0b','e4ac42c5-cae2-4586-902d-54f970e19a3f','Banana Choco Pie',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('33e4757b-f944-4160-b0c8-428f164a77ba','e4ac42c5-cae2-4586-902d-54f970e19a3f','Chocolate Eclair',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('f54ed9ce-ef18-4518-8c1f-d6ff1fcb2552','e4ac42c5-cae2-4586-902d-54f970e19a3f','Chocolate Brownies',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('d2a917ec-c543-4e96-b196-3fdfd395fc9f','e4ac42c5-cae2-4586-902d-54f970e19a3f','Fruit Tartelette',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('80360e3a-c916-4bf1-bd1f-409786f9d18c','e4ac42c5-cae2-4586-902d-54f970e19a3f','Surabi Kinca Gula Merah',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4aed0510-d717-4b05-82be-173a97277ad7','e4ac42c5-cae2-4586-902d-54f970e19a3f','Oreo Cheese Cake',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('0b504de2-ff22-478b-8e78-a6fafcf4c932','e4ac42c5-cae2-4586-902d-54f970e19a3f','Bugis Ketan Hitam',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('385e006d-836d-4dcc-8d0e-af2c989aff90','e4ac42c5-cae2-4586-902d-54f970e19a3f','Kue Lumpur',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ec94cb56-f796-4ec1-9910-28dff18629b0','e4ac42c5-cae2-4586-902d-54f970e19a3f','Banana Cake',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('547b1c83-bfdf-4615-bff7-bb4d4adc7a4c','e4ac42c5-cae2-4586-902d-54f970e19a3f','Green Tea Cake',9);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('15db68db-d19f-4e4c-92bb-7ab36e7e96f4','e4ac42c5-cae2-4586-902d-54f970e19a3f','Lapis Surabaya',10);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('8e1fb661-0c21-4ed0-90c4-636bbad1c894','e4ac42c5-cae2-4586-902d-54f970e19a3f','Mini Muffin',11);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('11fa232d-6d12-4cf0-942f-cbb36a693cc2','e4ac42c5-cae2-4586-902d-54f970e19a3f','Red Velvet',12);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('1bf60dfc-8500-488f-9e0c-1d33bc19d7c2','snack_box_premium','Savories','multiple',NULL,1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1d75b192-ca70-41b3-b97a-e8093c5b89cc','1bf60dfc-8500-488f-9e0c-1d33bc19d7c2','Mini Smoked Beef Rissoles',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('272ac4d0-5e8f-4094-a460-12336a016be1','1bf60dfc-8500-488f-9e0c-1d33bc19d7c2','Mini Vegetable Spring Roll',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('989573a8-371a-4470-b81e-66766ff69f40','1bf60dfc-8500-488f-9e0c-1d33bc19d7c2','Potato Croquette',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2dad0f35-9b53-43ac-b931-89e71fffee44','1bf60dfc-8500-488f-9e0c-1d33bc19d7c2','Mini Sandwiches',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('5c8c93b0-6353-40d5-8ab5-471beb803042','1bf60dfc-8500-488f-9e0c-1d33bc19d7c2','Mac and Cheese',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('6db880eb-701a-4af8-822a-0ed02f5eb2a2','1bf60dfc-8500-488f-9e0c-1d33bc19d7c2','Martabak Telor',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('01f7dd59-fc38-43de-9e18-143bcf030f8b','1bf60dfc-8500-488f-9e0c-1d33bc19d7c2','Mini Samosa',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('910e05e3-0b75-4d7a-83b7-001a7ff23b6a','1bf60dfc-8500-488f-9e0c-1d33bc19d7c2','Lemper Ayam',7);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('21bfd6fc-51cd-4273-a49e-93ee49c85268','1bf60dfc-8500-488f-9e0c-1d33bc19d7c2','Ketan Bubuk',8);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('9b24a12d-4008-4563-acc7-161258e55815','1bf60dfc-8500-488f-9e0c-1d33bc19d7c2','Pastel Special',9);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('3e9ce1c8-a916-466f-9972-57481c6074ca','1bf60dfc-8500-488f-9e0c-1d33bc19d7c2','Sosis Solo',10);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('674a9aa2-98a9-418d-b704-d017f899ad74','1bf60dfc-8500-488f-9e0c-1d33bc19d7c2','Panada',11);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('351f641a-2415-4fa3-945a-85278f4f6f64','snack_box_regular','Sweets','multiple',NULL,0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('49064c0b-ea6d-4ef8-95a2-9d4460b5e2f3','351f641a-2415-4fa3-945a-85278f4f6f64','Wajik',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('f213a34c-6313-4519-bdc6-3b9e69b2ee6f','351f641a-2415-4fa3-945a-85278f4f6f64','Jentik Manis',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2b376b68-e061-4b19-9f74-0cd88f96edf2','351f641a-2415-4fa3-945a-85278f4f6f64','Klepon',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b7607da0-9b6d-4ec1-9c6d-72b14081d502','351f641a-2415-4fa3-945a-85278f4f6f64','Onde Onde',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('3a9e82f1-3165-4a9e-a7e9-4463cb9e2b84','351f641a-2415-4fa3-945a-85278f4f6f64','Kue Talam',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('a6fc05d6-62ba-4d4e-9345-6bacd98ca3ac','351f641a-2415-4fa3-945a-85278f4f6f64','Kue Mangkok',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b6c16247-1401-49ce-971c-cc8857e2a19a','351f641a-2415-4fa3-945a-85278f4f6f64','Kueku',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('3dfb1c99-4fc4-4c8c-835b-b5a365f51b0d','351f641a-2415-4fa3-945a-85278f4f6f64','Kue Sus Fla',7);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('c320fba2-7329-42ec-9697-c1d38d0dc0bb','snack_box_regular','Savories','multiple',NULL,1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('761c9881-5684-4f0d-8ec3-18420b8e5298','c320fba2-7329-42ec-9697-c1d38d0dc0bb','Pastel',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('782af064-b092-424c-b979-6f25490821a2','c320fba2-7329-42ec-9697-c1d38d0dc0bb','Risoles',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b1ff077a-9aef-4ef4-81b8-b85a05f1749b','c320fba2-7329-42ec-9697-c1d38d0dc0bb','Kroket',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('056718e7-ec10-4416-b594-0bcabcbb985a','c320fba2-7329-42ec-9697-c1d38d0dc0bb','Lemper',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('65a929e0-2b06-43ae-b528-357e59263c63','c320fba2-7329-42ec-9697-c1d38d0dc0bb','Martabak Mini',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('b4613c92-d4e3-4575-8e36-61aa57b30527','c320fba2-7329-42ec-9697-c1d38d0dc0bb','Tahu Isi',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('a8564876-fd68-4cf7-82d6-ac69df279d12','c320fba2-7329-42ec-9697-c1d38d0dc0bb','Aremarem',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('f72e5dae-fdc5-4bec-afc6-4c893c0629d5','c320fba2-7329-42ec-9697-c1d38d0dc0bb','Lumpia',7);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('03d381ad-9934-43e2-a69a-59f82aa04add','kue_tampah','Savories','multiple',NULL,0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('830f6d5d-595b-4545-a210-08c33ef209fe','03d381ad-9934-43e2-a69a-59f82aa04add','Smoked Beef Rissoles',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('ab3a460d-53ce-497c-bd35-c364db08f41e','03d381ad-9934-43e2-a69a-59f82aa04add','Risoles Ragout Ayam',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('00419559-dcc4-45e7-8c61-bc61a665cc2b','03d381ad-9934-43e2-a69a-59f82aa04add','Potato Croquette',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('aa1ea783-88ed-414c-858b-23d0993dc858','03d381ad-9934-43e2-a69a-59f82aa04add','Lemper Ayam',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('947f3a9f-2082-408c-a38f-b7ce917cf22c','03d381ad-9934-43e2-a69a-59f82aa04add','Ketan Bumbu',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('597f2ef0-4f8d-478d-8038-3f817dc52ae4','03d381ad-9934-43e2-a69a-59f82aa04add','Pastel Spesial',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('c05016e6-df63-4ce8-af82-2a520e22bfc3','03d381ad-9934-43e2-a69a-59f82aa04add','Sosis Solo',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('cf5855f1-08fa-48fc-a0b9-ffc6eee15863','03d381ad-9934-43e2-a69a-59f82aa04add','Panada',7);
INSERT INTO menu_catalog_categories (id,component_type,nama,selection_rule,parent_id,sort_order) VALUES
  ('2a1b17d5-6e46-4a7f-8c4e-b0941cee75eb','kue_tampah','Sweets','multiple',NULL,1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('3f532b1a-5774-4a1f-9721-2aab7e788695','2a1b17d5-6e46-4a7f-8c4e-b0941cee75eb','Bugis Ketan Hitam',0);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('1f76be7d-ef30-4f01-a3d8-fb489f7ee79e','2a1b17d5-6e46-4a7f-8c4e-b0941cee75eb','Kue Lumpur',1);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('780f8ccd-fdde-4682-aed4-37831460aa5f','2a1b17d5-6e46-4a7f-8c4e-b0941cee75eb','Kue Ku',2);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('5a1c2f38-a654-4407-9569-10d2b1633ff4','2a1b17d5-6e46-4a7f-8c4e-b0941cee75eb','Dadar Gulung',3);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('c241c971-0aaf-44b3-8f37-187da09636e4','2a1b17d5-6e46-4a7f-8c4e-b0941cee75eb','Bugis Hijau',4);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('09028eb5-1d18-4051-8529-db439602dc35','2a1b17d5-6e46-4a7f-8c4e-b0941cee75eb','Nagasari',5);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('2d0292c6-ee97-4b58-8622-a8071fb70568','2a1b17d5-6e46-4a7f-8c4e-b0941cee75eb','Cantik Manis',6);
INSERT INTO menu_catalog_items (id,category_id,nama,sort_order) VALUES ('4e0a1212-4de8-4efc-9426-62a165372ad0','2a1b17d5-6e46-4a7f-8c4e-b0941cee75eb','Panekuk',7);

-- FOOD STALL
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('dd7e669e-13e9-41c3-9036-563e0f91595d','Food Stall','Indonesian Rice Stall','Nasi Umara',135000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('deb87956-2f92-4465-9699-bd6a899bdc94','Food Stall','Indonesian Rice Stall','Nasi Mataram',135000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('ac0bcab7-c51d-434b-947e-b284ed6c5b82','Food Stall','Indonesian Rice Stall','Nasi Bali',135000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('852984e9-f01a-45b1-9235-6277390c35ba','Food Stall','Indonesian Rice Stall','Nasi Putri Melayu',135000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('4c768cad-ffb6-4e7b-838f-96c9678ec6ce','Food Stall','Indonesian Rice Stall','Nasi Lombok',120000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('3cbcd2fd-fbd7-4791-823d-cb11b77814f6','Food Stall','Indonesian Rice Stall','Nasi Liwet Solo',120000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('67742c0d-662a-4237-9439-bceae1f56e03','Food Stall','Indonesian Rice Stall','Nasi Uduk Special',120000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('39e4e482-0bd9-4c40-b913-d9cac6c9ec14','Food Stall','Indonesian Rice Stall','Nasi Jamblang',120000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('d75d5cb9-7987-4be5-a8ad-9b331d78854d','Food Stall','Indonesian Breakfast Stall','Nasi Ayam Kecombrang',75000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('0538082b-4211-4a74-be6c-5d0e94ccb7e8','Food Stall','Indonesian Breakfast Stall','Nasi Bali Wardhani',75000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('4cd4db76-36d6-46a2-aa68-86ff163082ae','Food Stall','Indonesian Breakfast Stall','Nasi Gudeg Komplit',70000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('8a315b67-92f3-4272-a9be-f8dd510c4fc5','Food Stall','Indonesian Breakfast Stall','Nasi Hijau Empal Gepuk',75000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('19f33580-a336-4d52-82a5-f2bce2ff12fb','Food Stall','Indonesian Breakfast Stall','Nasi Kuning',70000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('7748377f-2b2c-4917-a9de-53906d4ad7b0','Food Stall','Indonesian Breakfast Stall','Nasi Rames Jawa Tengah',75000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('203807dd-5933-4d11-93be-f319e2ce9037','Food Stall','Indonesian Breakfast Stall','Nasi Rawon',75000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('cc812047-e335-41c8-b020-4ee53ae39038','Food Stall','Indonesian Breakfast Stall','Nasi Timbel',75000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('2a78f6d4-c56e-4730-b3f3-d573f4908fec','Food Stall','Indonesian Breakfast Stall','Nasi Tutug Oncom',75000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('d911c0ce-ed29-4c70-9141-cf069a4a5629','Food Stall','Indonesian Breakfast Stall','Nasi Briyani Iga Kambing',80000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5c9c63fa-afbe-4fba-8450-553129cd63bf','Food Stall','Indonesian Breakfast Stall','Nasi Goreng Wagyu',85000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('f1b07e7d-579a-4ce4-af56-89985d074f76','Food Stall','Indonesian Breakfast Stall','Nasi Pecel Pincuk Madiun',55000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('1825c42e-a5d6-48a1-9ecc-d309688f15ab','Food Stall','Indonesian Breakfast Stall','Nasi Dewata Pedas',70000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('883bde14-d1ca-4aa9-b643-bc964a8bc5ad','Food Stall','Indonesian Breakfast Stall','Nasi Goreng Lamb Shank',80000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('1a8a5717-22a7-493b-a23d-fe8297e064fc','Food Stall','Indonesian Breakfast Stall','Nasi Langgi',65000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('4ff2711b-ef44-4b91-b5d2-217737f700ec','Food Stall','Indonesian Breakfast Stall','Nasi Bogana',65000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('7fce9a90-863f-4ce1-9caf-234bf095c18c','Food Stall','Indonesian Breakfast Stall','Nasi Gudeg',70000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('7224b62b-918d-4c69-a84c-2b8c9b201f2a','Food Stall','Indonesian Breakfast Stall','Nasi Gule',70000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('e4c46cfb-16ee-4164-b522-de0ceb2da754','Food Stall','Indonesian Breakfast Stall','Nasi Krawu',70000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('88fcac89-d47d-4ad1-b690-6fae342d736e','Food Stall','Indonesian Breakfast Stall','Nasi Tempong',70000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('95c1e307-499e-4767-ad5c-0c1708fb225f','Food Stall','Indonesian Breakfast Stall','Nasi Uduk Betawi',60000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('321ae783-59e6-4c9a-ba61-ef5540b54519','Food Stall','Indonesian Breakfast Stall','Sego Berkat',70000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('9b6ed515-261f-4a12-b4fd-8473da0aff50','Food Stall','Indonesian Breakfast Stall','Nasi Cakalang Sambal Matah / Embe',70000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('95de5a53-4029-42c6-884f-e46326b1ed88','Food Stall','Aneka Jajanan','Mie Ayam Umara',50000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('54e77120-118d-4a05-9581-a6bf9111f4f8','Food Stall','Aneka Jajanan','Siomay Bandung',55000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('a086775e-2983-41ef-949d-08aaf87deb20','Food Stall','Aneka Jajanan','Bakwan Malang',55000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('21d7aff2-fc98-4abb-80e2-e763018fd1ea','Food Stall','Aneka Jajanan','Bakso Rusuk Iga Sapi',67000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('efc7073c-fcdf-42a3-810b-3594842f1155','Food Stall','Aneka Jajanan','Bakso Campur Umara',50000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('80253b52-260a-481f-8276-e4f63e10693e','Food Stall','Aneka Jajanan','Pempek Palembang',55000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('96183185-4940-49a2-9b56-c457503dd7d8','Food Stall','Aneka Jajanan','Soto Bangkong + Sate Kerang + Lontong',65000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('c06a3d6c-770c-413c-9537-632de623b0bd','Food Stall','Aneka Jajanan','Wonton Lo Mie Kangkung',55000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('45082b5d-0cb5-4e86-8550-1d63819fc3e0','Food Stall','Aneka Jajanan','Sate Kambing + Lontong',67000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('8494484b-4e2a-466b-824c-9fe91ea1bcab','Food Stall','Aneka Jajanan','Sate Ayam + Lontong',55000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('e0f1b8a0-b880-40f4-8724-a4b2d4ec3fbe','Food Stall','Aneka Jajanan','Sate Padang + Lontong',60000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('b94d3b29-a0f2-4e69-894b-0e5bb8f65f40','Food Stall','Aneka Jajanan','Soto Padang + Lontong',57000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('62f17645-f11b-48a5-9715-577c469b25cd','Food Stall','Aneka Jajanan','Soto Seger + Lontong',57000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('9989f3cf-d988-4b64-9558-5460935d418b','Food Stall','Aneka Jajanan','Lontong Cap Gomeh',80000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('cad38be3-f28b-4ed2-946c-0cadc7d74ef3','Food Stall','Aneka Jajanan','Empal Gentong + Lontong',67000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('eb2b6672-522f-4899-bfd4-346c77ce4630','Food Stall','Aneka Jajanan','Kambing Guling + Lontong (30-40 pax)',4400000,'per paket',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('272399f5-9951-4c1e-a650-795bd707e813','Food Stall','Aneka Jajanan','Sate Maranggi + Lontong',67000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('01e484c2-1b11-4c4a-9cba-83f8ccc84e83','Food Stall','Aneka Jajanan','Soto Mie + Nasi',50000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('cedeac79-761f-40f5-9701-659ff16d7d03','Food Stall','Aneka Jajanan','Coto Makassar + Buras',67000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('d9711771-5a36-4a23-80a3-0db30f27d228','Food Stall','Aneka Jajanan','Soto Betawi + Nasi',67000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('aea1bf5e-0a9f-4c9d-9e09-9127a2d1f81e','Food Stall','Aneka Jajanan','Lontong Kikil',60000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('19e28e7c-340b-403b-888b-a03113553f92','Food Stall','Aneka Jajanan','Mie Godog Jawa',50000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('cbe229e1-c42c-47e0-a874-d3b0f3956042','Food Stall','Aneka Jajanan','Laksa Bogor',50000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('dc998839-bb84-4072-a106-eb6a71b68221','Food Stall','Aneka Jajanan','Sei Sapi Umara + Nasi',80000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('9cafab07-eecb-4ec5-9e28-ffb74228b2e8','Food Stall','Aneka Jajanan','Sop Konro + Buras',55000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('d20e16fa-3de7-4a3d-9e73-9e0ac1283c4c','Food Stall','Aneka Jajanan','Tahu Campur Surabaya',50000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('780e740c-6b6d-4454-8cf6-0a3f0a72e118','Food Stall','Aneka Jajanan','Tengkleng Kambing + Lontong',65000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('3499fade-9ff6-4b78-878d-a890486d7298','Food Stall','Aneka Jajanan','Mie Kocok',50000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('eda7f95a-1244-4cc4-9856-8d6be53f1bfc','Food Stall','Aneka Jajanan','Rawon Sapi + Nasi',65000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('2b43fdd6-6288-4d4b-81f4-b28696200e96','Food Stall','Aneka Jajanan','Selat Solo',65000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('45fbde12-7b11-4052-beb1-0fb082bb80a7','Food Stall','Aneka Jajanan','Batagor',65000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('ebdf7316-e22c-4333-82ae-ff00894059d9','Food Stall','Japanese Stall','Salmon Mayoyaki',95000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('548d3135-c702-4aef-bf51-148bd3a66991','Food Stall','Japanese Stall','Salmon Mentai',85000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('8755e69a-4fbf-4864-9575-d7c388323532','Food Stall','Japanese Stall','Osakayaki',100000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('14d22eee-a8ef-4f2b-a489-2818f85efe58','Food Stall','Japanese Stall','Sukiyaki',80000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('437e038c-c022-4297-8898-e3b279f63e69','Food Stall','Japanese Stall','Assorted Sushi',120000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5108a5bf-bef0-4845-8735-d2219992d55e','Food Stall','Japanese Stall','Beef Teriyaki + Salad',73000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('f509a86a-7d2d-477a-8722-a8505630a306','Food Stall','Japanese Stall','Chicken Teriyaki + Salad',67000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('cbb51815-c17f-4153-90fe-e7df098ba3e9','Food Stall','Japanese Stall','Gyutan Don',90000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('093b14c0-4080-4995-aeae-0fce423964e4','Food Stall','Japanese Stall','Japanese Rice Bowl',93000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('e935600f-eaf9-461a-9017-43ad1fd14460','Food Stall','Japanese Stall','Japanese Steamboat',93000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('87807ab8-9d90-4c97-9d5d-a6ea90b4cd95','Food Stall','Japanese Stall','Yakitori',65000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('fd3b58ae-03f6-4b38-b1cc-2169df0246ba','Food Stall','Japanese Stall','Ramen Yatai',65000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5a283d81-327f-4a1e-bc01-006d4fd03f3b','Food Stall','Japanese Stall','Tepanyaki',120000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('0e2037ed-186c-4708-b241-6b46c475ebe5','Food Stall','Asian Stall','Assorted Fried Dim Sum',65000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5563e35d-4118-4358-820b-7961876564d7','Food Stall','Asian Stall','Assorted Steamed Dim Sum',60000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('9594d4dc-b177-4452-8fb7-f172901da315','Food Stall','Asian Stall','Thai Suki',80000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('c357a7bb-0042-4d47-8cf4-e24919bdc429','Food Stall','Asian Stall','Braised Beef Hongkong Noodle',80000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('01823ece-55b8-4527-903a-b52fef512c0c','Food Stall','Asian Stall','Korean BBQ',100000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('07e642c2-70a1-4956-b110-ecb6f7d23609','Food Stall','Asian Stall','Aromatic Duck with Momo Pancake',70000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('f61ba00d-aee4-4025-baa6-c9973bcae429','Food Stall','Asian Stall','Pad Thai Chicken',63000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('b7d124dd-f0de-4f00-86fc-44e64e17bf46','Food Stall','Asian Stall','Pad Thai Seafood',75000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('8293fa34-94fe-46fc-bc08-8db9554ae453','Food Stall','Asian Stall','Mongolian BBQ',100000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('16a251cd-0708-4b4f-8e1a-18ba02c0bd49','Food Stall','Asian Stall','Beef Pho',70000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('273ccdfa-a29b-4926-bc34-2c3ff6858ab1','Food Stall','Asian Stall','Roasted Duck Noodle Asian',80000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('b9d084bb-a059-4be9-b582-938fbe5ca6ad','Food Stall','Asian Stall','Hainan Chicken Rice',50000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('c1cd0b74-ccb7-41ae-a6b6-69e55ca0fdf3','Food Stall','Asian Stall','Hainan Rice with Roasted Duck',55000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('04f26cba-5659-42e1-aa71-41558730dbcd','Food Stall','Asian Stall','Laksa Umara',55000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('6382f70f-f9f1-4ca7-9cbb-234fcf3ab8bf','Food Stall','Western Stall','Penne Pesto Chicken',57000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('832bf8d2-3eee-4b02-8e1c-769615ed3184','Food Stall','Western Stall','Prawn Aglio e Olio with Parmesan',73000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('7242a186-79f0-4e35-9bf6-3a9cf28be32a','Food Stall','Western Stall','Zuppa Soup',57000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('78fe57fc-479d-41c7-92de-91f51c927032','Food Stall','Western Stall','Grandma Roast Chicken',80000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('3f01cae0-204a-4d76-8c66-c3a93261f210','Food Stall','Western Stall','Us Short Plate Roll',140000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('ddc8f3b8-fc3f-412c-85f5-4972fd3289fc','Food Stall','Western Stall','Salmon En Croute',99000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('f186b2c8-55b1-4ce1-af15-3e104e4f3073','Food Stall','Western Stall','Wagyu Roasted Beef',185000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('36477630-dfd1-4363-aa4e-ba9daa1f491a','Food Stall','Western Stall','US BBQ Short Ribs',218000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('226ed04a-9c4b-499f-9bb0-2a92cf1f639a','Food Stall','Western Stall','Beef Lasagna',85000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('8b05dad3-e354-4f6c-9c24-6984db99f675','Food Stall','Western Stall','Prawn au Gratin',100000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('4087caf9-a921-4784-8fea-cf9cbb47384b','Food Stall','Western Stall','Mix BBQ',150000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('57a4f847-b76d-4d7d-9dd5-c69cf941f570','Food Stall','Western Stall','Chicken Cordon Bleu',60000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('91650f65-8a8a-4038-9c7e-16aa9b5a3d53','Food Stall','Western Stall','Beef Wellington',155000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('deb3c298-41dc-4441-b725-a1ff7d654a47','Food Stall','Western Stall','Salad Bar',60000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5b0edba6-b34c-4b4c-b51f-e6550d8020de','Food Stall','Western Stall','Smoked Brisket',150000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5d045745-c983-4250-b8d4-def57fbfc821','Food Stall','Western Stall','Cheese Wheel Pasta - Smoked Beef',70000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('e7a6c52a-a2f2-4fb5-b779-692cb0c423d8','Food Stall','Western Stall','Cheese Wheel Pasta Carbonara Truffled Mushroom',70000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('987b1636-b6cf-47c2-ab55-a4a7c163d040','Food Stall','Western Stall','Pesce al sale',450000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('86d776ea-90d5-4fc7-bf1c-2bc30be2d128','Food Stall','Middle Eastern Stall','Roti Jala Chicken Curry',50000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('e5351f40-a092-4677-80cf-26165c9b1b17','Food Stall','Middle Eastern Stall','Roti Jala Lamb Curry',66000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('54f04d76-b22a-42e1-b25d-ecc21ea249d3','Food Stall','Middle Eastern Stall','Roti Jala Beef Curry',66000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('1f306ca6-afd6-44e4-9992-cc7f5e1d3969','Food Stall','Middle Eastern Stall','Nasi Mandhi/Biryani Lamb',72000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('e3d44ed1-e949-49ba-8f0c-3c7674998d9d','Food Stall','Middle Eastern Stall','Nasi Mandhi/Biryani Beef',66000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('63a2859d-5f00-49d5-91b1-c5a228f943fd','Food Stall','Middle Eastern Stall','Nasi Mandhi/Biryani Chicken',57000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('c0d681b1-212b-4a9a-9908-ed1108e2eacf','Food Stall','Middle Eastern Stall','Chicken Turkish Shawarma',55000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('c59ed4e5-2922-4ed0-bb1d-708d85d704ba','Food Stall','Middle Eastern Stall','Beef Turkish Shawarma',67000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('72f3afc0-e6c8-46b6-b9dd-d5e8791589a4','Food Stall','Middle Eastern Stall','Dujaj Bi Kabsah',129000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('7b8912c7-b4f2-45fe-82d2-af5c6703d687','Food Stall','Dessert Stall','Es Doger',38000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('ec598f1c-8b1d-4a61-bb49-9b9db02d5852','Food Stall','Dessert Stall','Es Cincau',38000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('a5f562c5-7f56-43f7-b060-77b62e5221b4','Food Stall','Dessert Stall','Es Oyen',38000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('09dc5c63-9f3c-4d65-87c7-a0d88346bd51','Food Stall','Dessert Stall','Es Campur',38000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('62a8be5a-36fb-4e2c-82d1-6df8ef483ea0','Food Stall','Dessert Stall','Es Cendol',38000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('40406de8-9a8c-4481-87c6-b1bc11cd241c','Food Stall','Dessert Stall','Es Teler',38000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('a39894ed-3b83-4bbb-b466-bba7beca267c','Food Stall','Dessert Stall','Es Kelapa Muda',38000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('50abac24-d355-48ac-b5d6-486c11aa85d2','Food Stall','Dessert Stall','Colenak dengan Kinca Durian',45000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5012dc87-3f53-4d0e-a46d-c833692688ed','Food Stall','Dessert Stall','Es Shanghai',42000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('855c723d-c4e0-4090-9cbc-1e7dc5a2791d','Food Stall','Dessert Stall','Cassata Ice Cream',45000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('8f546152-8e3b-4fe4-8359-cb9455f865a5','Food Stall','Dessert Stall','Ice Cream Potong Surabaya',42000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('839426cd-8270-4015-bf1c-dc3a0ebbdb0c','Food Stall','Dessert Stall','Crepe Suzzete with Vanilla Ice Cream',70000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5d67bac2-69d7-4e58-b339-ed6c304943fd','Food Stall','Dessert Stall','Banana Crepes Caramel with Vanilla Ice Cream',57000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('b8e5e9ab-32d4-42ef-8628-2aa7214270fb','Food Stall','Dessert Stall','Gelato Bar',65000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('e3b232ac-1844-48dc-9f93-a4f91fdf7b11','Food Stall','Dessert Stall','Es Puter Station',47000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('8a402065-38ab-4d05-84f8-504a62c5b90e','Food Stall','Dessert Stall','Kue Bandros',36000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5595457f-3908-4316-97c7-2b8b6b15cd66','Food Stall','Dessert Stall','Kue Rangi',36000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5239b7dd-872f-49dd-b4ae-0d726d885a51','Food Stall','Dessert Stall','Mango Sticky Rice',50000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('09fb3f3f-c3a4-440b-8ce9-abee82716744','Food Stall','Dessert Stall','Grand Dessert',100000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('bf45da02-51b4-469d-a3b4-6662ab3be902','Food Stall','Dessert Stall','Bumbur Tampah',65000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('5c97fde3-5c34-484b-9f63-3fff6b589b55','Food Stall','Beverages','Coffee & Tea',45000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('46b55977-115a-4ec2-bbba-b191d3b7ec29','Food Stall','Beverages','Es Libo Aceh',44000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('3209d923-ac8e-47df-9a29-8c22a0cf810f','Food Stall','Beverages','Flavoured Tea by bottle',44000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('de03953d-4290-475f-bfeb-17456f6584c7','Food Stall','Beverages','Lemongrass Iced Tea',44000,'per pax',false,true,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('3767301c-8d64-4992-81b5-603efeefb8ac','Food Stall','Beverages','Soft Drink by can',34000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('9c6b5fee-dc37-475f-bece-2eabfb220af3','Food Stall','Beverages','Juice by Bottle (Guava or Orange)',38000,'per pax',false,false,NULL,true);
INSERT INTO menu_packages (id,kategori,sub_kategori,nama_paket,harga_per_pax,satuan,has_selection,is_best_seller,ketentuan,is_active) VALUES
  ('18493331-f7f9-4223-8d26-2d86382d9dd9','Food Stall','Beverages','Mineral Water by Bottle',15000,'per pax',false,false,NULL,true);

COMMIT;

-- Done. semua menu dari 5 katalog sudah di-seed.