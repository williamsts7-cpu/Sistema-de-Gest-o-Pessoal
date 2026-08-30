import { createClient } from "@/lib/supabase/server"
import { getCurrentProfile } from "@/services/profile.service"
import { logout } from "@/app/settings/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsPage() {
  const profile = await getCurrentProfile(await createClient())
  return <div className="mx-auto flex w-full max-w-3xl flex-col gap-6"><div><h1 className="text-3xl font-bold tracking-tight">Settings</h1><p className="text-muted-foreground">Perfil e sessao da sua conta.</p></div><Card className="rounded-[24px] border-white/10 bg-white/5"><CardHeader><CardTitle>{profile?.full_name || "Usuario"}</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p><span className="text-muted-foreground">Locale:</span> {profile?.locale || "Nao definido"}</p><p><span className="text-muted-foreground">Timezone:</span> {profile?.timezone || "Nao definido"}</p><form action={logout} className="pt-4"><Button variant="outline">Sair</Button></form></CardContent></Card></div>
}
