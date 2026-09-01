export type TodayTask = {
  id: string
  title: string
  status: string
  due_at: string | null
  scheduled_at: string | null
  priority?: "low" | "medium" | "high" | "critical" | string | null
  project_title?: string | null
}

export type TodayEvent = {
  id: string
  title: string
  start_at: string
  end_at: string | null
}

export type TodayGoal = {
  id: string
  title: string
  progress: number | null
  due_date: string | null
  status: string
}

export type TodayRoutine = {
  id: string
  title: string
  scheduled_today: boolean
  completed_today: boolean
  completion_tracked?: boolean
  status: string
}

export type TodaySummaryInput = {
  today: string
  timeZone?: string
  tasks: TodayTask[]
  events: TodayEvent[]
  goals: TodayGoal[]
  routines: TodayRoutine[]
}

export type TodayFocusItem = {
  id: string
  title: string
  kind: "task" | "event" | "goal" | "routine"
  label: string
  href: string
  priority: number
}

export type TodayInsight = {
  kind: "success" | "attention" | "risk" | "info"
  message: string
}

export type TodaySummary = {
  stats: {
    tasksToday: number
    openTasksToday: number
    overdueTasks: number
    eventsToday: number
    routinesDueToday: number
    pendingRoutinesToday: number
    activeGoals: number
    goalsNeedingAttention: number
  }
  focusItems: TodayFocusItem[]
  insights: TodayInsight[]
}

const closedTaskStatuses = new Set(["completed", "cancelled", "archived"])
const activeStatuses = new Set(["active", "in_progress", "todo", "planned"])
const priorityWeight: Record<string, number> = { critical: 50, urgent: 40, high: 30, medium: 20, low: 10 }

function dateOnly(value: string | null | undefined, timeZone = "America/Sao_Paulo") {
  if (!value) return null
  if (!value.includes("T")) return value.slice(0, 10)

  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value))
}

function isOpenTask(task: TodayTask) {
  return !closedTaskStatuses.has(task.status)
}

function isActive(status: string) {
  return activeStatuses.has(status)
}

function plural(count: number, singular: string, pluralText: string) {
  return count === 1 ? singular : pluralText
}

function daysBetween(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T12:00:00Z`).getTime()
  const end = new Date(`${endDate}T12:00:00Z`).getTime()
  return Math.round((end - start) / 86_400_000)
}

function isTaskForToday(task: TodayTask, today: string, timeZone: string) {
  return dateOnly(task.due_at, timeZone) === today || dateOnly(task.scheduled_at, timeZone) === today
}

function isTaskOverdue(task: TodayTask, today: string, timeZone: string) {
  const dueDate = dateOnly(task.due_at, timeZone)
  return Boolean(dueDate && dueDate < today)
}

export function buildTodaySummary(input: TodaySummaryInput): TodaySummary {
  const timeZone = input.timeZone ?? "America/Sao_Paulo"
  const openTasks = input.tasks.filter(isOpenTask)
  const tasksToday = input.tasks.filter((task) => isTaskForToday(task, input.today, timeZone))
  const openTasksToday = tasksToday.filter(isOpenTask)
  const overdueTasks = openTasks.filter((task) => isTaskOverdue(task, input.today, timeZone))
  const eventsToday = input.events.filter((event) => dateOnly(event.start_at, timeZone) === input.today)
  const routinesDueToday = input.routines.filter((routine) => isActive(routine.status) && routine.scheduled_today)
  const pendingRoutinesToday = routinesDueToday.filter((routine) => routine.completion_tracked !== false && !routine.completed_today)
  const activeGoals = input.goals.filter((goal) => isActive(goal.status))
  const goalsNeedingAttention = activeGoals.filter((goal) => {
    const progress = goal.progress ?? 0
    const dueDate = dateOnly(goal.due_date)
    return progress < 50 && Boolean(dueDate && daysBetween(input.today, dueDate) <= 14)
  })

  const taskFocus: TodayFocusItem[] = [...overdueTasks, ...openTasksToday]
    .sort((a, b) => (priorityWeight[b.priority ?? ""] ?? 0) - (priorityWeight[a.priority ?? ""] ?? 0))
    .map((task) => {
      const overdue = isTaskOverdue(task, input.today, timeZone)
      return {
        id: task.id,
        title: task.title,
        kind: "task",
        label: overdue ? "Tarefa atrasada" : task.project_title ? `Tarefa • ${task.project_title}` : "Tarefa de hoje",
        href: "/tasks",
        priority: overdue ? 120 : 80 + (priorityWeight[task.priority ?? ""] ?? 0),
      }
    })

  const routineFocus: TodayFocusItem[] = pendingRoutinesToday.map((routine) => ({
    id: routine.id,
    title: routine.title,
    kind: "routine",
    label: "Rotina pendente",
    href: "/routines",
    priority: 70,
  }))

  const eventFocus: TodayFocusItem[] = eventsToday.map((event) => ({
    id: event.id,
    title: event.title,
    kind: "event",
    label: "Compromisso de hoje",
    href: "/calendar",
    priority: 60,
  }))

  const goalFocus: TodayFocusItem[] = goalsNeedingAttention.map((goal) => ({
    id: goal.id,
    title: goal.title,
    kind: "goal",
    label: "Meta em atenção",
    href: "/goals",
    priority: 50,
  }))

  const focusItems = [...taskFocus, ...routineFocus, ...eventFocus, ...goalFocus]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 6)

  const insights: TodayInsight[] = []
  if (overdueTasks.length > 0) insights.push({ kind: "risk", message: `Você tem ${overdueTasks.length} ${plural(overdueTasks.length, "tarefa atrasada", "tarefas atrasadas")}. Resolva ou reprograme antes de abrir novas frentes.` })
  if (goalsNeedingAttention.length > 0) insights.push({ kind: "attention", message: `${goalsNeedingAttention.length} ${plural(goalsNeedingAttention.length, "meta precisa", "metas precisam")} de atenção pelo prazo ou baixo progresso.` })
  if (pendingRoutinesToday.length > 0) insights.push({ kind: "info", message: `${pendingRoutinesToday.length} ${plural(pendingRoutinesToday.length, "rotina ainda está pendente", "rotinas ainda estão pendentes")} hoje.` })
  if (insights.length === 0) insights.push({ kind: "success", message: "Seu dia está sem atrasos críticos no sistema." })

  return {
    stats: {
      tasksToday: tasksToday.length,
      openTasksToday: openTasksToday.length,
      overdueTasks: overdueTasks.length,
      eventsToday: eventsToday.length,
      routinesDueToday: routinesDueToday.length,
      pendingRoutinesToday: pendingRoutinesToday.length,
      activeGoals: activeGoals.length,
      goalsNeedingAttention: goalsNeedingAttention.length,
    },
    focusItems,
    insights,
  }
}
