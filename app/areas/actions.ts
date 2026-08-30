"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { archiveArea, createArea, updateArea } from "@/services/area.service"
import { ServiceError } from "@/services/errors"
export interface AreaActionState { error: string | null; success: boolean }
const fail = (error: unknown): AreaActionState => ({ error: error instanceof ServiceError ? error.message : "Ocorreu um erro inesperado.", success: false })
function slugify(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }
export async function createAreaAction(_: AreaActionState, formData: FormData): Promise<AreaActionState> { try { const name = String(formData.get("name") ?? "").trim(); if (!name) return { error: "Informe o nome da area.", success: false }; await createArea(await createClient(), { name, slug: slugify(name), description: String(formData.get("description") ?? "").trim() || null }); revalidatePath("/areas"); return { error: null, success: true } } catch (error) { return fail(error) } }
export async function updateAreaAction(id: string, formData: FormData) { const name = String(formData.get("name") ?? "").trim(); if (!name) throw new Error("Informe o nome da area."); await updateArea(await createClient(), id, { name, slug: slugify(name), description: String(formData.get("description") ?? "").trim() || null }); revalidatePath("/areas") }
export async function archiveAreaAction(id: string) { await archiveArea(await createClient(), id); revalidatePath("/areas") }
