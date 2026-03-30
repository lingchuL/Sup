"use client"

import { useTabStore } from "@/stores/tab-store"
import { useAppStore } from "@/stores/app-store"
import { useCoPiperStore } from "@/stores/copiper-store"
import { TabItem } from "@/lib/types"
import { ScrollArea } from "@/components/ui"
import { useRouter } from "next/navigation"
import { clearLoginToken } from "@/lib/auth-utils"
import { useState } from "react"

export function Sidebar() {
  const { tabs, activeTabId, setActiveTab, removeTab, addTab, reorderTabs } = useTabStore()
  const { userName } = useAppStore()
  const { projDir } = useCoPiperStore()
  const router = useRouter()
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  const projName = projDir ? projDir.split(/[/\\]/).filter(Boolean).pop() ?? "Project" : "未选择项目"
  const projAbbr = projName.substring(0, 2).toUpperCase()

  function handleLogout() { clearLoginToken(); router.replace("/login") }
  function handleOpenTable() { addTab("table_view") }
  function handleOpenSettings() {
    const existing = tabs.find(t => t.type === "settings")
    if (existing) setActiveTab(existing.id); else addTab("settings", "设置")
  }

  function handleDragStart(e: React.DragEvent, idx: number) {
    if (idx === 0) { e.preventDefault(); return }
    setDragIdx(idx); e.dataTransfer.effectAllowed = "move"
  }
  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault(); if (idx === 0 || dragIdx === null) return
    e.dataTransfer.dropEffect = "move"; setDragOverIdx(idx)
  }
  function handleDrop(e: React.DragEvent, idx: number) {
    e.preventDefault()
    if (dragIdx !== null && dragIdx !== idx && idx !== 0) reorderTabs(dragIdx, idx)
    setDragIdx(null); setDragOverIdx(null)
  }
  function handleDragEnd() { setDragIdx(null); setDragOverIdx(null) }

  return (
    <div className="w-[var(--cp-sidebar-width)] min-w-[var(--cp-sidebar-width)] bg-[var(--cp-bg-sidebar)] border-r border-[var(--cp-border-subtle)] flex flex-col">
      {/* Project Selector */}
      <div className="p-3 pb-2 border-b border-[var(--cp-border-subtle)]">
        <div className="flex items-center gap-2 p-1.5 px-2 rounded-md cursor-pointer hover:bg-[var(--cp-bg-hover)] transition-colors">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#EEF0FF] to-[#DDE2FF] border border-[var(--cp-border-default)] flex items-center justify-center font-mono text-[11px] font-semibold text-[var(--cp-accent)]">{projAbbr}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-[var(--cp-text-primary)] truncate">{projName}</div>
            <div className="text-[10px] font-mono text-[var(--cp-text-tertiary)] truncate">{projDir || "未配置"}</div>
          </div>
          <span className="text-[10px] text-[var(--cp-text-tertiary)]">&#x25BE;</span>
        </div>
      </div>

      {/* Tab List */}
      <ScrollArea className="flex-1 py-2 px-1.5">
        <div className="text-[10px] font-semibold tracking-wider uppercase text-[var(--cp-text-tertiary)] px-2.5 py-1 mt-1">页签</div>
        {tabs.map((tab, idx) => (
          <TabItemRow key={tab.id} tab={tab} isActive={tab.id === activeTabId} isDragging={dragIdx === idx} isDragOver={dragOverIdx === idx} draggable={idx > 0}
            onClick={() => setActiveTab(tab.id)} onClose={() => removeTab(tab.id)}
            onDragStart={(e) => handleDragStart(e, idx)} onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)} onDragEnd={handleDragEnd} />
        ))}
        <button onClick={handleOpenTable} className="flex items-center gap-2 py-1.5 px-2.5 my-1 rounded-md cursor-pointer border border-dashed border-[var(--cp-border-default)] bg-transparent text-[var(--cp-text-tertiary)] text-[12px] w-full hover:border-[var(--cp-accent)] hover:text-[var(--cp-accent)] hover:bg-[var(--cp-accent-dim)] transition-all">
          <span className="text-[14px] font-light">+</span><span>打开表格</span>
        </button>
      </ScrollArea>

      {/* Bottom */}
      <div className="border-t border-[var(--cp-border-subtle)] p-1.5">
        <div onClick={handleOpenSettings} className="flex items-center gap-2 py-1.5 px-2.5 rounded-md cursor-pointer hover:bg-[var(--cp-bg-hover)] transition-colors">
          <div className="w-[18px] h-[18px] flex items-center justify-center text-[var(--cp-text-tertiary)]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
          </div>
          <span className="text-[12.5px] font-medium text-[var(--cp-text-secondary)]">设置</span>
        </div>
        <div className="flex items-center gap-2 py-1.5 px-2.5 rounded-md">
          <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-[var(--cp-accent)] to-[#6B83F2] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">{(userName || "?")[0]}</div>
          <span className="text-[12px] font-medium text-[var(--cp-text-secondary)] flex-1 truncate">{userName || "未登录"}</span>
          <button onClick={handleLogout} title="退出登录" className="w-[22px] h-[22px] flex items-center justify-center border-none bg-transparent text-[var(--cp-text-tertiary)] cursor-pointer rounded hover:bg-[var(--cp-error)] hover:text-white transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function TabItemRow({ tab, isActive, isDragging, isDragOver, draggable, onClick, onClose, onDragStart, onDragOver, onDrop, onDragEnd }: {
  tab: TabItem; isActive: boolean; isDragging: boolean; isDragOver: boolean; draggable: boolean
  onClick: () => void; onClose: () => void; onDragStart: (e: React.DragEvent) => void; onDragOver: (e: React.DragEvent) => void; onDrop: (e: React.DragEvent) => void; onDragEnd: () => void
}) {
  const iconMap: Record<string, React.ReactNode> = {
    workspace: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
    settings: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>,
    table_info: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
  }
  const defaultIcon = <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 5h18M3 12h18M3 19h18" /><path d="M9 5v14" /></svg>

  return (
    <div onClick={onClick} draggable={draggable} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} onDragEnd={onDragEnd}
      className={`group flex items-center gap-2 py-[7px] px-2.5 rounded-md cursor-pointer transition-all mb-px relative
        ${isActive ? "bg-[var(--cp-bg-active)]" : "hover:bg-[var(--cp-bg-hover)]"}
        ${isDragging ? "opacity-40" : ""} ${isDragOver ? "border-t-2 border-[var(--cp-accent)]" : ""}
        ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}>
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[var(--cp-accent)] rounded-r-sm" />}
      <div className={`w-[18px] h-[18px] flex items-center justify-center flex-shrink-0 ${isActive ? "text-[var(--cp-accent)]" : "text-[var(--cp-text-tertiary)]"}`}>
        {iconMap[tab.type] || defaultIcon}
      </div>
      <span className={`text-[12.5px] truncate flex-1 ${isActive ? "font-semibold text-[var(--cp-text-primary)]" : "font-medium text-[var(--cp-text-secondary)]"}`}>{tab.label}</span>
      {tab.closable && (
        <div onClick={(e) => { e.stopPropagation(); onClose() }} className="w-4 h-4 flex items-center justify-center text-[10px] text-[var(--cp-text-tertiary)] rounded-sm opacity-0 group-hover:opacity-100 hover:bg-[var(--cp-bg-active)] hover:text-[var(--cp-text-secondary)] transition-all flex-shrink-0">&times;</div>
      )}
    </div>
  )
}
