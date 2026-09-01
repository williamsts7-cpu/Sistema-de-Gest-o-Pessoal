import { Flag, Gauge, Target, Trophy } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { listGoals } from "@/services/pos-lists.service"
import { formatDateOnly, statusLabel } from "@/services/pos-overview.logic"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

function progressValue(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0
  return Math.max(0, Math.min(100, value))
}

export default async function GoalsPage() {
  const goals = await listGoals(await createClient())
  const activeGoals = goals.filter((goal) => !["completed", "archived", "cancelled"].includes(goal.status))
  const averageProgress = goals.length ? Math.round(goals.reduce((total, goal) => total + progressValue(goal.progress), 0) / goals.length) : 0

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section>
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-8 bg-violet-500" />
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-violet-300">Direção</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Metas</h1>
        <p className="mt-2 text-muted-foreground">Objetivos, progresso e critérios de sucesso do seu ciclo.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-violet-300">Total</p><p className="mt-2 text-3xl font-semibold">{goals.length}</p></CardContent></Card>
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Ativas</p><p className="mt-2 text-3xl font-semibold">{activeGoals.length}</p></CardContent></Card>
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Progresso médio</p><p className="mt-2 text-3xl font-semibold">{averageProgress}%</p></CardContent></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {goals.length === 0 ? (
          <Card className="glass-panel rounded-[24px] lg:col-span-2"><CardContent className="py-16 text-center text-muted-foreground">Nenhuma meta encontrada no Supabase.</CardContent></Card>
        ) : goals.map((goal) => {
          const progress = progressValue(goal.progress)
          return (
            <Card key={goal.id} className="glass-panel rounded-[24px]">
              <CardContent className="space-y-5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5"><Target className="size-4 text-violet-300" /></div>
                    <div>
                      <h2 className="font-medium">{goal.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{goal.description || goal.motivation || "Sem descrição."}</p>
                    </div>
                  </div>
                  <Badge className="rounded-full bg-violet-500/20 text-violet-100 hover:bg-violet-500/20">{statusLabel(goal.status)}</Badge>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground"><span className="flex items-center"><Gauge className="mr-1 size-3" />Progresso</span><span>{progress}%</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${progress}%` }} /></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-white/10 bg-white/5"><Flag className="mr-1 size-3" />{goal.priority}</Badge>
                  <Badge variant="outline" className="border-white/10 bg-white/5"><Trophy className="mr-1 size-3" />{goal.success_criteria || "Critério não definido"}</Badge>
                  <Badge variant="outline" className="border-white/10 bg-white/5">Prazo: {formatDateOnly(goal.due_date)}</Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>
    </div>
  )
}
