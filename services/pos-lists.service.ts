import type { SupabaseClient } from "@supabase/supabase-js"
import type { CalendarEvent, Goal, Habit, Project, Routine, RoutineSchedule, RoutineWithSchedules, Task } from "@/types/database"
import { serviceError } from "@/services/errors"

const TASK_COLUMNS = "id,user_id,parent_task_id,area_id,goal_id,project_id,process_id,process_step_id,title,description,status,priority,context,energy_level,estimated_minutes,actual_minutes,scheduled_at,due_at,started_at,completed_at,position,is_favorite,notes,metadata,created_at,updated_at,archived_at"
const GOAL_COLUMNS = "id,user_id,area_id,title,description,status,priority,start_date,due_date,completed_at,progress,metric_name,metric_unit,initial_value,current_value,target_value,motivation,success_criteria,notes,metadata,created_at,updated_at,archived_at"
const PROJECT_COLUMNS = "id,user_id,area_id,goal_id,title,description,status,priority,start_date,due_date,completed_at,progress,notes,metadata,created_at,updated_at,archived_at"
const HABIT_COLUMNS = "id,user_id,area_id,goal_id,title,description,status,frequency,days_of_week,target_count,metadata,created_at,updated_at,archived_at"
const ROUTINE_COLUMNS = "id,user_id,area_id,goal_id,title,description,status,priority,estimated_minutes,checklist,notes,metadata,created_at,updated_at,archived_at"
const ROUTINE_SCHEDULE_COLUMNS = "id,user_id,routine_id,frequency,days_of_week,day_of_month,time_of_day,duration_minutes,recurrence_rule,start_date,end_date,active,created_at,updated_at"
const CALENDAR_EVENT_COLUMNS = "id,user_id,area_id,task_id,project_id,routine_id,title,description,start_at,end_at,all_day,location,event_type,external_provider,external_id,metadata,created_at,updated_at"

function isMissingAuthSession(error: unknown) {
  if (!error || typeof error !== "object") return false
  const { name, message } = error as { name?: unknown; message?: unknown }
  return name === "AuthSessionMissingError" || String(message || "").includes("Auth session missing")
}

function isMissingSchemaError(error: unknown) {
  if (!error || typeof error !== "object") return false
  const candidate = error as { code?: string; message?: string }
  return candidate.code === "42P01" || String(candidate.message || "").toLowerCase().includes("does not exist")
}

async function getUserId(client: SupabaseClient) {
  const { data: { user }, error } = await client.auth.getUser()
  if (error) {
    if (isMissingAuthSession(error)) return null
    serviceError("Nao foi possivel validar sua sessao.", error)
  }
  return user?.id ?? null
}

async function safeQuery<T>(label: string, query: PromiseLike<{ data: T[] | null; error: unknown }>) {
  const { data, error } = await query
  if (error) {
    if (isMissingSchemaError(error)) return []
    serviceError(label, error)
  }
  return data ?? []
}

export async function listTasks(client: SupabaseClient): Promise<Task[]> {
  const userId = await getUserId(client)
  if (!userId) return []

  return safeQuery<Task>(
    "Nao foi possivel carregar suas tarefas.",
    client
      .from("tasks")
      .select(TASK_COLUMNS)
      .eq("user_id", userId)
      .is("archived_at", null)
      .order("position", { ascending: true })
      .order("due_at", { ascending: true })
      .limit(50)
  )
}

export async function listGoals(client: SupabaseClient): Promise<Goal[]> {
  const userId = await getUserId(client)
  if (!userId) return []

  return safeQuery<Goal>(
    "Nao foi possivel carregar suas metas.",
    client
      .from("goals")
      .select(GOAL_COLUMNS)
      .eq("user_id", userId)
      .is("archived_at", null)
      .order("due_date", { ascending: true })
      .limit(50)
  )
}

export async function listProjects(client: SupabaseClient): Promise<Project[]> {
  const userId = await getUserId(client)
  if (!userId) return []

  return safeQuery<Project>(
    "Nao foi possivel carregar seus projetos.",
    client
      .from("projects")
      .select(PROJECT_COLUMNS)
      .eq("user_id", userId)
      .is("archived_at", null)
      .order("due_date", { ascending: true })
      .limit(50)
  )
}

export async function listHabits(client: SupabaseClient): Promise<Habit[]> {
  const userId = await getUserId(client)
  if (!userId) return []

  return safeQuery<Habit>(
    "Nao foi possivel carregar seus habitos.",
    client
      .from("habits")
      .select(HABIT_COLUMNS)
      .eq("user_id", userId)
      .is("archived_at", null)
      .order("created_at", { ascending: false })
      .limit(50)
  )
}

export async function listRoutines(client: SupabaseClient): Promise<RoutineWithSchedules[]> {
  const userId = await getUserId(client)
  if (!userId) return []

  const [routines, schedules] = await Promise.all([
    safeQuery<Routine>(
      "Nao foi possivel carregar suas rotinas.",
      client
        .from("routines")
        .select(ROUTINE_COLUMNS)
        .eq("user_id", userId)
        .is("archived_at", null)
        .order("created_at", { ascending: false })
        .limit(50)
    ),
    safeQuery<RoutineSchedule>(
      "Nao foi possivel carregar a agenda das rotinas.",
      client
        .from("routine_schedules")
        .select(ROUTINE_SCHEDULE_COLUMNS)
        .eq("user_id", userId)
        .eq("active", true)
    ),
  ])

  return routines.map((routine) => ({
    ...routine,
    schedules: schedules.filter((schedule) => schedule.routine_id === routine.id),
  }))
}

export async function listCalendarEvents(client: SupabaseClient): Promise<CalendarEvent[]> {
  const userId = await getUserId(client)
  if (!userId) return []

  return safeQuery<CalendarEvent>(
    "Nao foi possivel carregar sua agenda.",
    client
      .from("calendar_events")
      .select(CALENDAR_EVENT_COLUMNS)
      .eq("user_id", userId)
      .order("start_at", { ascending: true })
      .limit(50)
  )
}
