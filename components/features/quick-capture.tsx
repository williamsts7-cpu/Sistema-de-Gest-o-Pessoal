"use client"

import * as React from "react"
import { useActionState } from "react"
import { Plus } from "lucide-react"
import { captureAction, type CaptureState } from "@/app/inbox/actions"
import type { CaptureKind } from "@/services/inbox.service"
import { useI18n } from "@/components/i18n-provider"
import type { TranslationKey } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const initialState: CaptureState = { error: null, success: false, kind: null, message: null }

const captureOptions: { kind: CaptureKind; labelKey: TranslationKey }[] = [
  { kind: "task", labelKey: "capture.kind.task" },
  { kind: "habit", labelKey: "capture.kind.habit" },
  { kind: "project", labelKey: "capture.kind.project" },
  { kind: "goal", labelKey: "capture.kind.goal" },
  { kind: "inbox", labelKey: "capture.kind.inbox" },
]

export function QuickCapture() {
  const [open, setOpen] = React.useState(false)
  const [content, setContent] = React.useState("")
  const [kind, setKind] = React.useState<CaptureKind>("task")
  const [state, action, pending] = useActionState(captureAction, initialState)
  const { locale, t } = useI18n()

  React.useEffect(() => {
    if (!state.success) return

    const timeoutId = window.setTimeout(() => {
      setContent("")
      setOpen(false)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [state.success])

  const errorMessage = state.error && (locale === "en" ? "We could not save this item." : state.error)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="default" size="sm" className="hidden h-8 border-transparent bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.3)] md:flex" />}>
        <Plus className="mr-2 size-4" />
        {t("capture.button")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>{t("capture.title")}</DialogTitle>
          <DialogDescription>{t("capture.description")}</DialogDescription>
        </DialogHeader>
        <form action={action}>
          <div className="grid gap-4 py-4">
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">{t("capture.kind")}</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {captureOptions.map((option) => (
                  <label
                    key={option.kind}
                    className={cn(
                      "cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-sm transition hover:bg-white/[0.06]",
                      kind === option.kind && "border-fuchsia-400/60 bg-fuchsia-500/15 text-fuchsia-100"
                    )}
                  >
                    <input
                      type="radio"
                      name="kind"
                      value={option.kind}
                      checked={kind === option.kind}
                      onChange={() => setKind(option.kind)}
                      className="sr-only"
                    />
                    {t(option.labelKey)}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="space-y-2">
              <Label htmlFor="quick-capture-content">{t("capture.content")}</Label>
              <Textarea
                id="quick-capture-content"
                name="content"
                placeholder={t("capture.placeholder")}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="min-h-[110px]"
                autoFocus
              />
            </div>

            {errorMessage && <p role="alert" className="text-sm text-red-300">{errorMessage}</p>}
            {state.success && state.message && <p className="text-sm text-emerald-300">{locale === "en" ? t("capture.success") : state.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button type="submit" disabled={pending || !content.trim()}>{pending ? t("common.saving") : t("common.save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
