import { test } from "node:test"
import * as assert from "node:assert/strict"
import { captureQuickItem, type CaptureKind } from "../services/inbox.service"

class FakeSupabaseClient {
  inserts: { table: string; payload: Record<string, unknown> }[] = []
  auth = {
    getUser: async () => ({ data: { user: { id: "user-123" } }, error: null }),
  }

  from(table: string) {
    return {
      insert: async (payload: Record<string, unknown>) => {
        this.inserts.push({ table, payload })
        return { error: null }
      },
    }
  }
}

test("captureQuickItem persists each creation type in its real POS table", async () => {
  const cases: {
    kind: CaptureKind
    table: string
    targetPath: string
    expected: Record<string, unknown>
  }[] = [
    { kind: "inbox", table: "inbox_items", targetPath: "/inbox", expected: { content: "Revisar plano semanal", source: "manual", status: "unprocessed" } },
    { kind: "task", table: "tasks", targetPath: "/tasks", expected: { title: "Revisar plano semanal", status: "next", priority: "medium", position: 0, is_favorite: false } },
    { kind: "habit", table: "habits", targetPath: "/habits", expected: { title: "Revisar plano semanal", status: "active", frequency: "daily", target_count: 1 } },
    { kind: "project", table: "projects", targetPath: "/projects", expected: { title: "Revisar plano semanal", status: "active", priority: "medium", progress: 0 } },
    { kind: "goal", table: "goals", targetPath: "/goals", expected: { title: "Revisar plano semanal", status: "active", priority: "medium", progress: 0 } },
  ]

  for (const item of cases) {
    const client = new FakeSupabaseClient()
    const result = await captureQuickItem(client as never, { kind: item.kind, content: "Revisar plano semanal" })

    assert.equal(result.targetPath, item.targetPath)
    assert.equal(client.inserts.length, 1)
    assert.equal(client.inserts[0].table, item.table)
    assert.deepEqual(client.inserts[0].payload, {
      user_id: "user-123",
      ...item.expected,
      metadata: { source: "quick_capture", capture_kind: item.kind },
    })
  }
})

test("captureQuickItem rejects unsupported runtime creation types", async () => {
  const client = new FakeSupabaseClient()

  await assert.rejects(
    () => captureQuickItem(client as never, { kind: "note" as CaptureKind, content: "Teste" }),
    /Tipo de captura invalido/
  )
  assert.equal(client.inserts.length, 0)
})
