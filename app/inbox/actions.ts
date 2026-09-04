"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { captureQuickItem, isCaptureKind, type CaptureKind } from "@/services/inbox.service"
import { ServiceError } from "@/services/errors"

export interface CaptureState {
  error: string | null
  success: boolean
  kind: CaptureKind | null
  message: string | null
}

const genericCaptureError = "Nao foi possivel salvar a captura."

export async function captureAction(_: CaptureState, formData: FormData): Promise<CaptureState> {
  const content = String(formData.get("content") ?? "").trim()
  const kindValue = String(formData.get("kind") ?? "inbox")

  if (!content) return { error: "Digite algo para capturar.", success: false, kind: null, message: null }
  if (!isCaptureKind(kindValue)) return { error: "Tipo de captura invalido.", success: false, kind: null, message: null }

  try {
    const result = await captureQuickItem(await createClient(), { kind: kindValue, content })
    revalidatePath(result.targetPath)
    revalidatePath("/dashboard")
    revalidatePath("/today")

    return {
      error: null,
      success: true,
      kind: result.kind,
      message: "Captura salva.",
    }
  } catch (error) {
    return {
      error: error instanceof ServiceError ? error.message : genericCaptureError,
      success: false,
      kind: null,
      message: null,
    }
  }
}
