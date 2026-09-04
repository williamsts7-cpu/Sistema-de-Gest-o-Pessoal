import { ClipboardList, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { listProcesses } from "@/services/pos-lists.service"
import { listAreas } from "@/services/area.service"
import { statusLabel } from "@/services/pos-overview.logic"
import { CreateProcessPanel } from "@/components/features/module-create-panels"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default async function ProcessesPage() {
  const client = await createClient()
  const [processes, areas] = await Promise.all([listProcesses(client), listAreas(client)])
  const activeProcesses = processes.filter((process) => process.status === "active")

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section>
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-8 bg-amber-500" />
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-amber-300">Operação</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Processos</h1>
        <p className="mt-2 text-muted-foreground">Procedimentos, instruções e padrões para repetir execução com qualidade.</p>
      </section>

      <CreateProcessPanel areas={areas} />

      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-amber-300">Total</p><p className="mt-2 text-3xl font-semibold">{processes.length}</p></CardContent></Card>
        <Card className="glass-panel rounded-[24px]"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Ativos</p><p className="mt-2 text-3xl font-semibold">{activeProcesses.length}</p></CardContent></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {processes.length === 0 ? (
          <Card className="glass-panel rounded-[24px] lg:col-span-2"><CardContent className="py-16 text-center text-muted-foreground">Nenhum processo encontrado no Supabase.</CardContent></Card>
        ) : processes.map((process) => (
          <Card key={process.id} className="glass-panel rounded-[24px]">
            <CardContent className="space-y-5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5"><ClipboardList className="size-4 text-amber-300" /></div>
                  <div>
                    <h2 className="font-medium">{process.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{process.description || "Sem descrição."}</p>
                  </div>
                </div>
                <Badge className="rounded-full bg-amber-500/20 text-amber-100 hover:bg-amber-500/20">{statusLabel(process.status)}</Badge>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-muted-foreground">
                <div className="mb-2 flex items-center text-xs uppercase tracking-[0.18em] text-amber-200"><FileText className="mr-2 size-3" />Instruções</div>
                <p className="whitespace-pre-line">{process.instructions || "Nenhuma instrução definida."}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
