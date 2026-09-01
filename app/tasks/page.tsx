import { CalendarClock, CheckSquare2, Clock, Flag } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { listTasks } from "@/services/pos-lists.service"
import { formatDateTime, statusLabel } from "@/services/pos-overview.logic"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default async function TasksPage() {
  const tasks = await listTasks(await createClient())
  const openTasks = tasks.filter((task) => !["completed", "cancelled", "archived"].includes(task.status))

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section>
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-8 bg-fuchsia-500" />
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-fuchsia-400">Execução</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
        <p className="mt-2 text-muted-foreground">Ações abertas, próximas entregas e compromissos operacionais.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300">Total</p><p className="mt-2 text-3xl font-semibold">{tasks.length}</p></CardContent></Card>
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Abertas</p><p className="mt-2 text-3xl font-semibold">{openTasks.length}</p></CardContent></Card>
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-amber-300">Favoritas</p><p className="mt-2 text-3xl font-semibold">{tasks.filter((task) => task.is_favorite).length}</p></CardContent></Card>
      </section>

      <section className="space-y-3">
        {tasks.length === 0 ? (
          <Card className="glass-panel rounded-[24px]"><CardContent className="py-16 text-center text-muted-foreground">Nenhuma tarefa encontrada no Supabase.</CardContent></Card>
        ) : tasks.map((task) => (
          <Card key={task.id} className="glass-panel rounded-[22px]">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5"><CheckSquare2 className="size-4 text-cyan-300" /></div>
                <div>
                  <h2 className="font-medium">{task.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{task.description || task.context || "Sem descrição."}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-white/10 bg-white/5"><Flag className="mr-1 size-3" />{task.priority}</Badge>
                    <Badge variant="outline" className="border-white/10 bg-white/5"><Clock className="mr-1 size-3" />{task.estimated_minutes ?? 0} min</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <Badge className="rounded-full bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/20">{statusLabel(task.status)}</Badge>
                <span className="flex items-center text-xs text-muted-foreground"><CalendarClock className="mr-1 size-3" />{formatDateTime(task.due_at ?? task.scheduled_at)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
