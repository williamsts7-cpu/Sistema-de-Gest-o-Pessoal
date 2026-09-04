import { CheckCircle2, Clock3, Repeat2, Timer } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { listGoals, listRoutines } from "@/services/pos-lists.service"
import { listAreas } from "@/services/area.service"
import { formatRoutineSchedule, statusLabel } from "@/services/pos-overview.logic"
import { CreateRoutinePanel } from "@/components/features/module-create-panels"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default async function RoutinesPage() {
  const client = await createClient()
  const [routines, areas, goals] = await Promise.all([listRoutines(client), listAreas(client), listGoals(client)])
  const activeRoutines = routines.filter((routine) => routine.status === "active")
  const scheduledRoutines = routines.filter((routine) => routine.schedules.length > 0)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section>
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-8 bg-emerald-500" />
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-emerald-300">Consistência</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Rotinas</h1>
        <p className="mt-2 text-muted-foreground">Rituais recorrentes, horários e duração estimada.</p>
      </section>

      <CreateRoutinePanel areas={areas} goals={goals} />

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Total</p><p className="mt-2 text-3xl font-semibold">{routines.length}</p></CardContent></Card>
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Ativas</p><p className="mt-2 text-3xl font-semibold">{activeRoutines.length}</p></CardContent></Card>
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-amber-300">Agendadas</p><p className="mt-2 text-3xl font-semibold">{scheduledRoutines.length}</p></CardContent></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {routines.length === 0 ? (
          <Card className="glass-panel rounded-[24px] lg:col-span-2"><CardContent className="py-16 text-center text-muted-foreground">Nenhuma rotina encontrada no Supabase.</CardContent></Card>
        ) : routines.map((routine) => (
          <Card key={routine.id} className="glass-panel rounded-[24px]">
            <CardContent className="space-y-5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5"><Repeat2 className="size-4 text-emerald-300" /></div>
                  <div>
                    <h2 className="font-medium">{routine.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{routine.description || routine.notes || "Sem descrição."}</p>
                  </div>
                </div>
                <Badge className="rounded-full bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/20">{statusLabel(routine.status)}</Badge>
              </div>
              <div className="space-y-2">
                {(routine.schedules.length ? routine.schedules : [null]).map((schedule, index) => (
                  <div key={schedule?.id ?? index} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                    <span className="flex items-center text-muted-foreground"><Clock3 className="mr-2 size-4 text-cyan-300" />{formatRoutineSchedule(schedule)}</span>
                    <span className="flex items-center text-xs text-muted-foreground"><Timer className="mr-1 size-3" />{schedule?.duration_minutes ?? routine.estimated_minutes ?? 0} min</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-white/10 bg-white/5"><CheckCircle2 className="mr-1 size-3" />{routine.priority}</Badge>
                <Badge variant="outline" className="border-white/10 bg-white/5">Checklist: {Array.isArray(routine.checklist) ? routine.checklist.length : 0}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
