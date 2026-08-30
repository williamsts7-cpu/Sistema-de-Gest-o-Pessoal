"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { captureInboxItem } from "@/services/inbox.service"
export interface CaptureState { error: string | null; success: boolean }
export async function captureAction(_: CaptureState, formData: FormData): Promise<CaptureState> {
  const content = String(formData.get("content") ?? "").trim()
  if (!content) return { error: "Digite algo para capturar.", success: false }
  try { await captureInboxItem(await createClient(), content); revalidatePath("/inbox"); return { error: null, success: true } }
  catch { return { error: "Nao foi possivel salvar no Inbox.", success: false } }
}
