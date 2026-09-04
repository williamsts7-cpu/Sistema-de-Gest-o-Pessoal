import { CalendarDays, FolderKanban, Gauge, Target } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { listGoals, listProjects } from "@/services/pos-lists.service"
import { listAreas } from "@/services/area.service"
import { formatDateOnly, statusLabel } from "@/services/pos-overview.logic"
import { CreateProjectPanel } from "@/components/features/module-create-panels"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

function progressValue(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0
  return Math.max(0, Math.min(100, value))
}

export default async function ProjectsPage() {
  const client = await createClient()
  const [projects, areas, goals] = await Promise.all([listProjects(client), listAreas(client), listGoals(client)])
  const activeProjects = projects.filter((project) => !["completed", "archived", "cancelled"].includes(project.status))
  const averageProgress = projects.length ? Math.round(projects.reduce((total, project) => total + progressValue(project.progress), 0) / projects.length) : 0

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section>
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-8 bg-indigo-500" />
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-indigo-300">Planejamento</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
        <p className="mt-2 text-muted-foreground">Frentes ativas, progresso e prazos dos seus projetos.</p>
      </section>

      <CreateProjectPanel areas={areas} goals={goals} />

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-indigo-300">Total</p><p className="mt-2 text-3xl font-semibold">{projects.length}</p></CardContent></Card>
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Ativos</p><p className="mt-2 text-3xl font-semibold">{activeProjects.length}</p></CardContent></Card>
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Progresso médio</p><p className="mt-2 text-3xl font-semibold">{averageProgress}%</p></CardContent></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {projects.length === 0 ? (
          <Card className="glass-panel rounded-[24px] lg:col-span-2"><CardContent className="py-16 text-center text-muted-foreground">Nenhum projeto encontrado no Supabase.</CardContent></Card>
        ) : projects.map((project) => {
          const progress = progressValue(project.progress)
          return (
            <Card key={project.id} className="glass-panel rounded-[24px]">
              <CardContent className="space-y-5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5"><FolderKanban className="size-4 text-indigo-300" /></div>
                    <div>
                      <h2 className="font-medium">{project.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{project.description || project.notes || "Sem descrição."}</p>
                    </div>
                  </div>
                  <Badge className="rounded-full bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/20">{statusLabel(project.status)}</Badge>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground"><span className="flex items-center"><Gauge className="mr-1 size-3" />Progresso</span><span>{progress}%</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${progress}%` }} /></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-white/10 bg-white/5"><Target className="mr-1 size-3" />{project.priority}</Badge>
                  <Badge variant="outline" className="border-white/10 bg-white/5"><CalendarDays className="mr-1 size-3" />Prazo: {formatDateOnly(project.due_date)}</Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>
    </div>
  )
}
