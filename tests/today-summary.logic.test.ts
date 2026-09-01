import { test } from "node:test"
import * as assert from "node:assert/strict"
import { buildTodaySummary } from "../services/today-summary.logic"

test("buildTodaySummary does not mark untracked routines as pending", () => {
  const summary = buildTodaySummary({
    today: "2026-09-01",
    tasks: [],
    events: [],
    goals: [],
    routines: [
      { id: "r1", title: "Devocional", scheduled_today: true, completed_today: false, completion_tracked: false, status: "active" },
    ],
  })

  assert.equal(summary.stats.routinesDueToday, 1)
  assert.equal(summary.stats.pendingRoutinesToday, 0)
  assert.ok(summary.insights.every((insight) => !insight.message.includes("pendente")))
})

test("buildTodaySummary aggregates today's MRPP workload and insights", () => {
  const summary = buildTodaySummary({
    today: "2026-09-01",
    tasks: [
      { id: "t1", title: "Escrever roteiro", status: "next", due_at: "2026-09-01T18:00:00-03:00", scheduled_at: null, priority: "high", project_title: "YouTube" },
      { id: "t2", title: "Revisar proposta", status: "completed", due_at: "2026-09-01T10:00:00-03:00", scheduled_at: null, priority: "medium" },
      { id: "t3", title: "Responder lead", status: "next", due_at: "2026-08-31T18:00:00-03:00", scheduled_at: null, priority: "high" },
      { id: "t4", title: "Organizar biblioteca", status: "next", due_at: "2026-09-03T18:00:00-03:00", scheduled_at: null, priority: "low" },
    ],
    events: [
      { id: "e1", title: "Call com cliente", start_at: "2026-09-01T13:00:00-03:00", end_at: "2026-09-01T14:00:00-03:00" },
      { id: "e2", title: "Consulta", start_at: "2026-09-02T09:00:00-03:00", end_at: "2026-09-02T10:00:00-03:00" },
    ],
    goals: [
      { id: "g1", title: "Fechar 3 clientes", progress: 68, due_date: "2026-09-10", status: "active" },
      { id: "g2", title: "Ler Bíblia todos os dias", progress: 22, due_date: "2026-09-02", status: "active" },
      { id: "g3", title: "Meta concluída", progress: 100, due_date: "2026-09-01", status: "completed" },
    ],
    routines: [
      { id: "r1", title: "Devocional", scheduled_today: true, completed_today: false, status: "active" },
      { id: "r2", title: "Treino", scheduled_today: false, completed_today: false, status: "active" },
      { id: "r3", title: "Leitura", scheduled_today: true, completed_today: true, status: "active" },
    ],
  })

  assert.equal(summary.stats.tasksToday, 2)
  assert.equal(summary.stats.openTasksToday, 1)
  assert.equal(summary.stats.overdueTasks, 1)
  assert.equal(summary.stats.eventsToday, 1)
  assert.equal(summary.stats.routinesDueToday, 2)
  assert.equal(summary.stats.pendingRoutinesToday, 1)
  assert.equal(summary.stats.activeGoals, 2)
  assert.equal(summary.stats.goalsNeedingAttention, 1)

  assert.deepEqual(summary.focusItems.map((item) => item.title), [
    "Responder lead",
    "Escrever roteiro",
    "Devocional",
    "Call com cliente",
    "Ler Bíblia todos os dias",
  ])

  assert.ok(summary.insights.some((insight) => insight.kind === "risk" && insight.message.includes("1 tarefa atrasada")))
  assert.ok(summary.insights.some((insight) => insight.kind === "attention" && insight.message.includes("1 meta precisa de atenção")))
})
