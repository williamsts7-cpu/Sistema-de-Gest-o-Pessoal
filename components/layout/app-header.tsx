"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { QuickCapture } from "@/components/features/quick-capture"
import { CommandPalette } from "@/components/features/command-palette"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-white/5 bg-[#03020A]/65 backdrop-blur-2xl px-4 shadow-[0_20px_40px_rgba(0,0,0,0.16)]">
      <SidebarTrigger className="-ml-1 text-white/70 hover:text-white" />
      <div className="flex flex-1 items-center gap-2 md:gap-4 px-4">
        <CommandPalette />
      </div>
      <div className="flex items-center gap-2">
        <QuickCapture />
      </div>
    </header>
  )
}
