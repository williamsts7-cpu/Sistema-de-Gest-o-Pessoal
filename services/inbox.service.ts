import type { SupabaseClient } from "@supabase/supabase-js"
import { serviceError } from "@/services/errors"

export async function captureInboxItem(client: SupabaseClient, content: string) {
  const { data: { user }, error: authError } = await client.auth.getUser()
  if (authError || !user) serviceError("Sua sessao expirou. Entre novamente.", authError)
  const { error } = await client.from("inbox_items").insert({ user_id: user.id, content, source: "manual", status: "unprocessed" })
  if (error) serviceError("Nao foi possivel salvar no Inbox.", error)
}
