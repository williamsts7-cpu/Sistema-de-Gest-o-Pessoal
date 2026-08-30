"use client"
import { useActionState, useState } from "react"
import { Archive, Pencil, Plus } from "lucide-react"
import type { Area } from "@/types/database"
import { archiveAreaAction, createAreaAction, updateAreaAction, type AreaActionState } from "@/app/areas/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
const initialState: AreaActionState = { error: null, success: false }
export function AreasClient({ areas }: { areas: Area[] }) {
  const [open, setOpen] = useState(false), [editing, setEditing] = useState<Area | null>(null)
  const [state, createAction, pending] = useActionState(createAreaAction, initialState)
  async function edit(formData: FormData) { if (editing) { await updateAreaAction(editing.id, formData); setEditing(null) } }
  return <><div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold tracking-tight">Areas</h1><p className="text-muted-foreground">Organize as dimensoes importantes da sua vida.</p></div><Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button />}><Plus className="mr-2 size-4" />Nova area</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Nova area</DialogTitle></DialogHeader><form action={createAction} className="space-y-4"><div><Label htmlFor="name">Nome</Label><Input id="name" name="name" required /></div><div><Label htmlFor="description">Descricao</Label><Textarea id="description" name="description" /></div>{state.error && <p className="text-sm text-red-300">{state.error}</p>}<DialogFooter><Button disabled={pending}>{pending ? "Salvando..." : "Salvar"}</Button></DialogFooter></form></DialogContent></Dialog></div>{areas.length === 0 ? <Card className="rounded-[24px] border-white/10 bg-white/5"><CardContent className="py-16 text-center text-muted-foreground">Nenhuma area criada ainda.</CardContent></Card> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{areas.map(area => <Card key={area.id} className="rounded-[24px] border-white/10 bg-white/5 backdrop-blur-xl"><CardContent className="flex min-h-40 flex-col justify-between p-5"><div><h2 className="text-lg font-semibold">{area.name}</h2><p className="mt-2 text-sm text-muted-foreground">{area.description || "Sem descricao"}</p></div><div className="mt-4 flex justify-end gap-2"><Button size="icon-sm" variant="ghost" aria-label="Editar" onClick={() => setEditing(area)}><Pencil /></Button><Button size="icon-sm" variant="ghost" aria-label="Arquivar" onClick={() => archiveAreaAction(area.id)}><Archive /></Button></div></CardContent></Card>)}</div>}<Dialog open={Boolean(editing)} onOpenChange={value => !value && setEditing(null)}><DialogContent><DialogHeader><DialogTitle>Editar area</DialogTitle></DialogHeader>{editing && <form action={edit} className="space-y-4"><div><Label htmlFor="edit-name">Nome</Label><Input id="edit-name" name="name" defaultValue={editing.name} required /></div><div><Label htmlFor="edit-description">Descricao</Label><Textarea id="edit-description" name="description" defaultValue={editing.description ?? ""} /></div><DialogFooter><Button>Salvar alteracoes</Button></DialogFooter></form>}</DialogContent></Dialog></>
}
