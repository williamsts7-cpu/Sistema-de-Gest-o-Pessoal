"use client"
import * as React from "react"
import { useActionState } from "react"
import { Plus } from "lucide-react"
import { captureAction, type CaptureState } from "@/app/inbox/actions"
import { useI18n } from "@/components/i18n-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
const initialState: CaptureState = { error: null, success: false }
export function QuickCapture() {
  const [open, setOpen] = React.useState(false), [content, setContent] = React.useState("")
  const [state, action, pending] = useActionState(captureAction, initialState)
  const { locale, t } = useI18n()
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button variant="default" size="sm" className="hidden h-8 border-transparent bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.3)] md:flex" />}><Plus className="mr-2 size-4" />{t("capture.button")}</DialogTrigger><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>{t("capture.title")}</DialogTitle><DialogDescription>{t("capture.description")}</DialogDescription></DialogHeader><form action={action}><div className="grid gap-4 py-4"><Label htmlFor="content" className="sr-only">{t("capture.content")}</Label><Textarea id="content" name="content" placeholder={t("capture.placeholder")} value={content} onChange={event => setContent(event.target.value)} className="min-h-[100px]" autoFocus />{state.error && <p role="alert" className="text-sm text-red-300">{locale === "en" ? "We could not save this item." : state.error}</p>}</div><DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button><Button type="submit" disabled={pending}>{pending ? t("common.saving") : t("common.save")}</Button></DialogFooter></form></DialogContent></Dialog>
}
