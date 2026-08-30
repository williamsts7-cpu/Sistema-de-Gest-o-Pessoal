"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useActionState } from "react"
import { captureAction, type CaptureState } from "@/app/inbox/actions"

const initialState: CaptureState = { error: null, success: false }

export function QuickCapture() {
  const [open, setOpen] = React.useState(false)
  const [content, setContent] = React.useState("")
  const [state, action, pending] = useActionState(captureAction, initialState)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="default" size="sm" className="hidden md:flex h-8 border-transparent bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white hover:from-fuchsia-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-all" />}>
        <Plus className="mr-2 h-4 w-4" />
        Capturar
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Capture</DialogTitle>
          <DialogDescription>
            Adicione uma ideia, tarefa ou nota rápida ao Inbox.
          </DialogDescription>
        </DialogHeader>
        <form action={action}><div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="content" className="sr-only">
              Conteúdo
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Preparar estudo sobre Romanos 8..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
              autoFocus
            />
          </div>
          {state.error && <p role="alert" className="text-sm text-red-300">{state.error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={pending}>{pending ? "Salvando..." : "Salvar"}</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
