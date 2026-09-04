import { test } from "node:test"
import * as assert from "node:assert/strict"
import type { SupabaseClient } from "@supabase/supabase-js"
import {
  calculateGoalProgress,
  createGoal,
  createHabit,
  createProcess,
  createProject,
  createPurpose,
  createRoutine,
  createTask,
} from "../services/pos-create.service"

type InsertRecord = Record<string, unknown>

function makeClient(userId = "user-123") {
  const inserts: Record<string, InsertRecord[]> = {}
  const upserts: Record<string, InsertRecord[]> = {}

  const client = {
    auth: {
      getUser: async () => ({ data: { user: { id: userId } }, error: null }),
    },
    from(table: string) {
      return {
        insert(payload: InsertRecord) {
          inserts[table] = [...(inserts[table] ?? []), payload]
          return {
            error: null,
            select() {
              return {
                single: async () => ({ data: { id: `${table}-id`, ...payload }, error: null }),
              }
            },
          }
        },
        upsert(payload: InsertRecord) {
          upserts[table] = [...(upserts[table] ?? []), payload]
          return {
            select() {
              return {
                single: async () => ({ data: { id: `${table}-id`, ...payload }, error: null }),
              }
            },
          }
        },
      }
    },
  }

  return { client: client as unknown as SupabaseClient, inserts, upserts }
}

test("calculateGoalProgress maps current value between initial and target", () => {
  assert.equal(calculateGoalProgress(0, 40, 100), 40)
  assert.equal(calculateGoalProgress(10, 55, 100), 50)
  assert.equal(calculateGoalProgress(0, 150, 100), 100)
  assert.equal(calculateGoalProgress(100, 50, 0), 50)
})

test("createGoal persists a SMART goal with measurable progress fields", async () => {
  const { client, inserts } = makeClient()

  await createGoal(client, {
    title: "Fechar 10 contratos",
    description: "Meta comercial do ciclo",
    metric_name: "Contratos fechados",
    metric_unit: "contratos",
    initial_value: 0,
    current_value: 2,
    target_value: 10,
    due_date: "2026-12-31",
    success_criteria: "10 contratos pagos e ativos",
    motivation: "Aumentar previsibilidade comercial",
  })

  assert.equal(inserts.goals[0].user_id, "user-123")
  assert.equal(inserts.goals[0].progress, 20)
  assert.equal(inserts.goals[0].metric_name, "Contratos fechados")
  assert.deepEqual(inserts.goals[0].metadata, {
    smart: {
      specific: true,
      measurable: true,
      achievable: true,
      relevant: true,
      time_bound: true,
    },
  })
})

test("createRoutine creates the routine and its active schedule", async () => {
  const { client, inserts } = makeClient()

  await createRoutine(client, {
    title: "Planejamento semanal",
    estimated_minutes: 45,
    schedule: {
      frequency: "weekly",
      days_of_week: [1],
      time_of_day: "08:00",
      duration_minutes: 45,
    },
  })

  assert.equal(inserts.routines[0].title, "Planejamento semanal")
  assert.equal(inserts.routine_schedules[0].routine_id, "routines-id")
  assert.deepEqual(inserts.routine_schedules[0].days_of_week, [1])
  assert.equal(inserts.routine_schedules[0].active, true)
})

test("module create helpers persist task, project, habit, process and purpose", async () => {
  const { client, inserts, upserts } = makeClient()

  await createTask(client, { title: "Executar proposta", due_at: "2026-09-05T12:00:00.000Z" })
  await createProject(client, { title: "Projeto TELOS", progress: 15 })
  await createHabit(client, { title: "Ler 30 minutos", frequency: "daily", target_count: 1 })
  await createProcess(client, { title: "Onboarding cliente", instructions: "1. Diagnosticar\n2. Implantar" })
  await createPurpose(client, { purpose: "Construir empresas com IA", values: ["Verdade", "Execução"] })

  assert.equal(inserts.tasks[0].title, "Executar proposta")
  assert.equal(inserts.projects[0].progress, 15)
  assert.equal(inserts.habits[0].frequency, "daily")
  assert.equal(inserts.processes[0].instructions, "1. Diagnosticar\n2. Implantar")
  assert.equal(upserts.purposes[0].purpose, "Construir empresas com IA")
  assert.deepEqual(upserts.purposes[0].values, ["Verdade", "Execução"])
})
