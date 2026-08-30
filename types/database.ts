export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  timezone: string | null
  locale: string | null
  theme: string | null
  settings: Json | null
}

export interface Area {
  id: string
  user_id: string
  parent_id: string | null
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  position: number
  status: string
  is_favorite: boolean
  metadata: Json | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

export type AreaCreate = Pick<Area, "name" | "slug"> & Partial<Pick<Area, "description" | "icon" | "color" | "position" | "parent_id">>
export type AreaUpdate = Partial<Pick<Area, "name" | "slug" | "description" | "icon" | "color" | "position" | "parent_id" | "is_favorite">>
