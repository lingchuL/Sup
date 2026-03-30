"use client"

import { useState, useRef, useEffect } from "react"
import { HotTableClass } from "@handsontable/react"
import { Sheet } from "@/components/ui"
import { TableToolbar } from "./table-toolbar"
import { TableGrid } from "./table-grid"
import { TableStatusBar } from "./table-statusbar"
import { BatchExportDialog } from "./batch-export"
import { useTabStore } from "@/stores/tab-store"
import { useCoPiperStore } from "@/stores/copiper-store"
import { useAppStore } from "@/stores/app-store"
import { CallPluginExec, CallPluginSSE, PluginExecParams } from "@/lib/api"
import { TbData, TbColInfo } from "@/lib/types"
import { ConditionData } from "./condition-filter"

interface TablePageProps {
  tabKey: string
}

export function TablePage({ tabKey }: TablePageProps) {
  const { projDir } = useCoPiperStore()
  const { userName } = useAppStore()
  const { addTab, updateTabLabel } = useTabStore()
  const hotRef = useRef<HotTableClass>(null)

  const [casVs, setCasVs] = useState<string[]>([])
  const [tbData, setTbData] = useState<TbData | null>(null)
  const [hash, setHash] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searching, setSearching] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportStage, setExportStage] = useState("")
  const [isFiltering, setIsFiltering] = useState(false)
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [hiddenRows, setHiddenRows] = useState<number[]>([])
  const [errorCells, setErrorCells] = useState<string[]>([])
  const [errorComments, setErrorComments] = useState<Record<string, string>>({})
  const [selectedCell, setSelectedCell] = useState("")
  const [changedCount, setChangedCount] = useState(0)
  const [extends_, setExtends] = useState<{ label: string; value: string }[]>([])
  const [batchOpen, setBatchOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerTitle, setDrawerTitle] = useState("")
  const [drawerType, setDrawerType] = useState<"ckv" | "kv" | "tstr" | "">("")

  const dbKey = casVs.join("_")
  const columns = tbData?.columns ?? []
  const fixedTopRow = tbData?.rows?.[0]?.["#"] === "#" ? 1 : 0

  useEffect(() => {
    if (casVs.length >= 3 && projDir) {
      loadTableData()
      loadExtends()
    }
  }, [casVs, projDir])

  // ─── Load table data (PluginExec: copiper_data / get_tb_data_htbale) ───
  async function loadTableData() {
    if (!dbKey || !projDir) return
    setLoading(true)
    try {
      const p = new PluginExecParams("copiper_data", "get_tb_data_htbale", `db_key=${dbKey}|proj_dir=${projDir}`)
      const res = await CallPluginExec(p)
      const resp: { columns: TbColInfo[]; rows: any[]; h_cols: any[]; hash?: string; status_code: string } = JSON.parse(res)
      if (resp.columns && resp.rows) {
        setTbData({ columns: resp.columns, rows: resp.rows } as TbData)
        setHash(resp.hash ?? "")
        setChangedCount(0)
        // Update tab label
        const label = casVs[casVs.length - 1] || "表格"
        updateTabLabel(tabKey, label)
      }
    } catch (e) {
      console.error("Failed to load table data:", e)
    }
    setLoading(false)
  }

  // ─── Save table data (PluginExec: copiper_data / save_tb_data) ───
  async function handleSave() {
    if (!tbData || !dbKey) return
    setSaving(true)
    try {
      const p = new PluginExecParams(
        "copiper_data",
        "save_tb_data",
        `db_key=${dbKey}|proj_dir=${projDir}`,
        JSON.stringify({ tb_data: { columns: tbData.columns, rows: tbData.rows?.slice(fixedTopRow) } })
      )
      const res = await CallPluginExec(p)
      const resp: { hash: string; status_code: string } = JSON.parse(res)
      setHash(resp.hash)
      setChangedCount(0)
    } catch (e) {
      console.error("Save failed:", e)
    }
    setSaving(false)
  }

  // ─── Search (PluginExec: copiper_data / search_v) ───
  async function handleSearch(query: string) {
    if (!query || !dbKey) return
    setSearching(true)
    try {
      // Save search history
      const ph = new PluginExecParams("copiper_personal", "put_db_key_last_search", `db_key=${dbKey}|search_v=${query}`)
      CallPluginExec(ph)

      // Perform search
      const p = new PluginExecParams("copiper_data", "search_v", `db_key=${dbKey}|proj_dir=${projDir}|search_v=${query}`)
      const res = await CallPluginExec(p)
      const resp: { result: { row: number; key: string; value: any }[]; status_code: number } = JSON.parse(res)
      if (resp.result) {
        const results = resp.result.map((r) => `${r.row}_${columns.findIndex((c) => c.name === r.key)}`)
        setSearchResults(results.filter((r) => !r.endsWith("_-1")))
      }
    } catch (e) {
      console.error("Search failed:", e)
    }
    setSearching(false)
  }

  function handleNextResult() {
    if (!hotRef.current?.hotInstance || searchResults.length === 0) return
    const hot = hotRef.current.hotInstance
    const [row, col] = searchResults[0].split("_").map(Number)
    hot.scrollViewportTo(row, col)
    hot.selectCell(row, col)
  }

  function handleFilterToggle() {
    setIsFiltering(!isFiltering)
    if (isFiltering) setHiddenRows([])
  }

  function handleConditionFilter(conditions: ConditionData[], allOrAny: "all" | "any") {
    if (!tbData?.rows || conditions.length === 0) return
    const hidden: number[] = []
    tbData.rows.forEach((row, idx) => {
      if (idx < fixedTopRow) return
      const results = conditions.map((cond) => {
        const val = String(row[cond.cName] ?? "")
        switch (cond.qType) {
          case "contain": return val.includes(cond.qValue)
          case "not_contain": return !val.includes(cond.qValue)
          case "start_with": return val.startsWith(cond.qValue)
          case "end_with": return val.endsWith(cond.qValue)
          case "equal": return val === cond.qValue
          case "not_equal": return val !== cond.qValue
          case "empty": return val === ""
          case "not_empty": return val !== ""
          case "gt": return Number(val) > Number(cond.qValue)
          case "lt": return Number(val) < Number(cond.qValue)
          case "gte": return Number(val) >= Number(cond.qValue)
          case "lte": return Number(val) <= Number(cond.qValue)
          default: return true
        }
      })
      const match = allOrAny === "all" ? results.every(Boolean) : results.some(Boolean)
      if (!match) hidden.push(idx)
    })
    setHiddenRows(hidden)
  }

  function handleAddRow() {
    if (!hotRef.current?.hotInstance) return
    const hot = hotRef.current.hotInstance
    hot.alter("insert_row_below", hot.countRows() - 1)
  }

  function handleDeleteRow() {
    if (!hotRef.current?.hotInstance) return
    const hot = hotRef.current.hotInstance
    const selected = hot.getSelected()
    if (selected && selected.length > 0) hot.alter("remove_row", selected[0][0])
  }

  function handleAfterChange(changes: any, source: string) {
    if (source === "loadData") return
    if (changes) setChangedCount((c) => c + changes.length)
  }

  function handleSelectionChange(row: number, col: number) {
    setSelectedCell(`R${row + 1} C${col + 1}`)
  }

  // ─── Export one (SSE: copiper_export / export_one_stream) ───
  async function handleExportOne() {
    if (!dbKey) return
    setExporting(true)
    setExportStage("准备中...")
    const params = new Map<string, string>([
      ["action", "plugin_exec_sse"],
      ["name", "copiper_export"],
      ["func", "export_one_stream"],
      ["args", `db_key=${dbKey}|proj_dir=${projDir}`],
    ])
    await CallPluginSSE(params, (data) => {
      try {
        const resp: { type: string; stage?: string; result?: boolean; info?: string; r_c_e?: any[] } = JSON.parse(data)
        if (resp.type === "stage") setExportStage(resp.stage ?? "")
        else if (resp.type === "result") {
          if (resp.r_c_e && resp.r_c_e.length > 0) {
            setErrorCells(resp.r_c_e.map((e: any) => `${e[0]}_${e[1]}`))
            const comments: Record<string, string> = {}
            resp.r_c_e.forEach((e: any) => { if (e[2]) comments[`${e[0]}_${e[1]}`] = e[2] })
            setErrorComments(comments)
          }
        }
      } catch {}
    })
    setExporting(false)
    setExportStage("")
  }

  // ─── Load extends (PluginExec: copiper_extends / get_all_extends) ───
  async function loadExtends() {
    try {
      const p = new PluginExecParams("copiper_extends", "get_all_extends", `db_key=${dbKey}|proj_dir=${projDir}`)
      const res = await CallPluginExec(p)
      const resp: { status_code: number; result: any[] } = JSON.parse(res)
      if (resp.result && Array.isArray(resp.result)) {
        setExtends(resp.result.map((item: any) => ({ label: item.label || item.key || "", value: String(item.key ?? "") })))
      }
    } catch {}
  }

  // ─── Execute extend (PluginExec: copiper_extends / exec_extend) ───
  async function handleExtendsExec(funcKey: string) {
    const p = new PluginExecParams("copiper_extends", "exec_extend", `db_key=${dbKey}|proj_dir=${projDir}|key=${funcKey}`)
    await CallPluginExec(p)
  }

  function handleOpenTableInfo() {
    addTab("table_info", `表信息 ${casVs[casVs.length - 1] || ""}`, { casVs, dbKey })
  }

  return (
    <div className="flex flex-col h-full">
      <TableToolbar
        tabKey={tabKey} casVs={casVs} onCasVsChange={setCasVs} columns={columns}
        onSearch={handleSearch} onNextResult={handleNextResult} onFilterToggle={handleFilterToggle}
        isFiltering={isFiltering} onConditionFilter={handleConditionFilter} onSave={handleSave}
        onAddRow={handleAddRow} onDeleteRow={handleDeleteRow} onRefresh={loadTableData}
        onOpenTableInfo={handleOpenTableInfo} onExportOne={handleExportOne}
        onBatchExport={() => setBatchOpen(true)} onExtendsExec={handleExtendsExec}
        saving={saving} searching={searching} exporting={exporting} exportStage={exportStage}
        rceCount={errorCells.length} onNextError={() => {
          if (errorCells.length > 0 && hotRef.current?.hotInstance) {
            const [r, c] = errorCells[0].split("_").map(Number)
            hotRef.current.hotInstance.scrollViewportTo(r, c)
            hotRef.current.hotInstance.selectCell(r, c)
          }
        }}
        extends_={extends_} rowCount={tbData?.rows?.length} colCount={columns.length}
      />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-[var(--cp-text-tertiary)] text-[13px]">加载中...</div>
      ) : (
        <TableGrid
          data={tbData!} fixedTopRow={fixedTopRow} readOnlyRow={fixedTopRow}
          searchResults={searchResults} errorCells={errorCells} errorComments={errorComments}
          hiddenRows={hiddenRows}
          hasImg={columns.some((c) => c.type === "img" || c.name?.includes("cover") || c.name?.includes("icon"))}
          onAfterChange={handleAfterChange} onSelectionChange={handleSelectionChange} hotRef={hotRef}
        />
      )}
      <TableStatusBar synced={changedCount === 0} selectedCell={selectedCell} changedCount={changedCount}
        tableName={dbKey ? `${casVs[casVs.length - 1] || ""}.jdb` : undefined}
        rowCount={tbData?.rows?.length} colCount={columns.length} />
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen} title={drawerTitle} side="right" width="500px">
        {drawerType === "ckv" && <div>CKV 编辑器</div>}
        {drawerType === "kv" && <div>KV 编辑器</div>}
        {drawerType === "tstr" && <div>多语言编辑器</div>}
      </Sheet>
      <BatchExportDialog open={batchOpen} onOpenChange={setBatchOpen} changedDbKeys={[]} allDbKeys={[]} />
    </div>
  )
}
