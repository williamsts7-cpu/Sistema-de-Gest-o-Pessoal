export type RoutineScheduleDisplay = {
  frequency: string
  days_of_week: number[] | null
  day_of_month: number | null
  time_of_day: string | null
}

const statusLabels: Record<string, string> = {
  active: "Ativo",
  archived: "Arquivado",
  cancelled: "Cancelado",
  completed: "Concluído",
  draft: "Rascunho",
  idea: "Ideia",
  inbox: "Inbox",
  inactive: "Inativo",
  in_progress: "Em andamento",
  next: "Próxima",
  paused: "Pausado",
  planned: "Planejado",
  scheduled: "Agendado",
  waiting: "Aguardando",
}

const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function statusLabel(status: string) {
  return statusLabels[status] ?? status
}

export function formatDateOnly(value: string | null) {
  if (!value) return "Sem prazo"
  const [year, month, day] = value.slice(0, 10).split("-")
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

export function formatDateTime(value: string | null, timeZone = "America/Sao_Paulo") {
  if (!value) return "Sem horário"
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value))
}

function formatTime(value: string | null) {
  return value ? value.slice(0, 5) : null
}

export function formatRoutineSchedule(schedule: RoutineScheduleDisplay | null) {
  if (!schedule) return "Sem agenda definida"

  const time = formatTime(schedule.time_of_day)
  const suffix = time ? ` às ${time}` : ""

  if (schedule.frequency === "daily") return `Diária${suffix}`
  if (schedule.frequency === "weekly") {
    const days = (schedule.days_of_week ?? []).map((day) => weekdays[day]).filter(Boolean)
    return days.length > 0 ? `${days.join(", ")}${suffix}` : `Sem dias definidos${suffix}`
  }
  if (schedule.frequency === "monthly") return schedule.day_of_month ? `Todo dia ${schedule.day_of_month}${suffix}` : `Mensal${suffix}`
  if (schedule.frequency === "custom") return `Personalizada${suffix}`

  return `${schedule.frequency}${suffix}`
}
