"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Popover } from "@/components/ui"
import { Dropdown, DropdownItem, DropdownSub, DropdownSeparator } from "@/components/ui"
import { TablePicker } from "@/components/form-inputs/table-picker"
import { ConditionFilter, ConditionData } from "@/components/table-view/condition-filter"
import { TbColInfo } from "@/lib/types"
import { CallPluginExec, CallPluginSSE, PluginExecParams } from "@/lib/api"
import { useCoPiperStore } from "@/stores/copiper-store"
import { explorerOpenFile } from "@/lib/auth-utils"

interface TableToolbarProps {
  tabKey: string
  casVs: string[]
  onCasVsChange: (vs: string[]) => void
  columns: TbColInfo[]
  onSearch: (query: string) => void
  onNextResult: () => void
  onFilterToggle: () => void
  isFiltering: boolean
  onConditionFilter: (conditions: ConditionData[], allOrAny: "all" | "any") => void
  onSave: () => void
  onAddRow: () => void
  onDeleteRow: () => void
  onRefresh: () => void
  onOpenTableInfo: () => void
  onExportOne: () => void
  onBatchExport: () => void
  onExtendsExec: (funcName: string) => void
  saving: boolean
  searching: boolean
  exporting: boolean
  exportStage: string
  rceCount: number
  onNextError: () => void
  extends_: { label: string; value: string }[]
  rowCount?: number
  colCount?: number
}

export function TableToolbar(props: TableToolbarProps) {
  const { projDir } = useCoPiperStore()
  const [searchText, setSearchText] = useState("")
  const [condFilterOpen, setCondFilterOpen] = useState(false)
  const [conditions, setConditions] = useState<ConditionData[]>([])
  const [condAllOrAny, setCondAllOrAny] = useState<"all" | "any">("all")
  const [condEnabled, setCondEnabled] = useState(false)
  const dbKey = props.casVs.join("_")

  function handleSearch() {
    props.onSearch(searchText)
  }

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-[var(--cp-border-subtle)] bg-white flex-shrink-0 flex-wrap">
      {/* Save / Add / Delete */}
      <div className="flex items-center gap-1">
        <Button size="sm" className="h-7 text-[11px] gap-1" onClick={props.onSave} disabled={props.saving}>
          <SaveIcon />{props.saving ? "保存中..." : "保存"}
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1" onClick={props.onAddRow}>
          <PlusIcon />添加行
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1" onClick={props.onDeleteRow}>
          <TrashIcon />删除行
        </Button>
      </div>

      <Sep />

      {/* Table Picker + Info */}
      <TablePicker value={props.casVs} onChange={props.onCasVsChange} showRefresh size="sm" />
      <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={props.onOpenTableInfo}>
        表信息
      </Button>

      <Sep />

      {/* Search */}
      <div className="flex items-center gap-1">
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="搜索..."
          className="h-7 w-[140px] text-[11px]"
        />
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleSearch} title="搜索">
          <SearchIcon />
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={props.onNextResult} title="下一个">
          <ArrowDownIcon />
        </Button>
        <Button variant={props.isFiltering ? "default" : "outline"} size="icon" className="h-7 w-7" onClick={props.onFilterToggle} title="仅显示搜索结果">
          <FilterIcon />
        </Button>
      </div>

      {/* Condition Filter */}
      <Popover
        trigger={
          <Button variant="outline" size="icon" className="h-7 w-7" title="条件筛选">
            <GroupIcon />
          </Button>
        }
        open={condFilterOpen}
        onOpenChange={setCondFilterOpen}
        align="start"
        width="420px"
      >
        <div className="p-3">
          <ConditionFilter
            columns={props.columns}
            conditions={conditions}
            onChange={setConditions}
            allOrAny={condAllOrAny}
            onAllOrAnyChange={setCondAllOrAny}
            onFilter={() => { props.onConditionFilter(conditions, condAllOrAny); setCondFilterOpen(false) }}
            enabled={condEnabled}
            onEnabledChange={setCondEnabled}
          />
        </div>
      </Popover>

      {/* Error navigation */}
      {props.rceCount > 0 && (
        <div className="flex items-center gap-1">
          <span className="text-[var(--cp-error)] text-[11px]">&#x26A0; {props.rceCount}</span>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={props.onNextError} title="下一个错误">
            <ArrowDownIcon />
          </Button>
        </div>
      )}

      {/* Status */}
      {props.searching && <span className="text-[11px] text-[var(--cp-text-tertiary)] animate-pulse">搜索中...</span>}
      {props.saving && <span className="text-[11px] text-[var(--cp-text-tertiary)] animate-pulse">保存中...</span>}

      <div className="flex-1" />

      {/* Export */}
      <Button size="sm" className="h-7 text-[11px]" onClick={props.onExportOne} disabled={props.exporting}>
        {props.exporting ? props.exportStage || "转表中..." : "转表"}
      </Button>
      <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={props.onBatchExport}>
        批量
      </Button>

      {/* Extends */}
      {props.extends_.length > 0 && (
        <Dropdown
          trigger={
            <Button variant="outline" size="sm" className="h-7 text-[11px]">扩展</Button>
          }
        >
          {props.extends_.map((ext) => (
            <DropdownItem key={ext.value} onClick={() => props.onExtendsExec(ext.value)}>
              {ext.label}
            </DropdownItem>
          ))}
        </Dropdown>
      )}

      {/* Refresh */}
      <Button variant="outline" size="icon" className="h-7 w-7" onClick={props.onRefresh} title="刷新">
        <RefreshIcon />
      </Button>

      {/* More Menu */}
      <Dropdown
        trigger={
          <Button variant="outline" size="icon" className="h-7 w-7" title="更多">
            <MoreIcon />
          </Button>
        }
        align="end"
      >
        <DropdownSub label="Excel 操作">
          <DropdownItem onClick={() => {
            const p = new PluginExecParams("copiper_data", "import_excel", `db_key=${dbKey}|proj_dir=${projDir}`)
            CallPluginExec(p)
          }}>从对应 Excel 导入</DropdownItem>
          <DropdownItem onClick={() => {
            const p = new PluginExecParams("copiper_data", "open_excel", `db_key=${dbKey}|proj_dir=${projDir}`)
            CallPluginExec(p)
          }}>打开对应 Excel</DropdownItem>
        </DropdownSub>
        <DropdownSub label="关联文件">
          <DropdownItem onClick={() => {
            const p = new PluginExecParams("copiper_data", "get_jdb_path", `db_key=${dbKey}|proj_dir=${projDir}`)
            CallPluginExec(p).then((r) => { try { const d = JSON.parse(r); explorerOpenFile(JSON.parse(d.result)) } catch {} })
          }}>打开 JDB 文件</DropdownItem>
          <DropdownItem onClick={() => {
            const p = new PluginExecParams("copiper_export", "get_export_py_path", `db_key=${dbKey}|proj_dir=${projDir}`)
            CallPluginExec(p).then((r) => { try { const d = JSON.parse(r); explorerOpenFile(JSON.parse(d.result)) } catch {} })
          }}>打开导出 py</DropdownItem>
        </DropdownSub>
        <DropdownSeparator />
        <DropdownSub label="SVN 操作">
          <DropdownItem onClick={() => {
            const p = new PluginExecParams("copiper_svn", "update_tb_files", `db_key=${dbKey}|proj_dir=${projDir}`)
            CallPluginExec(p)
          }}>更新表相关文件</DropdownItem>
          <DropdownItem onClick={() => {
            const p = new PluginExecParams("copiper_svn", "update_and_commit_tb_files", `db_key=${dbKey}|proj_dir=${projDir}`)
            CallPluginExec(p)
          }}>更新并提交</DropdownItem>
          <DropdownItem onClick={() => {
            const p = new PluginExecParams("copiper_svn", "revert_tb_files", `db_key=${dbKey}|proj_dir=${projDir}`)
            CallPluginExec(p)
          }}>还原表相关文件</DropdownItem>
        </DropdownSub>
      </Dropdown>

      {/* Badge */}
      <span className="text-[10px] font-mono text-[var(--cp-text-tertiary)] ml-1">
        {props.rowCount ?? "—"} 行 · {props.colCount ?? "—"} 列
      </span>
    </div>
  )
}

function Sep() {
  return <div className="w-px h-[18px] bg-[var(--cp-border-default)] mx-1" />
}

// Inline SVG icons (small, consistent)
function SaveIcon() { return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /></svg> }
function PlusIcon() { return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg> }
function TrashIcon() { return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg> }
function SearchIcon() { return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg> }
function ArrowDownIcon() { return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg> }
function FilterIcon() { return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg> }
function GroupIcon() { return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg> }
function RefreshIcon() { return <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg> }
function MoreIcon() { return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg> }
