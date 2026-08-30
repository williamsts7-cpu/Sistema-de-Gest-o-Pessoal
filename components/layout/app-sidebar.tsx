"use client"
import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Sun, Inbox, Calendar, Compass, Target, Flag, Briefcase, Repeat, Workflow, CheckSquare, Activity, Library, BookOpen, PenTool, RotateCcw, Bot, Settings, User } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar"
import { useCurrentProfileName } from "@/hooks/use-current-profile"
import { useI18n } from "@/components/i18n-provider"
import type { TranslationKey } from "@/lib/i18n"

const navigation: { title: TranslationKey; items: { title: TranslationKey; url: string; icon: typeof Home }[] }[] = [
  { title: "nav.home", items: [{ title: "nav.dashboard", url: "/dashboard", icon: Home }, { title: "nav.today", url: "/today", icon: Sun }, { title: "nav.inbox", url: "/inbox", icon: Inbox }, { title: "nav.calendar", url: "/calendar", icon: Calendar }] },
  { title: "nav.planning", items: [{ title: "nav.purpose", url: "/purpose", icon: Compass }, { title: "nav.areas", url: "/areas", icon: Target }, { title: "nav.goals", url: "/goals", icon: Flag }, { title: "nav.projects", url: "/projects", icon: Briefcase }, { title: "nav.routines", url: "/routines", icon: Repeat }, { title: "nav.processes", url: "/processes", icon: Workflow }] },
  { title: "nav.execution", items: [{ title: "nav.tasks", url: "/tasks", icon: CheckSquare }, { title: "nav.habits", url: "/habits", icon: Activity }] },
  { title: "nav.knowledge", items: [{ title: "nav.library", url: "/knowledge", icon: Library }, { title: "nav.studies", url: "/studies", icon: BookOpen }, { title: "nav.content", url: "/content", icon: PenTool }] },
  { title: "nav.reviews", items: [{ title: "nav.dailyReview", url: "/reviews/daily", icon: RotateCcw }, { title: "nav.weeklyReview", url: "/reviews/weekly", icon: RotateCcw }, { title: "nav.monthlyReview", url: "/reviews/monthly", icon: RotateCcw }] },
  { title: "nav.system", items: [{ title: "nav.ai", url: "/ai", icon: Bot }, { title: "nav.settings", url: "/settings", icon: Settings }] },
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname(), profileName = useCurrentProfileName(), { t } = useI18n()
  return <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#090818]/90 backdrop-blur-2xl" {...props}><SidebarHeader><SidebarMenu><SidebarMenuItem><SidebarMenuButton size="lg" className="hover:bg-white/5" render={<Link href="/" />}><Image src="/favicon_04.png" alt="Telos Nexus" width={32} height={32} className="size-8 rounded-lg object-cover shadow-[0_0_15px_rgba(37,99,235,0.45)]" priority /><div className="flex flex-col gap-0.5 leading-none"><span className="font-medium tracking-[0.16em] text-white">TELOS NEXUS</span><span className="text-[10px] uppercase tracking-widest text-blue-300">Personal OS</span></div></SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarHeader><SidebarContent>{navigation.map(group => <SidebarGroup key={group.title}><SidebarGroupLabel className="text-xs font-medium uppercase tracking-widest text-white/40">{t(group.title)}</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{group.items.map(item => <SidebarMenuItem key={item.url}><SidebarMenuButton className="text-gray-400 transition-colors hover:bg-white/5 hover:text-white" isActive={pathname.startsWith(item.url)} render={<Link href={item.url} />}><item.icon className="text-indigo-400" /><span>{t(item.title)}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroupContent></SidebarGroup>)}</SidebarContent><SidebarFooter><SidebarMenu><SidebarMenuItem><SidebarMenuButton className="text-gray-400 hover:bg-white/5 hover:text-white"><div className="flex size-6 items-center justify-center rounded-md bg-white/10 text-white"><User className="size-3.5" /></div><span className="truncate text-sm font-medium">{profileName}</span></SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarFooter></Sidebar>
}
