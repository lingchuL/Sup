"use client"

import { Titlebar } from "@/components/layout/titlebar"
import { Sidebar } from "@/components/layout/sidebar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Titlebar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-hidden flex flex-col bg-[var(--cp-bg-base)]">
          {children}
        </div>
      </div>
    </div>
  )
}
