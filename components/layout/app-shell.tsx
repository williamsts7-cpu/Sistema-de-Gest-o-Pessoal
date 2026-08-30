"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname.startsWith("/login")) return <main className="relative min-h-screen">{children}</main>
  return <SidebarProvider><AppSidebar /><div className="relative flex min-h-screen w-full flex-1 flex-col overflow-hidden"><AppHeader /><main className="relative flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main></div></SidebarProvider>
}
