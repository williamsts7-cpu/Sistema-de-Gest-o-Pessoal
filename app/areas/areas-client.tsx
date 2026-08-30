"use client"
import { useActionState, useState } from "react"
import { Archive, Pencil, Plus } from "lucide-react"
import type { Area } from "@/types/database"
import { archiveAreaAction, createAreaAction, updateAreaAction, type AreaActionState } from "@/app/areas/actions"
import { useI18n } from "@/components/i18n-provider"
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
  const { t } = useI18n()
  async function edit(formData: FormData) { if (editing) { await updateAreaAction(editing.id, formData); setEditing(null) } }
  const fields = (area?: Area) => <><div><Label htmlFor={area ? "edit-name" : "name"}>{t("areas.name")}</Label><Input id={area ? "edit-name" : "name"} name="name" defaultValue={area?.name} required /></div><div><Label htmlFor={area ? "edit-description" : "description"}>{t("areas.description")}</Label><Textarea id={area ? "edit-description" : "description"} name="description" defaultValue={area?.description ?? ""} /></div></>
  return <><div className="flex items-center justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight">{t("nav.areas")}</h1><p className="text-muted-foreground">{t("areas.subtitle")}</p></div><Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button />}><Plus className="mr-2 size-4" />{t("areas.new")}</DialogTrigger><DialogContent><DialogHeader><DialogTitle>{t("areas.new")}</DialogTitle></DialogHeader><form action={createAction} className="space-y-4">{fields()}{state.error && <p className="text-sm text-red-300">{t("areas.subtitle")}</p>}<DialogFooter><Button type="submit" disabled={pending}>{pending ? t("common.saving") : t("common.save")}</Button></DialogFooter></form></DialogContent></Dialog></div>{areas.length === 0 ? <Card className="glass-panel rounded-[24px]"><CardContent className="py-16 text-center text-muted-foreground">{t("areas.empty")}</CardContent></Card> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{areas.map(area => <Card key={area.id} className="glass-panel rounded-[24px]"><CardContent className="flex min-h-40 flex-col justify-between p-5"><div><h2 className="text-lg font-semibold">{area.name}</h2><p className="mt-2 text-sm text-muted-foreground">{area.description || t("areas.noDescription")}</p></div><div className="mt-4 flex justify-end gap-2"><Button size="icon-sm" variant="ghost" aria-label={t("common.edit")} onClick={() => setEditing(area)}><Pencil /></Button><Button size="icon-sm" variant="ghost" aria-label={t("common.archive")} onClick={() => archiveAreaAction(area.id)}><Archive /></Button></div></CardContent></Card>)}</div>}<Dialog open={Boolean(editing)} onOpenChange={value => !value && setEditing(null)}><DialogContent><DialogHeader><DialogTitle>{t("areas.edit")}</DialogTitle></DialogHeader>{editing && <form action={edit} className="space-y-4">{fields(editing)}<DialogFooter><Button type="submit">{t("areas.saveChanges")}</Button></DialogFooter></form>}</DialogContent></Dialog></>
}
