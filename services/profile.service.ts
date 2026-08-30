import type { SupabaseClient } from "@supabase/supabase-js"
import type { Profile } from "@/types/database"
import { serviceError } from "@/services/errors"

const PROFILE_COLUMNS = "id, full_name, avatar_url, timezone, locale, theme, settings"

export async function getCurrentProfile(client: SupabaseClient): Promise<Profile | null> {
  const { data: { user }, error: userError } = await client.auth.getUser()
  if (userError) serviceError("Nao foi possivel validar sua sessao.", userError)
  if (!user) return null

  const { data, error } = await client.from("profiles").select(PROFILE_COLUMNS).eq("id", user.id).maybeSingle()
  if (error) serviceError("Nao foi possivel carregar seu perfil.", error)
  const profile = data as Profile | null
  const authName = typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name.trim() : ""

  if (profile && !profile.full_name && authName) {
    const { data: updated, error: updateError } = await client.from("profiles").update({ full_name: authName }).eq("id", user.id).select(PROFILE_COLUMNS).single()
    if (!updateError) return updated as Profile
  }

  return profile ? { ...profile, full_name: profile.full_name || authName || null } : null
}
