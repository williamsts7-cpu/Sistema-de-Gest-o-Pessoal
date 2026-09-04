import type { SupabaseClient } from "@supabase/supabase-js"
import type { Goal, Habit, Json, Process, Project, Purpose, Routine, Task } from "@/types/database"
import { GOAL_COLUMNS, HABIT_COLUMNS, PROCESS_COLUMNS, PROJECT_COLUMNS, PURPOSE_COLUMNS, ROUTINE_COLUMNS, TASK_COLUMNS } from "@/services/pos-lists.service"
import { serviceError } from "@/services/errors"

export type GoalCreateInput = Partial<Pick<Goal, "area_id" | "description" | "due_date" | "initial_value" | "metric_name" | "metric_unit" | "motivation" | "priority" | "progress" | "success_criteria" | "current_value" | "target_value">> & {
  title: string
}

export type ProjectCreateInput = Partial<Pick<Project, "area_id" | "description" | "due_date" | "goal_id" | "notes" | "priority" | "progress">> & {
  title: string
}

export type HabitCreateInput = Partial<Pick<Habit, "area_id" | "description" | "days_of_week" | "goal_id" | "target_count">> & {
  title: string
  frequency?: string
}

export type TaskCreateInput = Partial<Pick<Task, "area_id" | "description" | "due_at" | "estimated_minutes" | "goal_id" | "priority" | "project_id">> & {
  title: string
}

export type RoutineCreateInput = Partial<Pick<Routine, "area_id" | "description" | "estimated_minutes" | "goal_id" | "notes" | "priority">> & {
  title: string
  schedule?: {
    frequency?: string
    days_of_week?: number[] | null
    day_of_month?: number | null
    time_of_day?: string | null
    duration_minutes?: number | null
  }
}

export type ProcessCreateInput = Partial<Pick<Process, "area_id" | "description" | "instructions">> & {
  title: string
}

export type PurposeCreateInput = Partial<Pick<Purpose, "identity_statement" | "long_term_vision" | "mission" | "notes" | "principles" | "priorities" | "purpose" | "values" | "vision">>

function isMissingAuthSession(error: unknown) {
  if (!error || typeof error !== "object") return false
  const { name, message } = error as { name?: unknown; message?: unknown }
  return name === "AuthSessionMissingError" || String(message || "").includes("Auth session missing")
}

async function getUserId(client: SupabaseClient) {
  const { data: { user }, error } = await client.auth.getUser()
  if (error || !user) {
    if (isMissingAuthSession(error)) serviceError("Sua sessao expirou. Entre novamente.", error)
    serviceError("Nao foi possivel validar sua sessao.", error)
  }
  return user.id
}

function cleanText(value: string | null | undefined) {
  const trimmed = String(value ?? "").trim()
  return trimmed || null
}

function requiredTitle(value: string, label: string) {
  const title = cleanText(value)
  if (!title) serviceError(`Informe o nome de ${label}.`, null)
  return title
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, Math.round(value * 100) / 100))
}

export function calculateGoalProgress(initialValue: number | null | undefined, currentValue: number | null | undefined, targetValue: number | null | undefined) {
  if (typeof initialValue !== "number" || typeof currentValue !== "number" || typeof targetValue !== "number") return null
  if (!Number.isFinite(initialValue) || !Number.isFinite(currentValue) || !Number.isFinite(targetValue)) return null
  const range = targetValue - initialValue
  if (range === 0) return currentValue >= targetValue ? 100 : 0
  return clampProgress(((currentValue - initialValue) / range) * 100)
}

async function insertOne<T>(client: SupabaseClient, table: string, payload: Record<string, unknown>, columns: string, message: string) {
  const { data, error } = await client.from(table).insert(payload).select(columns).single()
  if (error) serviceError(message, error)
  return data as T
}

async function upsertOne<T>(client: SupabaseClient, table: string, payload: Record<string, unknown>, columns: string, message: string) {
  const { data, error } = await client.from(table).upsert(payload, { onConflict: "user_id" }).select(columns).single()
  if (error) serviceError(message, error)
  return data as T
}

export async function createGoal(client: SupabaseClient, input: GoalCreateInput) {
  const userId = await getUserId(client)
  const progress = input.progress ?? calculateGoalProgress(input.initial_value, input.current_value, input.target_value) ?? 0
  const metadata: Record<string, Json> = {
    smart: {
      specific: Boolean(cleanText(input.title) && cleanText(input.description)),
      measurable: Boolean(cleanText(input.metric_name) && typeof input.target_value === "number"),
      achievable: Boolean(cleanText(input.motivation)),
      relevant: Boolean(cleanText(input.success_criteria)),
      time_bound: Boolean(input.due_date),
    },
  }

  return insertOne<Goal>(client, "goals", {
    user_id: userId,
    area_id: input.area_id ?? null,
    title: requiredTitle(input.title, "sua meta"),
    description: cleanText(input.description),
    status: "active",
    priority: input.priority ?? "medium",
    due_date: input.due_date ?? null,
    progress: clampProgress(progress),
    metric_name: cleanText(input.metric_name),
    metric_unit: cleanText(input.metric_unit),
    initial_value: input.initial_value ?? 0,
    current_value: input.current_value ?? 0,
    target_value: input.target_value ?? null,
    motivation: cleanText(input.motivation),
    success_criteria: cleanText(input.success_criteria),
    metadata,
  }, GOAL_COLUMNS, "Nao foi possivel criar sua meta.")
}

export async function createProject(client: SupabaseClient, input: ProjectCreateInput) {
  const userId = await getUserId(client)
  return insertOne<Project>(client, "projects", {
    user_id: userId,
    area_id: input.area_id ?? null,
    goal_id: input.goal_id ?? null,
    title: requiredTitle(input.title, "seu projeto"),
    description: cleanText(input.description),
    status: "active",
    priority: input.priority ?? "medium",
    due_date: input.due_date ?? null,
    progress: clampProgress(input.progress ?? 0),
    notes: cleanText(input.notes),
  }, PROJECT_COLUMNS, "Nao foi possivel criar seu projeto.")
}

export async function createHabit(client: SupabaseClient, input: HabitCreateInput) {
  const userId = await getUserId(client)
  return insertOne<Habit>(client, "habits", {
    user_id: userId,
    area_id: input.area_id ?? null,
    goal_id: input.goal_id ?? null,
    title: requiredTitle(input.title, "seu habito"),
    description: cleanText(input.description),
    status: "active",
    frequency: input.frequency ?? "daily",
    days_of_week: input.days_of_week?.length ? input.days_of_week : null,
    target_count: input.target_count ?? 1,
  }, HABIT_COLUMNS, "Nao foi possivel criar seu habito.")
}

export async function createTask(client: SupabaseClient, input: TaskCreateInput) {
  const userId = await getUserId(client)
  return insertOne<Task>(client, "tasks", {
    user_id: userId,
    area_id: input.area_id ?? null,
    goal_id: input.goal_id ?? null,
    project_id: input.project_id ?? null,
    title: requiredTitle(input.title, "sua tarefa"),
    description: cleanText(input.description),
    status: "next",
    priority: input.priority ?? "medium",
    due_at: input.due_at ?? null,
    estimated_minutes: input.estimated_minutes ?? null,
  }, TASK_COLUMNS, "Nao foi possivel criar sua tarefa.")
}

export async function createRoutine(client: SupabaseClient, input: RoutineCreateInput) {
  const userId = await getUserId(client)
  const routine = await insertOne<Routine>(client, "routines", {
    user_id: userId,
    area_id: input.area_id ?? null,
    goal_id: input.goal_id ?? null,
    title: requiredTitle(input.title, "sua rotina"),
    description: cleanText(input.description),
    status: "active",
    priority: input.priority ?? "medium",
    estimated_minutes: input.estimated_minutes ?? null,
    checklist: [],
    notes: cleanText(input.notes),
  }, ROUTINE_COLUMNS, "Nao foi possivel criar sua rotina.")

  if (input.schedule) {
    const { error } = await client.from("routine_schedules").insert({
      user_id: userId,
      routine_id: routine.id,
      frequency: input.schedule.frequency ?? "daily",
      days_of_week: input.schedule.days_of_week?.length ? input.schedule.days_of_week : null,
      day_of_month: input.schedule.day_of_month ?? null,
      time_of_day: input.schedule.time_of_day ?? null,
      duration_minutes: input.schedule.duration_minutes ?? input.estimated_minutes ?? null,
      active: true,
    })
    if (error) serviceError("A rotina foi criada, mas a agenda dela nao foi salva.", error)
  }

  return routine
}

export async function createProcess(client: SupabaseClient, input: ProcessCreateInput) {
  const userId = await getUserId(client)
  return insertOne<Process>(client, "processes", {
    user_id: userId,
    area_id: input.area_id ?? null,
    title: requiredTitle(input.title, "seu processo"),
    description: cleanText(input.description),
    instructions: cleanText(input.instructions),
    status: "active",
    is_template: false,
    metadata: {},
  }, PROCESS_COLUMNS, "Nao foi possivel criar seu processo.")
}

export async function createPurpose(client: SupabaseClient, input: PurposeCreateInput) {
  const userId = await getUserId(client)
  return upsertOne<Purpose>(client, "purposes", {
    user_id: userId,
    purpose: cleanText(input.purpose),
    mission: cleanText(input.mission),
    vision: cleanText(input.vision),
    identity_statement: cleanText(input.identity_statement),
    long_term_vision: cleanText(input.long_term_vision),
    values: input.values ?? [],
    principles: input.principles ?? [],
    priorities: input.priorities ?? [],
    notes: cleanText(input.notes),
  }, PURPOSE_COLUMNS, "Nao foi possivel salvar seu proposito.")
}
