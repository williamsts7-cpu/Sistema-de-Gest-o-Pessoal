"use server"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
export interface AuthState { error: string | null; message: string | null }
export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim(), password = String(formData.get("password") ?? ""), next = String(formData.get("next") ?? "/dashboard")
  if (!email || !password) return { error: "Informe e-mail e senha.", message: null }
  const { error } = await (await createClient()).auth.signInWithPassword({ email, password })
  if (error) return { error: "E-mail ou senha invalidos.", message: null }
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard")
}
export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim(), password = String(formData.get("password") ?? ""), fullName = String(formData.get("fullName") ?? "").trim()
  if (!email || password.length < 6) return { error: "Use um e-mail valido e uma senha com pelo menos 6 caracteres.", message: null }
  const { data, error } = await (await createClient()).auth.signUp({ email, password, options: { data: { full_name: fullName } } })
  if (error) return { error: "Nao foi possivel criar a conta. Verifique os dados.", message: null }
  if (!data.session) return { error: null, message: "Conta criada. Confirme seu e-mail antes de entrar." }
  redirect("/dashboard")
}

export async function authenticate(state: AuthState, formData: FormData): Promise<AuthState> {
  return formData.get("mode") === "signup" ? signUp(state, formData) : login(state, formData)
}
export async function logout() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/login") }
