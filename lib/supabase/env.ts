const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export function getSupabaseEnv() {
  if (!url || !publishableKey) {
    throw new Error("As variaveis publicas do Supabase nao estao configuradas.")
  }

  return { url, publishableKey }
}
