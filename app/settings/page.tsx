import { createClient } from "@/lib/supabase/server"
import { getCurrentProfile } from "@/services/profile.service"
import { logout } from "@/app/settings/actions"
import { cookies } from "next/headers"
import { getDictionary, normalizeLocale } from "@/lib/i18n"
import { LanguageForm } from "@/components/settings/language-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
export default async function SettingsPage() {
  const profile = await getCurrentProfile(await createClient())
  const locale = normalizeLocale((await cookies()).get("app-locale")?.value || profile?.locale)
  const t = getDictionary(locale)
  return <div className="mx-auto flex w-full max-w-3xl flex-col gap-6"><div><h1 className="text-3xl font-bold tracking-tight">{t["settings.title"]}</h1><p className="text-muted-foreground">{t["settings.subtitle"]}</p></div><Card className="glass-panel rounded-[24px]"><CardHeader><CardTitle>{profile?.full_name || t["settings.user"]}</CardTitle></CardHeader><CardContent className="space-y-6 text-sm"><LanguageForm /><div><span className="text-muted-foreground">{t["settings.timezone"]}:</span> {profile?.timezone || t["common.notDefined"]}</div><form action={logout} className="pt-2"><Button type="submit" variant="outline">{t["settings.logout"]}</Button></form></CardContent></Card></div>
}
