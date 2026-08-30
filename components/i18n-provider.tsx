"use client"
import { createContext, useContext } from "react"
import { getDictionary, type Locale, type TranslationKey } from "@/lib/i18n"
const I18nContext = createContext<Locale>("pt-BR")
export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) { return <I18nContext.Provider value={locale}>{children}</I18nContext.Provider> }
export function useI18n() { const locale = useContext(I18nContext); const dictionary = getDictionary(locale); return { locale, t: (key: TranslationKey) => dictionary[key] } }
