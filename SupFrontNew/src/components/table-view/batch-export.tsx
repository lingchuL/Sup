"use client"

import { useState, useEffect } from "react"
import { Modal, ModalTitle } from "@/components/ui"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { ScrollArea } from "@/components/ui"
import { Checkbox } from "@/components/ui"
import { Progress } from "@/components/ui"
import { useCoPiperStore } from "@/stores/copiper-store"
import { CallPluginExec, CallPluginSSE, PluginExecParams } from "@/lib/api"

interface BatchExportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  changedDbKeys: string[]
  allDbKeys: string[]
}

interface ExportItem {
  key: string
  title: string
  isExporting: boolean
  exportSuccess: string // "" | "true" | "false"
}

export function BatchExportDialog({ open, onOpenChange, changedDbKeys, allDbKeys }: BatchExportProps) {
  const { projDir } = useCoPiperStore()
  const [items, setItems] = useState<ExportItem[]>([])
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState("")
  const [progress, setProgress] = useState(0)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const newItems = allDbKeys.map((k) => ({
      key: k, title: k, isExporting: false, exportSuccess: "",
    }))
    setItems(newItems)
    setSelectedKeys(new Set(changedDbKeys))
  }, [allDbKeys, changedDbKeys])

  const filtered = items.filter((i) => !search || i.title.toLowerCase().includes(search.toLowerCase()))
  const unselected = filtered.filter((i) => !selectedKeys.has(i.key))
  const selected = filtered.filter((i) => selectedKeys.has(i.key))

  function toggleItem(key: string) {
    const s = new Set(selectedKeys)
    if (s.has(key)) s.delete(key); else s.add(key)
    setSelectedKeys(s)
  }

  async function handleExport() {
    if (selectedKeys.size === 0) return
    setExporting(true)
    setProgress(0)
    const keys = Array.from(selectedKeys)
    // Mark as exporting
    setItems((prev) => prev.map((i) => selectedKeys.has(i.key) ? { ...i, isExporting: true, exportSuccess: "" } : i))

    const params = new Map<string, string>()
    params.set("action", "plugin_exec")
    params.set("name", "copiper_export")
    params.set("func", "export_some")
    params.set("args", `db_keys=${keys.join(",").replaceAll("#", "--_--")}|proj_dir=${projDir}`)

    await CallPluginSSE(params, (data) => {
      try {
        const d = JSON.parse(data)
        if (d.db_key) {
          setItems((prev) => prev.map((i) => i.key === d.db_key ? { ...i, isExporting: false, exportSuccess: d.success ? "true" : "false" } : i))
        }
        if (d.progress) setProgress(d.progress)
      } catch {}
    })
    setExporting(false)
  }

  async function handleClear() {
    setSelectedKeys(new Set())
    const p = new PluginExecParams("copiper_personal", "clear_changed_db_keys")
    await CallPluginExec(p)
  }

  async function handleCommit() {
    const p = new PluginExecParams("copiper_svn", "commit")
    await CallPluginExec(p)
  }

  async function handleUpdateAndExport() {
    const p = new PluginExecParams("copiper_svn", "update")
    await CallPluginExec(p)
    await handleExport()
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-3xl max-h-[85vh]">
      <ModalTitle>批量转表</ModalTitle>
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索表格..." className="h-8 text-[12px] mb-2" />
      <div className="grid grid-cols-2 gap-3 min-h-[400px]">
        {/* Left: Available */}
        <div className="border border-[var(--cp-border-subtle)] rounded-lg overflow-hidden">
          <div className="bg-[var(--cp-bg-sidebar)] px-3 py-2 text-[11px] font-semibold text-[var(--cp-text-secondary)] border-b border-[var(--cp-border-subtle)]">
            不转表列表 ({unselected.length})
          </div>
          <ScrollArea className="h-[350px]">
            {unselected.map((item) => (
              <div key={item.key} onClick={() => toggleItem(item.key)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--cp-bg-hover)] cursor-pointer text-[12px]">
                <Checkbox checked={false} />
                <span className="truncate">{item.title}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
        {/* Right: Selected */}
        <div className="border border-[var(--cp-border-subtle)] rounded-lg overflow-hidden">
          <div className="bg-[var(--cp-bg-sidebar)] px-3 py-2 text-[11px] font-semibold text-[var(--cp-text-secondary)] border-b border-[var(--cp-border-subtle)]">
            需转表列表 ({selected.length})
          </div>
          <ScrollArea className="h-[350px]">
            {selected.map((item) => (
              <div key={item.key} onClick={() => toggleItem(item.key)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--cp-bg-hover)] cursor-pointer text-[12px]">
                <Checkbox checked={true} />
                <span className="truncate flex-1">{item.title}</span>
                {item.isExporting && <span className="text-[var(--cp-accent)] animate-spin text-[10px]">&#x25cf;</span>}
                {item.exportSuccess === "true" && <span className="text-[var(--cp-success)]">&#x2713;</span>}
                {item.exportSuccess === "false" && <span className="text-[var(--cp-error)]">&#x2717;</span>}
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
      {exporting && <Progress value={progress} className="h-1.5" />}
      <div className="flex gap-2 justify-end mt-2">
        <Button variant="outline" size="sm" onClick={handleClear}>清空</Button>
        <Button variant="outline" size="sm" onClick={handleCommit}>提交</Button>
        <Button size="sm" onClick={handleExport} disabled={exporting || selectedKeys.size === 0}>
          {exporting ? "转表中..." : "转表"}
        </Button>
        <Button size="sm" onClick={handleUpdateAndExport} disabled={exporting || selectedKeys.size === 0}>
          更新并转表
        </Button>
      </div>
    </Modal>
  )
}
