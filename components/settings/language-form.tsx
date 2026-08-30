"use client"
import { useI18n } from "@/components/i18n-provider"
import { changeLocale } from "@/app/settings/actions"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
export function LanguageForm() {
  const { locale, t } = useI18n()
  return <form action={changeLocale} className="space-y-3"><Label htmlFor="locale">{t("settings.language")}</Label><p className="text-xs text-muted-foreground">{t("settings.languageHelp")}</p><div className="flex gap-2"><Select name="locale" defaultValue={locale}><SelectTrigger id="locale" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pt-BR">{t("settings.portuguese")}</SelectItem><SelectItem value="en">{t("settings.english")}</SelectItem></SelectContent></Select><Button type="submit">{t("common.save")}</Button></div></form>
}
