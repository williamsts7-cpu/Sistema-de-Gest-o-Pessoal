import Link from "next/link"
import { ArrowRight, CalendarDays, CheckSquare2, Inbox, Sparkles, Target } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentProfile } from "@/services/profile.service"
import { getRequestI18n } from "@/lib/i18n-server"
import type { TranslationKey } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sections: { title: TranslationKey; description: TranslationKey; action: TranslationKey; href: string; icon: typeof Target }[] = [
  { title: "dashboard.focus", description: "dashboard.focusEmpty", href: "/tasks", action: "dashboard.createTask", icon: CheckSquare2 },
  { title: "dashboard.priorityProjects", description: "dashboard.projectsEmpty", href: "/projects", action: "dashboard.viewProjects", icon: Sparkles },
  { title: "dashboard.goalProgress", description: "dashboard.goalsEmpty", href: "/goals", action: "dashboard.setGoal", icon: Target },
  { title: "dashboard.schedule", description: "dashboard.scheduleEmpty", href: "/calendar", action: "dashboard.openCalendar", icon: CalendarDays },
]

export default async function DashboardPage() {
  const [profile, { t }] = await Promise.all([getCurrentProfile(await createClient()), getRequestI18n()])
  const firstName = profile?.full_name?.trim().split(/\s+/)[0] || ""
  const stats: { label: TranslationKey; icon: typeof Inbox }[] = [{ label: "nav.inbox", icon: Inbox }, { label: "dashboard.tasks", icon: CheckSquare2 }, { label: "dashboard.goals", icon: Target }, { label: "dashboard.schedule", icon: CalendarDays }]
  return <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10"><section className="relative pt-4"><div className="mb-4 flex items-center gap-3"><div className="h-px w-8 bg-fuchsia-500" /><span className="text-xs font-medium uppercase tracking-[0.24em] text-fuchsia-400">Dashboard</span></div><h1 className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-5xl">{t["dashboard.hello"]}{firstName ? `, ${firstName}` : ""}.</h1><p className="mt-2 text-gray-400">{t["dashboard.ready"]}</p></section><section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(({ label, icon: Icon }) => <Card key={label} className="glass-panel rounded-[24px]"><CardHeader className="pb-2"><CardTitle className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-fuchsia-300">{t[label]}<Icon className="size-4 text-indigo-300" /></CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">0</div><p className="mt-1 text-xs text-gray-500">{t["dashboard.none"]}</p></CardContent></Card>)}</section><section className="grid gap-5 md:grid-cols-2">{sections.map(({ title, description, href, action, icon: Icon }) => <Card key={title} className="glass-panel rounded-[24px]"><CardContent className="flex min-h-48 flex-col items-center justify-center p-7 text-center"><div className="mb-4 flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5"><Icon className="size-5 text-indigo-300" /></div><h2 className="text-lg font-medium">{t[title]}</h2><p className="mt-2 max-w-xs text-sm text-gray-400">{t[description]}</p><Button className="mt-5 rounded-full" variant="outline" render={<Link href={href} />}><span>{t[action]}</span><ArrowRight className="ml-1 size-3.5" /></Button></CardContent></Card>)}</section></div>
}
