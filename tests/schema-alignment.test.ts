import { test } from "node:test"
import * as assert from "node:assert/strict"
import { readFileSync } from "node:fs"

test("area service selects only columns present in the Supabase schema", () => {
  const source = readFileSync("services/area.service.ts", "utf8")
  const match = source.match(/const AREA_COLUMNS = "([^"]+)"/)

  assert.ok(match, "AREA_COLUMNS constant should exist")
  const columns = match[1].split(",").map((column) => column.trim())

  assert.deepEqual(columns, [
    "id",
    "user_id",
    "parent_id",
    "name",
    "slug",
    "description",
    "icon",
    "color",
    "position",
    "status",
    "metadata",
    "created_at",
    "updated_at",
    "archived_at",
  ])
})
