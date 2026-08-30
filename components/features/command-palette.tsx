"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { Calendar, Compass, Inbox, Settings, Target } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
export function CommandPalette() {
  const [open, setOpen] = React.useState(false), router = useRouter(), { t } = useI18n()
  React.useEffect(() => { const down = (event: KeyboardEvent) => { if (event.key === "k" && (event.metaKey || event.ctrlKey)) { event.preventDefault(); setOpen(value => !value) } }; document.addEventListener("keydown", down); return () => document.removeEventListener("keydown", down) }, [])
  const go = (path: string) => { setOpen(false); router.push(path) }
  return <><Button variant="outline" className="relative h-8 w-full justify-start bg-muted/50 text-sm font-normal text-muted-foreground shadow-none md:w-40 lg:w-64" onClick={() => setOpen(true)}><span className="hidden lg:inline-flex">{t("search.full")}</span><span className="lg:hidden">{t("search.short")}</span><kbd className="pointer-events-none absolute right-1 top-1 hidden h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] sm:flex">⌘K</kbd></Button><CommandDialog open={open} onOpenChange={setOpen}><CommandInput placeholder={t("search.prompt")} /><CommandList><CommandEmpty>{t("search.empty")}</CommandEmpty><CommandGroup heading={t("search.quickActions")}><CommandItem>{t("search.newTask")}</CommandItem><CommandItem>{t("search.newProject")}</CommandItem><CommandItem>{t("search.newNote")}</CommandItem></CommandGroup><CommandSeparator /><CommandGroup heading={t("search.navigation")}><CommandItem onSelect={() => go("/today")}><Calendar />{t("nav.today")}</CommandItem><CommandItem onSelect={() => go("/inbox")}><Inbox />{t("nav.inbox")}</CommandItem><CommandItem onSelect={() => go("/areas")}><Target />{t("nav.areas")}</CommandItem><CommandItem onSelect={() => go("/purpose")}><Compass />{t("nav.purpose")}</CommandItem><CommandItem onSelect={() => go("/settings")}><Settings />{t("nav.settings")}</CommandItem></CommandGroup></CommandList></CommandDialog></>
}
