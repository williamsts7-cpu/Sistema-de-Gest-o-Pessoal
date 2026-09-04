import { Compass, Gem, Lightbulb, Mountain, ScrollText } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getPurpose } from "@/services/pos-lists.service"
import type { Json } from "@/types/database"
import { CreatePurposePanel } from "@/components/features/module-create-panels"
import { Card, CardContent } from "@/components/ui/card"

function asStringList(value: Json | null | undefined) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : []
}

function ListBlock({ icon: Icon, items, title }: { icon: typeof Gem; items: string[]; title: string }) {
  return (
    <Card className="glass-panel rounded-[24px]">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium"><Icon className="size-4 text-cyan-300" />{title}</div>
        {items.length === 0 ? <p className="text-sm text-muted-foreground">Ainda não definido.</p> : (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {items.map((item) => <li key={item} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">{item}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default async function PurposePage() {
  const purpose = await getPurpose(await createClient())
  const values = asStringList(purpose?.values)
  const principles = asStringList(purpose?.principles)
  const priorities = asStringList(purpose?.priorities)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <section>
        <div className="mb-3 flex items-center gap-3">
          <div className="h-px w-8 bg-cyan-500" />
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-300">Norte</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Propósito</h1>
        <p className="mt-2 text-muted-foreground">Sua direção central: propósito, missão, visão, valores e prioridades.</p>
      </section>

      <CreatePurposePanel />

      {!purpose ? (
        <Card className="glass-panel rounded-[24px]"><CardContent className="py-16 text-center text-muted-foreground">Nenhum propósito encontrado no Supabase.</CardContent></Card>
      ) : (
        <>
          <section className="grid gap-4 lg:grid-cols-2">
            <Card className="glass-panel rounded-[24px] lg:col-span-2">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2 text-sm font-medium"><Compass className="size-4 text-cyan-300" />Propósito</div>
                <p className="text-lg leading-relaxed">{purpose.purpose || "Ainda não definido."}</p>
              </CardContent>
            </Card>
            <Card className="glass-panel rounded-[24px]">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2 text-sm font-medium"><ScrollText className="size-4 text-violet-300" />Missão</div>
                <p className="text-sm text-muted-foreground">{purpose.mission || "Ainda não definida."}</p>
              </CardContent>
            </Card>
            <Card className="glass-panel rounded-[24px]">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2 text-sm font-medium"><Mountain className="size-4 text-emerald-300" />Visão</div>
                <p className="text-sm text-muted-foreground">{purpose.vision || "Ainda não definida."}</p>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <ListBlock icon={Gem} title="Valores" items={values} />
            <ListBlock icon={Lightbulb} title="Princípios" items={principles} />
            <ListBlock icon={Compass} title="Prioridades" items={priorities} />
          </section>
        </>
      )}
    </div>
  )
}
