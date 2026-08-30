import "server-only"
import { cookies } from "next/headers"
import { getDictionary, normalizeLocale } from "@/lib/i18n"
export async function getRequestI18n() { const locale = normalizeLocale((await cookies()).get("app-locale")?.value); return { locale, t: getDictionary(locale) } }
