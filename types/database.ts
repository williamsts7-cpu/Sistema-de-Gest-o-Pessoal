export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  timezone: string | null
  locale: string | null
  theme: string | null
  settings: Json | null
}

export interface Purpose {
  id: string
  user_id: string
  purpose: string | null
  mission: string | null
  vision: string | null
  identity_statement: string | null
  long_term_vision: string | null
  values: Json | null
  principles: Json | null
  priorities: Json | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Area {
  id: string
  user_id: string
  parent_id: string | null
  name: string
  slug: string | null
  description: string | null
  icon: string | null
  color: string | null
  position: number
  status: string
  metadata: Json | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

export interface Goal {
  id: string
  user_id: string
  area_id: string | null
  title: string
  description: string | null
  status: string
  priority: string
  start_date: string | null
  due_date: string | null
  completed_at: string | null
  progress: number
  metric_name: string | null
  metric_unit: string | null
  initial_value: number | null
  current_value: number | null
  target_value: number | null
  motivation: string | null
  success_criteria: string | null
  notes: string | null
  metadata: Json | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

export interface Project {
  id: string
  user_id: string
  area_id: string | null
  goal_id: string | null
  title: string
  description: string | null
  status: string
  priority: string
  start_date: string | null
  due_date: string | null
  completed_at: string | null
  progress: number
  notes: string | null
  metadata: Json | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

export interface Habit {
  id: string
  user_id: string
  area_id: string | null
  goal_id: string | null
  title: string
  description: string | null
  status: string
  frequency: string
  days_of_week: number[] | null
  target_count: number
  metadata: Json | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

export interface Task {
  id: string
  user_id: string
  parent_task_id: string | null
  area_id: string | null
  goal_id: string | null
  project_id: string | null
  process_id: string | null
  process_step_id: string | null
  title: string
  description: string | null
  status: string
  priority: string
  context: string | null
  energy_level: string | null
  estimated_minutes: number | null
  actual_minutes: number | null
  scheduled_at: string | null
  due_at: string | null
  started_at: string | null
  completed_at: string | null
  position: number
  is_favorite: boolean
  notes: string | null
  metadata: Json | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

export interface Routine {
  id: string
  user_id: string
  area_id: string | null
  goal_id: string | null
  title: string
  description: string | null
  status: string
  priority: string
  estimated_minutes: number | null
  checklist: Json | null
  notes: string | null
  metadata: Json | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

export interface RoutineSchedule {
  id: string
  user_id: string
  routine_id: string
  frequency: string
  days_of_week: number[] | null
  day_of_month: number | null
  time_of_day: string | null
  duration_minutes: number | null
  recurrence_rule: string | null
  start_date: string | null
  end_date: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface Process {
  id: string
  user_id: string
  area_id: string | null
  title: string
  description: string | null
  instructions: string | null
  status: string
  is_template: boolean
  metadata: Json | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

export interface CalendarEvent {
  id: string
  user_id: string
  area_id: string | null
  task_id: string | null
  project_id: string | null
  routine_id: string | null
  title: string
  description: string | null
  start_at: string
  end_at: string | null
  all_day: boolean
  location: string | null
  event_type: string
  external_provider: string | null
  external_id: string | null
  metadata: Json | null
  created_at: string
  updated_at: string
}

export type RoutineWithSchedules = Routine & { schedules: RoutineSchedule[] }

export type AreaCreate = Pick<Area, "name" | "slug"> & Partial<Pick<Area, "description" | "icon" | "color" | "position" | "parent_id">>
export type AreaUpdate = Partial<Pick<Area, "name" | "slug" | "description" | "icon" | "color" | "position" | "parent_id">>
