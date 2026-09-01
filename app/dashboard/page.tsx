import Link from "next/link"
import { ArrowRight, CalendarDays, CheckSquare2, CircleDot, Inbox, Sparkles, Target } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentProfile } from "@/services/profile.service"
import { getTodayOverview } from "@/services/today-summary.service"
import { getRequestI18n } from "@/lib/i18n-server"
import type { TranslationKey } from "@/lib/i18n"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sections: { title: TranslationKey; description: TranslationKey; action: TranslationKey; href: string; icon: typeof Target }[] = [
  { title: "dashboard.focus", description: "dashboard.focusEmpty", href: "/tasks", action: "dashboard.createTask", icon: CheckSquare2 },
  { title: "dashboard.priorityProjects", description: "dashboard.projectsEmpty", href: "/projects", action: "dashboard.viewProjects", icon: Sparkles },
  { title: "dashboard.goalProgress", description: "dashboard.goalsEmpty", href: "/goals", action: "dashboard.setGoal", icon: Target },
  { title: "dashboard.schedule", description: "dashboard.scheduleEmpty", href: "/calendar", action: "dashboard.openCalendar", icon: CalendarDays },
]

const insightStyles = {
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  attention: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  risk: "border-rose-400/20 bg-rose-400/10 text-rose-100",
  info: "border-cyan-400/20 bg-cyan-400/10 text-cyan-100",
}

const focusIcons = {
  task: CheckSquare2,
  event: CalendarDays,
  goal: Target,
  routine: CircleDot,
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const [profile, todayOverview, { t }] = await Promise.all([
    getCurrentProfile(supabase),
    getTodayOverview(supabase),
    getRequestI18n(),
  ])
  const firstName = profile?.full_name?.trim().split(/\s+/)[0] || ""
  const stats = [
    { label: "Tarefas hoje", value: todayOverview.stats.openTasksToday, detail: `${todayOverview.stats.tasksToday} no total`, icon: CheckSquare2 },
    { label: "Atrasadas", value: todayOverview.stats.overdueTasks, detail: "para resolver ou reprogramar", icon: Inbox },
    { label: "Metas ativas", value: todayOverview.stats.activeGoals, detail: `${todayOverview.stats.goalsNeedingAttention} em atenção`, icon: Target },
    { label: "Agenda", value: todayOverview.stats.eventsToday, detail: `${todayOverview.stats.routinesDueToday} rotina(s) agendada(s)`, icon: CalendarDays },
  ]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10">
      <section className="relative pt-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-8 bg-fuchsia-500" />
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-fuchsia-400">Dashboard</span>
        </div>
        <h1 className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-5xl">
          {t["dashboard.hello"]}{firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="mt-2 text-gray-400">{todayOverview.report}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <Card key={label} className="glass-panel rounded-[24px]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-fuchsia-300">
                {label}<Icon className="size-4 text-indigo-300" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{value}</div>
              <p className="mt-1 text-xs text-gray-500">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="glass-panel rounded-[24px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg font-medium">
              Foco de hoje
              <Badge variant="outline" className="border-white/10 bg-white/5 text-cyan-200">{todayOverview.today}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayOverview.focusItems.length > 0 ? todayOverview.focusItems.map((item) => {
              const Icon = focusIcons[item.kind]
              return (
                <Link key={`${item.kind}-${item.id}`} href={item.href} className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                  <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                    <Icon className="size-4 text-cyan-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.label}</p>
                  </div>
                  <ArrowRight className="size-4 text-gray-500" />
                </Link>
              )
            }) : (
              <div className="rounded-[18px] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-gray-400">
                Nenhuma prioridade crítica encontrada para hoje.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Insights operacionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayOverview.setupRequired ? (
              <div className="rounded-[18px] border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                O resumo ainda não encontrou as tabelas esperadas no Supabase conectado.
              </div>
            ) : todayOverview.insights.map((insight) => (
              <div key={insight.message} className={`rounded-[18px] border p-4 text-sm ${insightStyles[insight.kind]}`}>
                {insight.message}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {sections.map(({ title, description, href, action, icon: Icon }) => (
          <Card key={title} className="glass-panel rounded-[24px]">
            <CardContent className="flex min-h-48 flex-col items-center justify-center p-7 text-center">
              <div className="mb-4 flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Icon className="size-5 text-indigo-300" />
              </div>
              <h2 className="text-lg font-medium">{t[title]}</h2>
              <p className="mt-2 max-w-xs text-sm text-gray-400">{t[description]}</p>
              <Button className="mt-5 rounded-full" variant="outline" render={<Link href={href} />}>
                <span>{t[action]}</span><ArrowRight className="ml-1 size-3.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
