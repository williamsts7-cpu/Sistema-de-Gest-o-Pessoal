import type { SupabaseClient } from "@supabase/supabase-js"
import type { Area, AreaCreate, AreaUpdate } from "@/types/database"
import { serviceError } from "@/services/errors"

const AREA_COLUMNS = "id, user_id, parent_id, name, slug, description, icon, color, position, status, metadata, created_at, updated_at, archived_at"

export async function listAreas(client: SupabaseClient): Promise<Area[]> {
  const { data, error } = await client.from("areas").select(AREA_COLUMNS).neq("status", "archived").order("position")
  if (error) serviceError("Nao foi possivel carregar as areas.", error)
  return (data ?? []) as Area[]
}

export async function createArea(client: SupabaseClient, input: AreaCreate): Promise<Area> {
  const { data: { user }, error: authError } = await client.auth.getUser()
  if (authError || !user) serviceError("Sua sessao expirou. Entre novamente.", authError)
  const { data, error } = await client.from("areas").insert({ ...input, user_id: user.id }).select(AREA_COLUMNS).single()
  if (error) serviceError("Nao foi possivel criar a area.", error)
  return data as Area
}

export async function updateArea(client: SupabaseClient, id: string, input: AreaUpdate): Promise<Area> {
  const { data, error } = await client.from("areas").update(input).eq("id", id).select(AREA_COLUMNS).single()
  if (error) serviceError("Nao foi possivel atualizar a area.", error)
  return data as Area
}

export async function archiveArea(client: SupabaseClient, id: string): Promise<void> {
  const { error } = await client.from("areas").update({ status: "archived", archived_at: new Date().toISOString() }).eq("id", id)
  if (error) serviceError("Nao foi possivel arquivar a area.", error)
}
