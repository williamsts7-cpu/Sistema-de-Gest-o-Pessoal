"use client"
import { useI18n } from "@/components/i18n-provider"
import type { TranslationKey } from "@/lib/i18n"
export function ModulePlaceholder({ titleKey }: { titleKey: TranslationKey }) { const { t } = useI18n(); return <div className="mx-auto flex w-full max-w-5xl flex-col gap-4"><h1 className="text-3xl font-bold tracking-tight">{t(titleKey)}</h1><p className="text-muted-foreground">{t("module.subtitle")}</p><div className="glass-panel flex h-[400px] items-center justify-center rounded-[24px]"><span className="text-sm font-medium uppercase tracking-widest text-gray-500">{t("common.comingSoon")}</span></div></div> }
