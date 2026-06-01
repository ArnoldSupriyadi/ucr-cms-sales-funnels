import type { Tables, Enums } from './database'

// ---- Core entity types ----
export type Role = Tables<'roles'>
export type User = Tables<'users'>
export type LoginLog = Tables<'login_logs'>
export type Lead = Tables<'leads'>
export type LeadContact = Tables<'lead_contacts'>
export type Target = Tables<'targets'>
export type Order = Tables<'orders'>
export type OrderStatusLog = Tables<'order_status_logs'>
export type Loa = Tables<'loa'>
export type LoaItem = Tables<'loa_items'>
export type Ib = Tables<'ib'>
export type IbFoodItem = Tables<'ib_food_items'>
export type IbOverheadItem = Tables<'ib_overhead_items'>
export type Beo = Tables<'beo'>
export type MasterRecipe = Tables<'master_recipes'>
export type MenuPackage = Tables<'menu_packages'>
export type OverheadLibrary = Tables<'overhead_library'>

// ---- Enum types ----
export type SegmenEnum = Enums<'segmen_enum'>
export type OrderStatus = Enums<'order_status_enum'>
export type LoaStatus = Enums<'loa_status_enum'>
export type PaymentStatus = Enums<'payment_status_enum'>

// ---- Permissions map (from roles.permissions jsonb) ----
export interface Permissions {
  'leads.create'?: boolean
  'leads.view_all'?: boolean
  'leads.edit'?: boolean
  'leads.delete'?: boolean
  'orders.create'?: boolean
  'orders.view_all'?: boolean
  'orders.edit'?: boolean
  'loa.create'?: boolean
  'loa.view_all'?: boolean
  'loa.approve'?: boolean
  'ib.create'?: boolean
  'ib.view_all'?: boolean
  'beo.create'?: boolean
  'beo.view_all'?: boolean
  'reports.view'?: boolean
  'targets.manage'?: boolean
  'users.manage'?: boolean
  'roles.manage'?: boolean
  'master_data.manage'?: boolean
}

// ---- Enriched types (joins) ----
export type UserWithRole = User & {
  roles: Role
}

export type LeadWithContacts = Lead & {
  lead_contacts: LeadContact[]
  users?: Pick<User, 'id' | 'name'> | null
}

export type OrderWithLead = Order & {
  leads: Pick<Lead, 'id' | 'company_name' | 'segmen'>
  users?: Pick<User, 'id' | 'name'> | null
}

export type OrderWithDetails = Order & {
  leads: LeadWithContacts
  users?: Pick<User, 'id' | 'name'> | null
  order_status_logs: OrderStatusLog[]
  loa?: Loa | null
}

// ---- Session/Auth types ----
export interface AppUser {
  id: string
  name: string
  email: string
  phone: string | null
  jabatan: string | null
  signature_url: string | null
  role_id: string
  is_active: boolean
  role: Role
  permissions: Permissions
}

// ---- Server Action responses ----
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
