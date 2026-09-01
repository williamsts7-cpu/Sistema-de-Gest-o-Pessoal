import type { SupabaseClient } from "@supabase/supabase-js"
import { buildTodaySummary, type TodayEvent, type TodayGoal, type TodayRoutine, type TodaySummary, type TodayTask } from "./today-summary.logic"

export type TodayOverview = TodaySummary & {
  today: string
  setupRequired: boolean
  report: string
}

type RoutineSchedule = {
  routine_id: string
  frequency: "daily" | "weekly" | "monthly" | "custom" | string
  days_of_week: number[] | null
  day_of_month: number | null
  start_date: string | null
  end_date: string | null
  active: boolean
}

function toDateOnly(date: Date, timeZone = "America/Sao_Paulo") {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date)
}

function timeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  const localAsUtc = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(values.hour), Number(values.minute), Number(values.second))
  return localAsUtc - date.getTime()
}

function localDateToUtcIso(dateOnly: string, timeZone: string) {
  const [year, month, day] = dateOnly.split("-").map(Number)
  const utcGuess = new Date(Date.UTC(year, month - 1, day, 12))
  const offset = timeZoneOffsetMs(utcGuess, timeZone)
  return new Date(Date.UTC(year, month - 1, day) - offset).toISOString()
}

export function getLocalDayBoundsIso(today: string, timeZone = "America/Sao_Paulo") {
  const [year, month, day] = today.split("-").map(Number)
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1))
  const next = toDateOnly(nextDay, "UTC")

  return {
    start: localDateToUtcIso(today, timeZone),
    next: localDateToUtcIso(next, timeZone),
  }
}

function isMissingSchemaError(error: unknown) {
  if (!error || typeof error !== "object") return false
  const candidate = error as { code?: string; message?: string }
  return candidate.code === "42P01" || candidate.message?.toLowerCase().includes("does not exist") || false
}

function emptyOverview(today: string, setupRequired = false): TodayOverview {
  const summary = buildTodaySummary({ today, tasks: [], events: [], goals: [], routines: [] })
  return { ...summary, today, setupRequired, report: "Seu sistema ainda não tem dados suficientes para gerar um resumo operacional do dia." }
}

async function safeSelect<T>(query: PromiseLike<{ data: T[] | null; error: unknown }>) {
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

function composeReport(summary: TodaySummary) {
  const parts = [
    `Hoje você tem ${summary.stats.openTasksToday} tarefa(s) aberta(s) para o dia`,
    `${summary.stats.eventsToday} compromisso(s)`,
    `${summary.stats.routinesDueToday} rotina(s) agendada(s)`,
    `${summary.stats.goalsNeedingAttention} meta(s) em atenção`,
  ]
  if (summary.stats.overdueTasks > 0) parts.push(`${summary.stats.overdueTasks} tarefa(s) atrasada(s)`)
  return `${parts.join(", ")}.`
}

function isScheduleDueToday(schedule: RoutineSchedule, today: string) {
  if (!schedule.active) return false
  if (schedule.start_date && schedule.start_date > today) return false
  if (schedule.end_date && schedule.end_date < today) return false

  const date = new Date(`${today}T12:00:00Z`)
  const weekday = date.getUTCDay()
  const dayOfMonth = date.getUTCDate()

  if (schedule.frequency === "daily") return true
  if (schedule.frequency === "weekly") return (schedule.days_of_week ?? []).includes(weekday)
  if (schedule.frequency === "monthly") return schedule.day_of_month === dayOfMonth
  if (schedule.frequency === "custom") return (schedule.days_of_week ?? []).includes(weekday)

  return false
}

export async function getTodayOverview(client: SupabaseClient, date = new Date(), timeZone = "America/Sao_Paulo"): Promise<TodayOverview> {
  const today = toDateOnly(date, timeZone)

  try {
    const { data: { user }, error: authError } = await client.auth.getUser()
    if (authError || !user) return emptyOverview(today)

    const { start, next } = getLocalDayBoundsIso(today, timeZone)

    const [tasks, events, goals, routines, routineSchedules] = await Promise.all([
      safeSelect<TodayTask>(
        client
          .from("tasks")
          .select("id,title,status,due_at,scheduled_at,priority")
          .eq("user_id", user.id)
          .is("archived_at", null)
          .or(`due_at.lt.${next},scheduled_at.lt.${next}`)
          .order("due_at", { ascending: true })
      ),
      safeSelect<TodayEvent>(
        client
          .from("calendar_events")
          .select("id,title,start_at,end_at")
          .eq("user_id", user.id)
          .gte("start_at", start)
          .lt("start_at", next)
          .order("start_at", { ascending: true })
      ),
      safeSelect<TodayGoal>(
        client
          .from("goals")
          .select("id,title,progress,due_date,status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .is("archived_at", null)
          .order("due_date", { ascending: true })
      ),
      safeSelect<Omit<TodayRoutine, "scheduled_today" | "completed_today" | "completion_tracked">>(
        client
          .from("routines")
          .select("id,title,status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .is("archived_at", null)
          .order("created_at", { ascending: true })
      ),
      safeSelect<RoutineSchedule>(
        client
          .from("routine_schedules")
          .select("routine_id,frequency,days_of_week,day_of_month,start_date,end_date,active")
          .eq("user_id", user.id)
          .eq("active", true)
      ),
    ])

    const dueRoutineIds = new Set(routineSchedules.filter((schedule) => isScheduleDueToday(schedule, today)).map((schedule) => schedule.routine_id))
    const routinesWithSchedule = routines.map((routine) => ({
      ...routine,
      scheduled_today: dueRoutineIds.has(routine.id),
      completion_tracked: false,
      completed_today: false,
    }))
    const summary = buildTodaySummary({ today, timeZone, tasks, events, goals, routines: routinesWithSchedule })

    return { ...summary, today, setupRequired: false, report: composeReport(summary) }
  } catch (error) {
    if (isMissingSchemaError(error)) return emptyOverview(today, true)
    throw error
  }
}
