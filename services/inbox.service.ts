import type { SupabaseClient } from "@supabase/supabase-js"
import { serviceError } from "@/services/errors"

export type CaptureKind = "inbox" | "task" | "habit" | "project" | "goal"

export type CaptureInput = {
  kind: CaptureKind
  content: string
}

export type CaptureResult = {
  kind: CaptureKind
  targetPath: string
}

const captureConfig = {
  inbox: {
    table: "inbox_items",
    targetPath: "/inbox",
    errorMessage: "Nao foi possivel salvar no Inbox.",
    buildPayload: (userId: string, content: string) => ({
      user_id: userId,
      content,
      source: "manual",
      status: "unprocessed",
      metadata: { source: "quick_capture", capture_kind: "inbox" },
    }),
  },
  task: {
    table: "tasks",
    targetPath: "/tasks",
    errorMessage: "Nao foi possivel criar a tarefa.",
    buildPayload: (userId: string, content: string) => ({
      user_id: userId,
      title: content,
      status: "next",
      priority: "medium",
      position: 0,
      is_favorite: false,
      metadata: { source: "quick_capture", capture_kind: "task" },
    }),
  },
  habit: {
    table: "habits",
    targetPath: "/habits",
    errorMessage: "Nao foi possivel criar o habito.",
    buildPayload: (userId: string, content: string) => ({
      user_id: userId,
      title: content,
      status: "active",
      frequency: "daily",
      target_count: 1,
      metadata: { source: "quick_capture", capture_kind: "habit" },
    }),
  },
  project: {
    table: "projects",
    targetPath: "/projects",
    errorMessage: "Nao foi possivel criar o projeto.",
    buildPayload: (userId: string, content: string) => ({
      user_id: userId,
      title: content,
      status: "active",
      priority: "medium",
      progress: 0,
      metadata: { source: "quick_capture", capture_kind: "project" },
    }),
  },
  goal: {
    table: "goals",
    targetPath: "/goals",
    errorMessage: "Nao foi possivel criar a meta.",
    buildPayload: (userId: string, content: string) => ({
      user_id: userId,
      title: content,
      status: "active",
      priority: "medium",
      progress: 0,
      metadata: { source: "quick_capture", capture_kind: "goal" },
    }),
  },
} satisfies Record<CaptureKind, {
  table: string
  targetPath: string
  errorMessage: string
  buildPayload: (userId: string, content: string) => Record<string, unknown>
}>

export const captureKinds = Object.keys(captureConfig) as CaptureKind[]

export function isCaptureKind(value: unknown): value is CaptureKind {
  return typeof value === "string" && value in captureConfig
}

export async function captureQuickItem(client: SupabaseClient, input: CaptureInput): Promise<CaptureResult> {
  const content = input.content.trim()
  if (!content) serviceError("Digite algo para capturar.", null)
  if (!isCaptureKind(input.kind)) serviceError("Tipo de captura invalido.", null)

  const { data: { user }, error: authError } = await client.auth.getUser()
  if (authError || !user) serviceError("Sua sessao expirou. Entre novamente.", authError)

  const config = captureConfig[input.kind]
  const userId = user.id
  let error: unknown = null

  if (input.kind === "inbox") {
    ;({ error } = await client.from("inbox_items").insert({
      user_id: userId,
      content,
      source: "manual",
      status: "unprocessed",
      metadata: { source: "quick_capture", capture_kind: "inbox" },
    }))
  } else if (input.kind === "task") {
    ;({ error } = await client.from("tasks").insert({
      user_id: userId,
      title: content,
      status: "next",
      priority: "medium",
      position: 0,
      is_favorite: false,
      metadata: { source: "quick_capture", capture_kind: "task" },
    }))
  } else if (input.kind === "habit") {
    ;({ error } = await client.from("habits").insert({
      user_id: userId,
      title: content,
      status: "active",
      frequency: "daily",
      target_count: 1,
      metadata: { source: "quick_capture", capture_kind: "habit" },
    }))
  } else if (input.kind === "project") {
    ;({ error } = await client.from("projects").insert({
      user_id: userId,
      title: content,
      status: "active",
      priority: "medium",
      progress: 0,
      metadata: { source: "quick_capture", capture_kind: "project" },
    }))
  } else {
    ;({ error } = await client.from("goals").insert({
      user_id: userId,
      title: content,
      status: "active",
      priority: "medium",
      progress: 0,
      metadata: { source: "quick_capture", capture_kind: "goal" },
    }))
  }

  if (error) serviceError(config.errorMessage, error)

  return { kind: input.kind, targetPath: config.targetPath }
}

export async function captureInboxItem(client: SupabaseClient, content: string) {
  await captureQuickItem(client, { kind: "inbox", content })
}
