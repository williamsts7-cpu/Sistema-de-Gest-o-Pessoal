"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createGoal, createHabit, createProcess, createProject, createPurpose, createRoutine, createTask } from "@/services/pos-create.service"

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim()
  return value || null
}

function numberValue(formData: FormData, key: string) {
  const raw = text(formData, key)
  if (!raw) return null
  const normalized = raw.replace(",", ".")
  const value = Number(normalized)
  return Number.isFinite(value) ? value : null
}

function intValue(formData: FormData, key: string) {
  const value = numberValue(formData, key)
  return typeof value === "number" ? Math.round(value) : null
}

function datetimeValue(formData: FormData, key: string) {
  const raw = text(formData, key)
  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function optionalId(formData: FormData, key: string) {
  const value = text(formData, key)
  return value === "none" ? null : value
}

function weekdays(formData: FormData) {
  return formData
    .getAll("days_of_week")
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 0 && value <= 6)
}

function lines(formData: FormData, key: string) {
  const value = text(formData, key)
  return value ? value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) : []
}

function revalidate(paths: string[]) {
  for (const path of paths) revalidatePath(path)
  revalidatePath("/dashboard")
  revalidatePath("/today")
}

export async function createTaskAction(formData: FormData) {
  await createTask(await createClient(), {
    title: String(formData.get("title") ?? ""),
    description: text(formData, "description"),
    area_id: optionalId(formData, "area_id"),
    goal_id: optionalId(formData, "goal_id"),
    project_id: optionalId(formData, "project_id"),
    priority: text(formData, "priority") ?? "medium",
    due_at: datetimeValue(formData, "due_at"),
    estimated_minutes: intValue(formData, "estimated_minutes"),
  })
  revalidate(["/tasks"])
  redirect("/tasks")
}

export async function createGoalAction(formData: FormData) {
  await createGoal(await createClient(), {
    title: String(formData.get("title") ?? ""),
    description: text(formData, "description"),
    area_id: optionalId(formData, "area_id"),
    priority: text(formData, "priority") ?? "medium",
    due_date: text(formData, "due_date"),
    metric_name: text(formData, "metric_name"),
    metric_unit: text(formData, "metric_unit"),
    initial_value: numberValue(formData, "initial_value") ?? 0,
    current_value: numberValue(formData, "current_value") ?? 0,
    target_value: numberValue(formData, "target_value"),
    progress: numberValue(formData, "progress") ?? undefined,
    motivation: text(formData, "motivation"),
    success_criteria: text(formData, "success_criteria"),
  })
  revalidate(["/goals"])
  redirect("/goals")
}

export async function createProjectAction(formData: FormData) {
  await createProject(await createClient(), {
    title: String(formData.get("title") ?? ""),
    description: text(formData, "description"),
    area_id: optionalId(formData, "area_id"),
    goal_id: optionalId(formData, "goal_id"),
    priority: text(formData, "priority") ?? "medium",
    due_date: text(formData, "due_date"),
    progress: numberValue(formData, "progress") ?? 0,
    notes: text(formData, "notes"),
  })
  revalidate(["/projects"])
  redirect("/projects")
}

export async function createHabitAction(formData: FormData) {
  await createHabit(await createClient(), {
    title: String(formData.get("title") ?? ""),
    description: text(formData, "description"),
    area_id: optionalId(formData, "area_id"),
    goal_id: optionalId(formData, "goal_id"),
    frequency: text(formData, "frequency") ?? "daily",
    days_of_week: weekdays(formData),
    target_count: intValue(formData, "target_count") ?? 1,
  })
  revalidate(["/habits"])
  redirect("/habits")
}

export async function createRoutineAction(formData: FormData) {
  const estimatedMinutes = intValue(formData, "estimated_minutes")
  await createRoutine(await createClient(), {
    title: String(formData.get("title") ?? ""),
    description: text(formData, "description"),
    area_id: optionalId(formData, "area_id"),
    goal_id: optionalId(formData, "goal_id"),
    priority: text(formData, "priority") ?? "medium",
    estimated_minutes: estimatedMinutes,
    notes: text(formData, "notes"),
    schedule: {
      frequency: text(formData, "frequency") ?? "daily",
      days_of_week: weekdays(formData),
      day_of_month: intValue(formData, "day_of_month"),
      time_of_day: text(formData, "time_of_day"),
      duration_minutes: estimatedMinutes,
    },
  })
  revalidate(["/routines"])
  redirect("/routines")
}

export async function createProcessAction(formData: FormData) {
  await createProcess(await createClient(), {
    title: String(formData.get("title") ?? ""),
    description: text(formData, "description"),
    area_id: optionalId(formData, "area_id"),
    instructions: text(formData, "instructions"),
  })
  revalidate(["/processes"])
  redirect("/processes")
}

export async function createPurposeAction(formData: FormData) {
  await createPurpose(await createClient(), {
    purpose: text(formData, "purpose"),
    mission: text(formData, "mission"),
    vision: text(formData, "vision"),
    identity_statement: text(formData, "identity_statement"),
    long_term_vision: text(formData, "long_term_vision"),
    values: lines(formData, "values"),
    principles: lines(formData, "principles"),
    priorities: lines(formData, "priorities"),
    notes: text(formData, "notes"),
  })
  revalidate(["/purpose"])
  redirect("/purpose")
}
