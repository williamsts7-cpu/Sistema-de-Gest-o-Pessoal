import { test } from "node:test"
import * as assert from "node:assert/strict"
import { formatDateTime, formatDateOnly, formatRoutineSchedule, statusLabel } from "../services/pos-overview.logic"

test("formats nullable dates for POS list pages", () => {
  assert.equal(formatDateOnly("2026-09-01"), "01/09/2026")
  assert.equal(formatDateTime("2026-09-01T13:30:00-03:00"), "01/09/2026, 13:30")
  assert.equal(formatDateOnly(null), "Sem prazo")
  assert.equal(formatDateTime(null), "Sem horário")
})

test("formats routine schedules from real Supabase schema", () => {
  assert.equal(formatRoutineSchedule({ frequency: "daily", days_of_week: null, day_of_month: null, time_of_day: "08:00:00" }), "Diária às 08:00")
  assert.equal(formatRoutineSchedule({ frequency: "weekly", days_of_week: [1, 3, 5], day_of_month: null, time_of_day: "07:30:00" }), "Seg, Qua, Sex às 07:30")
  assert.equal(formatRoutineSchedule({ frequency: "monthly", days_of_week: null, day_of_month: 15, time_of_day: null }), "Todo dia 15")
})

test("translates common status labels", () => {
  assert.equal(statusLabel("in_progress"), "Em andamento")
  assert.equal(statusLabel("completed"), "Concluído")
  assert.equal(statusLabel("next"), "Próxima")
  assert.equal(statusLabel("unknown_status"), "unknown_status")
})
