import { Activity, CalendarDays, Repeat2, Target } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { listGoals, listHabits } from "@/services/pos-lists.service"
import { listAreas } from "@/services/area.service"
import { statusLabel } from "@/services/pos-overview.logic"
import { CreateHabitPanel } from "@/components/features/module-create-panels"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

function formatDays(days: number[] | null) {
  if (!days?.length) return "Todos os dias"
  const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  return days.map((day) => labels[day] ?? String(day)).join(", ")
}

function frequencyLabel(frequency: string | null | undefined) {
  const labels: Record<string, string> = {
    daily: "Diário",
    weekly: "Semanal",
    monthly: "Mensal",
  }
  return labels[frequency ?? ""] ?? frequency ?? "Não definida"
}

export default async function HabitsPage() {
  const client = await createClient()
  const [habits, areas, goals] = await Promise.all([listHabits(client), listAreas(client), listGoals(client)])
  const activeHabits = habits.filter((habit) => habit.status === "active")
  const dailyHabits = habits.filter((habit) => habit.frequency === "daily")

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section>
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-8 bg-emerald-500" />
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-emerald-300">Consistência</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Hábitos</h1>
        <p className="mt-2 text-muted-foreground">Hábitos rastreáveis, frequência e alvo de repetição.</p>
      </section>

      <CreateHabitPanel areas={areas} goals={goals} />

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Total</p><p className="mt-2 text-3xl font-semibold">{habits.length}</p></CardContent></Card>
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Ativos</p><p className="mt-2 text-3xl font-semibold">{activeHabits.length}</p></CardContent></Card>
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-amber-300">Diários</p><p className="mt-2 text-3xl font-semibold">{dailyHabits.length}</p></CardContent></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {habits.length === 0 ? (
          <Card className="glass-panel rounded-[24px] lg:col-span-2"><CardContent className="py-16 text-center text-muted-foreground">Nenhum hábito encontrado no Supabase.</CardContent></Card>
        ) : habits.map((habit) => (
          <Card key={habit.id} className="glass-panel rounded-[24px]">
            <CardContent className="space-y-5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5"><Activity className="size-4 text-emerald-300" /></div>
                  <div>
                    <h2 className="font-medium">{habit.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{habit.description || "Sem descrição."}</p>
                  </div>
                </div>
                <Badge className="rounded-full bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/20">{statusLabel(habit.status)}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-white/10 bg-white/5"><Repeat2 className="mr-1 size-3" />{frequencyLabel(habit.frequency)}</Badge>
                <Badge variant="outline" className="border-white/10 bg-white/5"><CalendarDays className="mr-1 size-3" />{formatDays(habit.days_of_week)}</Badge>
                <Badge variant="outline" className="border-white/10 bg-white/5"><Target className="mr-1 size-3" />Alvo: {habit.target_count}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
