"use client"

import * as React from "react"
import Image from "next/image"
import {
  Home,
  Sun,
  Inbox,
  Calendar,
  Compass,
  Target,
  Flag,
  Briefcase,
  Repeat,
  Workflow,
  CheckSquare,
  Activity,
  Library,
  BookOpen,
  PenTool,
  RotateCcw,
  Bot,
  Settings,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCurrentProfileName } from "@/hooks/use-current-profile"

const data = {
  navMain: [
    {
      title: "Home",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: Home },
        { title: "Hoje", url: "/today", icon: Sun },
        { title: "Inbox", url: "/inbox", icon: Inbox },
        { title: "Calendário", url: "/calendar", icon: Calendar },
      ],
    },
    {
      title: "Planejamento",
      items: [
        { title: "Propósito", url: "/purpose", icon: Compass },
        { title: "Áreas", url: "/areas", icon: Target },
        { title: "Metas", url: "/goals", icon: Flag },
        { title: "Projetos", url: "/projects", icon: Briefcase },
        { title: "Rotinas", url: "/routines", icon: Repeat },
        { title: "Processos", url: "/processes", icon: Workflow },
      ],
    },
    {
      title: "Execução",
      items: [
        { title: "Tarefas", url: "/tasks", icon: CheckSquare },
        { title: "Hábitos", url: "/habits", icon: Activity },
      ],
    },
    {
      title: "Conhecimento",
      items: [
        { title: "Biblioteca", url: "/knowledge", icon: Library },
        { title: "Estudos", url: "/studies", icon: BookOpen },
        { title: "Conteúdo", url: "/content", icon: PenTool },
      ],
    },
    {
      title: "Revisões",
      items: [
        { title: "Daily Review", url: "/reviews/daily", icon: RotateCcw },
        { title: "Weekly Review", url: "/reviews/weekly", icon: RotateCcw },
        { title: "Monthly Review", url: "/reviews/monthly", icon: RotateCcw },
      ],
    },
    {
      title: "Sistema",
      items: [
        { title: "IA", url: "/ai", icon: Bot },
        { title: "Configurações", url: "/settings", icon: Settings },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const profileName = useCurrentProfileName()
  
  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#090818]/90 backdrop-blur-2xl" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-white/5 transition-colors" render={<Link href="/" />}>
              <Image src="/favicon_04.png" alt="Telos Nexus" width={32} height={32} className="size-8 rounded-lg object-cover shadow-[0_0_15px_rgba(37,99,235,0.45)]" priority />
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium text-white tracking-[0.16em]">TELOS NEXUS</span>
                <span className="text-[10px] uppercase tracking-widest text-blue-300">Personal OS</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-medium tracking-widest uppercase text-white/40">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton className="hover:bg-white/5 text-gray-400 hover:text-white transition-colors" isActive={pathname.startsWith(item.url)} render={<Link href={item.url} />}>
                      <item.icon className="text-indigo-400" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
              <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-white/10 text-white shadow-sm">
                <User className="size-3.5" />
              </div>
              <span className="truncate text-sm font-medium">{profileName}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
