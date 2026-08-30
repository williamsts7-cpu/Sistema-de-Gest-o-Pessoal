"use server"
import { logout as performLogout } from "@/app/login/actions"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { normalizeLocale } from "@/lib/i18n"
import { updateProfileLocale } from "@/services/profile.service"

export async function logout() {
  await performLogout()
}

export async function changeLocale(formData: FormData) {
  const locale = normalizeLocale(String(formData.get("locale") ?? "pt-BR"))
  await updateProfileLocale(await createClient(), locale)
  const cookieStore = await cookies()
  cookieStore.set("app-locale", locale, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 })
  redirect("/settings")
}
