import { test } from "node:test"
import * as assert from "node:assert/strict"
import { buildTodaySummary } from "../services/today-summary.logic"
import { getLocalDayBoundsIso } from "../services/today-summary.service"

test("buildTodaySummary compares timestamptz values in Sao Paulo local day", () => {
  const summary = buildTodaySummary({
    today: "2026-09-01",
    timeZone: "America/Sao_Paulo",
    tasks: [
      { id: "late-local", title: "Fechar o dia", status: "next", due_at: "2026-09-02T01:30:00Z", scheduled_at: null, priority: "high" },
      { id: "next-local", title: "Começar amanhã", status: "next", due_at: "2026-09-02T03:30:00Z", scheduled_at: null, priority: "high" },
    ],
    events: [
      { id: "event-local", title: "Reunião noite", start_at: "2026-09-02T01:00:00Z", end_at: null },
      { id: "event-next", title: "Reunião amanhã", start_at: "2026-09-02T03:30:00Z", end_at: null },
    ],
    goals: [],
    routines: [],
  })

  assert.equal(summary.stats.tasksToday, 1)
  assert.equal(summary.stats.eventsToday, 1)
  assert.deepEqual(summary.focusItems.map((item) => item.id), ["late-local", "event-local"])
})

test("getLocalDayBoundsIso builds UTC bounds for a Sao Paulo calendar day", () => {
  assert.deepEqual(getLocalDayBoundsIso("2026-09-01", "America/Sao_Paulo"), {
    start: "2026-09-01T03:00:00.000Z",
    next: "2026-09-02T03:00:00.000Z",
  })
})
