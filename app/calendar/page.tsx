import { CalendarDays, Clock, MapPin, Video } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { listCalendarEvents } from "@/services/pos-lists.service"
import { formatDateTime, statusLabel } from "@/services/pos-overview.logic"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default async function CalendarPage() {
  const events = await listCalendarEvents(await createClient())
  const allDayEvents = events.filter((event) => event.all_day)
  const linkedEvents = events.filter((event) => event.task_id || event.project_id || event.routine_id)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section>
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-8 bg-sky-500" />
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-sky-300">Tempo</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
        <p className="mt-2 text-muted-foreground">Eventos, blocos de tempo e compromissos conectados ao seu sistema.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-sky-300">Eventos</p><p className="mt-2 text-3xl font-semibold">{events.length}</p></CardContent></Card>
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Dia inteiro</p><p className="mt-2 text-3xl font-semibold">{allDayEvents.length}</p></CardContent></Card>
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Conectados</p><p className="mt-2 text-3xl font-semibold">{linkedEvents.length}</p></CardContent></Card>
      </section>

      <section className="space-y-3">
        {events.length === 0 ? (
          <Card className="glass-panel rounded-[24px]"><CardContent className="py-16 text-center text-muted-foreground">Nenhum evento encontrado no Supabase.</CardContent></Card>
        ) : events.map((event) => (
          <Card key={event.id} className="glass-panel rounded-[22px]">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5"><CalendarDays className="size-4 text-sky-300" /></div>
                <div>
                  <h2 className="font-medium">{event.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{event.description || "Sem descrição."}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-white/10 bg-white/5"><Clock className="mr-1 size-3" />{event.all_day ? "Dia inteiro" : `${formatDateTime(event.start_at)} → ${formatDateTime(event.end_at)}`}</Badge>
                    {event.location && <Badge variant="outline" className="border-white/10 bg-white/5"><MapPin className="mr-1 size-3" />{event.location}</Badge>}
                    {event.external_provider && <Badge variant="outline" className="border-white/10 bg-white/5"><Video className="mr-1 size-3" />{event.external_provider}</Badge>}
                  </div>
                </div>
              </div>
              <Badge className="rounded-full bg-sky-500/20 text-sky-100 hover:bg-sky-500/20">{statusLabel(event.event_type)}</Badge>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
