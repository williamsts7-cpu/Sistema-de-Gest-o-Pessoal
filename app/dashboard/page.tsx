import Link from "next/link"
import { ArrowRight, CalendarDays, CheckSquare2, Inbox, Sparkles, Target } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentProfile } from "@/services/profile.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const emptySections = [
  { title: "Foco do dia", description: "Suas tarefas prioritarias aparecerao aqui.", href: "/tasks", action: "Criar tarefa", icon: CheckSquare2 },
  { title: "Projetos prioritarios", description: "Crie seu primeiro projeto para acompanhar o progresso.", href: "/projects", action: "Ver projetos", icon: Sparkles },
  { title: "Progresso de metas", description: "Defina uma meta conectada a uma area da sua vida.", href: "/goals", action: "Definir meta", icon: Target },
  { title: "Agenda", description: "Nenhum evento programado para hoje.", href: "/calendar", action: "Abrir calendario", icon: CalendarDays },
]

export default async function DashboardPage() {
  const profile = await getCurrentProfile(await createClient())
  const firstName = profile?.full_name?.trim().split(/\s+/)[0] || ""

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10">
      <section className="relative pt-4">
        <div className="mb-4 flex items-center gap-3"><div className="h-px w-8 bg-fuchsia-500" /><span className="text-xs font-medium uppercase tracking-[0.24em] text-fuchsia-400">Dashboard</span></div>
        <h1 className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-5xl">Ola{firstName ? `, ${firstName}` : ""}.</h1>
        <p className="mt-2 text-gray-400">Seu sistema esta pronto para receber o que importa.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[{ label: "Inbox", icon: Inbox }, { label: "Tarefas", icon: CheckSquare2 }, { label: "Metas", icon: Target }, { label: "Agenda", icon: CalendarDays }].map(({ label, icon: Icon }) => (
          <Card key={label} className="glass-panel group rounded-[24px]"><CardHeader className="pb-2"><CardTitle className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-fuchsia-300">{label}<Icon className="size-4 text-indigo-300" /></CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold text-white">0</div><p className="mt-1 text-xs text-gray-500">Nenhum registro</p></CardContent></Card>
        ))}
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {emptySections.map(({ title, description, href, action, icon: Icon }) => (
          <Card key={title} className="glass-panel rounded-[24px]"><CardContent className="flex min-h-48 flex-col items-center justify-center p-7 text-center"><div className="mb-4 flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"><Icon className="size-5 text-indigo-300" /></div><h2 className="text-lg font-medium tracking-tight">{title}</h2><p className="mt-2 max-w-xs text-sm text-gray-400">{description}</p><Button className="mt-5 rounded-full border-white/10 bg-white/5 px-4 hover:-translate-y-0.5 hover:bg-white/10" variant="outline" render={<Link href={href} />}><span>{action}</span><ArrowRight className="ml-1 size-3.5" /></Button></CardContent></Card>
        ))}
      </section>
    </div>
  )
}
