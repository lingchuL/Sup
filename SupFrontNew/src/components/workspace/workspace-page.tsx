"use client"

import { useState } from "react"
import { Input } from "@/components/ui"
import { Button } from "@/components/ui"
import { useCoPiperStore } from "@/stores/copiper-store"
import { useTabStore } from "@/stores/tab-store"
import { AddTableModal } from "@/components/modals/add-table-modal"
import { DeleteTableModal } from "@/components/modals/delete-table-modal"
import { RenameTableModal } from "@/components/modals/rename-table-modal"
import { MoveTableModal } from "@/components/modals/move-table-modal"
import { AdvancedActions } from "@/components/workspace/advanced-actions"
import { openDirDialog } from "@/lib/auth-utils"
import { CallPluginExec, CallClientAction, PluginExecParams } from "@/lib/api"

export function WorkspacePage() {
  const { projDir, tbOptions, updateProjDir, updateTbOptions } = useCoPiperStore()
  const { tabs, addTab } = useTabStore()
  const [projInput, setProjInput] = useState(projDir)

  const projName = projDir ? projDir.split(/[/\\]/).filter(Boolean).pop() ?? "Project" : "未选择"
  const tableCount = tbOptions.reduce((sum, g) => sum + (g.children?.reduce((s2, f) => s2 + (f.children?.length ?? 0), 0) ?? 0), 0)
  const openCount = tabs.filter((t) => t.type === "table_view").length

  async function handleSetProjDir(dir: string) {
    updateProjDir(dir)
    setProjInput(dir)
    // Save setting
    try {
      const sp = new Map<string, string>([["action", "set_setting"], ["name", "copiper_project_dir"], ["value", dir]])
      CallClientAction(sp, new FormData())
    } catch {}
    // Load table options via form_cascader_options
    try {
      const p = new PluginExecParams("copiper_data", "form_cascader_options", `proj_dir=${dir}`)
      const res = await CallPluginExec(p)
      const resp: { result: any; status_code: number } = JSON.parse(res)
      if (Array.isArray(resp.result)) updateTbOptions(resp.result)
    } catch {}
  }

  return (
    <div className="p-8 px-10 overflow-y-auto flex-1">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-[var(--cp-text-primary)] tracking-tight">工作区</h1>
        <p className="text-[13px] text-[var(--cp-text-tertiary)]">
          当前项目 &middot; {projName} &middot; 共 {tableCount} 张表
        </p>
      </div>

      {/* Project Directory */}
      <div className="mb-6 flex gap-2 items-center">
        <Input
          value={projInput}
          onChange={(e) => setProjInput(e.target.value)}
          onBlur={() => projInput && handleSetProjDir(projInput)}
          onKeyDown={(e) => e.key === "Enter" && projInput && handleSetProjDir(projInput)}
          placeholder="项目目录路径..."
          className="h-8 text-[12px] font-mono flex-1"
        />
        <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => openDirDialog((d) => setProjInput(d), handleSetProjDir)}>
          选择
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-8">
        <StatCard value={String(tableCount)} label="数据表" />
        <StatCard value="—" label="总行数" />
        <StatCard value={String(openCount)} label="已打开" />
        <StatCard value="—" label="上次编辑" />
      </div>

      {/* Recent Tables - placeholder */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[12px] font-semibold tracking-wider uppercase text-[var(--cp-text-tertiary)]">最近使用</h2>
        </div>
        <div className="text-[13px] text-[var(--cp-text-tertiary)] py-8 text-center border border-dashed border-[var(--cp-border-default)] rounded-lg">
          暂无最近使用的表格
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-7">
        <h2 className="text-[12px] font-semibold tracking-wider uppercase text-[var(--cp-text-tertiary)] mb-3">快捷操作</h2>
        <div className="grid grid-cols-3 gap-2">
          <QuickAction icon={<PlusIcon />} title="打开表格" desc="从数据库中选择表格打开" onClick={() => addTab("table_view")} />
          <QuickAction icon={<DownloadIcon />} title="批量导出" desc="将选中表格导出为文件" />
          <QuickAction icon={<CodeIcon />} title="切换项目" desc="切换到其他工作目录" />
        </div>
      </div>

      {/* Table CRUD */}
      <div className="mb-7">
        <h2 className="text-[12px] font-semibold tracking-wider uppercase text-[var(--cp-text-tertiary)] mb-3">表格管理</h2>
        <div className="flex gap-2 flex-wrap">
          <AddTableModal />
          <DeleteTableModal />
          <RenameTableModal />
          <MoveTableModal />
        </div>
      </div>

      {/* Advanced Actions (collapsible) */}
      <AdvancedActions />
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 bg-white border border-[var(--cp-border-subtle)] rounded-lg p-4 px-[18px] hover:border-[var(--cp-border-default)] transition-colors">
      <div className="text-[24px] font-bold text-[var(--cp-text-primary)] font-mono tracking-tight">{value}</div>
      <div className="text-[11px] font-medium text-[var(--cp-text-tertiary)] mt-0.5 uppercase tracking-wider">{label}</div>
    </div>
  )
}

function QuickAction({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="p-3.5 px-4 rounded-lg border border-[var(--cp-border-subtle)] bg-white cursor-pointer hover:border-[var(--cp-border-default)] hover:bg-[var(--cp-bg-elevated)] hover:-translate-y-px transition-all">
      <div className="text-[var(--cp-text-tertiary)] mb-2">{icon}</div>
      <div className="text-[12.5px] font-semibold text-[var(--cp-text-primary)] mb-0.5">{title}</div>
      <div className="text-[11px] text-[var(--cp-text-tertiary)] leading-snug">{desc}</div>
    </div>
  )
}

function PlusIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
}
function DownloadIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
}
function CodeIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
}
