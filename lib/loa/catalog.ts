import { createClient } from '@/lib/supabase/server'
import type { MenuCatalog } from '@/features/loa/types'
import { shapeMenuCatalog } from '@/lib/loa/catalog-shape'

/** Ambil seluruh katalog menu untuk form LoA dan bentuk jadi MenuCatalog. */
export async function loadMenuCatalog(): Promise<MenuCatalog> {
  const supabase = await createClient()

  const [pkgRes, compRes, catRes, itemRes] = await Promise.all([
    supabase.from('menu_packages').select('id, nama_paket, kategori, harga_per_pax, harga_minimum, has_selection').eq('is_active', true).order('nama_paket'),
    supabase.from('menu_package_components').select('package_id, component_type, nama, qty, sort_order').order('sort_order'),
    supabase.from('menu_catalog_categories').select('id, component_type, nama, selection_rule, parent_id, sort_order').order('sort_order'),
    supabase.from('menu_catalog_items').select('id, category_id, nama').eq('is_active', true).order('sort_order'),
  ])

  return shapeMenuCatalog({
    packages: pkgRes.data ?? [],
    components: compRes.data ?? [],
    categories: catRes.data ?? [],
    items: itemRes.data ?? [],
  })
}
