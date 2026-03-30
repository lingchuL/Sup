"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Label } from "@/components/ui"
import { Tabs } from "@/components/ui"
import { ScrollArea } from "@/components/ui"
import { TablePicker } from "@/components/form-inputs/table-picker"
import { useCoPiperStore } from "@/stores/copiper-store"
import { CallPluginExec, PluginExecParams, CallCoPiperPost } from "@/lib/api"
import { TbColInfo } from "@/lib/types"

interface TableInfoPageProps {
  tabKey: string
  data?: { casVs?: string[]; dbKey?: string }
}

export function TableInfoPage({ tabKey, data }: TableInfoPageProps) {
  const { projDir } = useCoPiperStore()
  const [casVs, setCasVs] = useState<string[]>(data?.casVs || [])
  const [baseInfo, setBaseInfo] = useState<any>(null)
  const [columns, setColumns] = useState<TbColInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("base")

  const dbKey = casVs.join("_")

  useEffect(() => {
    if (casVs.length >= 3 && projDir) loadInfo()
  }, [casVs, projDir])

  async function loadInfo() {
    setLoading(true)
    try {
      const params = new Map<string, string>()
      params.set("action", "get_tb_info")
      params.set("db_key", dbKey)
      params.set("proj_dir", projDir)
      const res = await CallCoPiperPost(params, new FormData())
      const data = JSON.parse(res)
      if (data.tb_info) setBaseInfo(data.tb_info)
      if (data.columns) setColumns(data.columns)
    } catch (e) {
      console.error("Failed to load table info:", e)
    }
    setLoading(false)
  }

  async function handleSaveBase() {
    if (!baseInfo || !dbKey) return
    setSaving(true)
    try {
      const p = new PluginExecParams(
        "copiper_data", "update_tb_info",
        `db_key=${dbKey}|proj_dir=${projDir}`,
        JSON.stringify({ tb_info: baseInfo })
      )
      await CallPluginExec(p)
    } catch (e) {
      console.error("Save failed:", e)
    }
    setSaving(false)
  }

  async function handleSaveColumns() {
    if (!columns.length || !dbKey) return
    setSaving(true)
    try {
      const p = new PluginExecParams(
        "copiper_data", "update_tb_columns",
        `db_key=${dbKey}|proj_dir=${projDir}`,
        JSON.stringify({ columns })
      )
      await CallPluginExec(p)
    } catch (e) {
      console.error("Save columns failed:", e)
    }
    setSaving(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[var(--cp-border-subtle)] bg-white flex-shrink-0">
        <TablePicker value={casVs} onChange={setCasVs} showRefresh size="sm" />
        {dbKey && <span className="text-[11px] font-mono text-[var(--cp-text-tertiary)]">{dbKey}</span>}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-[var(--cp-text-tertiary)]">加载中...</div>
      ) : !dbKey ? (
        <div className="flex-1 flex items-center justify-center text-[var(--cp-text-tertiary)]">请选择表格</div>
      ) : (
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          tabs={[
            { value: "base", label: "基础信息" },
            { value: "columns", label: "列定义" },
          ]}
        >
          {activeTab === "base" && (
            <div className="flex-1 overflow-auto px-4 pb-4">
              <ScrollArea className="h-full">
                {baseInfo && (
                  <div className="max-w-lg space-y-3 py-4">
                    <InfoField label="相对路径" value={baseInfo.rel_dir} onChange={(v) => setBaseInfo({ ...baseInfo, rel_dir: v })} disabled />
                    <InfoField label="表名称" value={baseInfo.file_name || casVs[1]} disabled />
                    <InfoField label="表功能名" value={baseInfo.tb_name || casVs[2]} disabled />
                    <InfoField label="表标题" value={baseInfo.sheet_name ?? ""} onChange={(v) => setBaseInfo({ ...baseInfo, sheet_name: v })} />
                    <InfoField label="表描述" value={baseInfo.desc ?? ""} onChange={(v) => setBaseInfo({ ...baseInfo, desc: v })} multiline />
                    <InfoField label="next_id_base" value={String(baseInfo.next_id_base ?? "")} onChange={(v) => setBaseInfo({ ...baseInfo, next_id_base: Number(v) })} />
                    <InfoField label="auto_divide_num" value={String(baseInfo.auto_divide_num ?? "")} onChange={(v) => setBaseInfo({ ...baseInfo, auto_divide_num: Number(v) })} />
                    <Button onClick={handleSaveBase} disabled={saving} className="mt-4">
                      {saving ? "保存中..." : "保存基础信息"}
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </div>
          )}

          {activeTab === "columns" && (
            <div className="flex-1 overflow-auto px-4 pb-4">
              <ScrollArea className="h-full">
                <div className="py-4">
                  <div className="border border-[var(--cp-border-subtle)] rounded-lg overflow-hidden">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="bg-[var(--cp-bg-sidebar)] border-b border-[var(--cp-border-subtle)]">
                          <th className="px-3 py-2 text-left font-semibold text-[var(--cp-text-secondary)]">名称 (name)</th>
                          <th className="px-3 py-2 text-left font-semibold text-[var(--cp-text-secondary)]">显示名 (rname)</th>
                          <th className="px-3 py-2 text-left font-semibold text-[var(--cp-text-secondary)]">类型 (type)</th>
                          <th className="px-3 py-2 text-left font-semibold text-[var(--cp-text-secondary)]">必填</th>
                          <th className="px-3 py-2 text-left font-semibold text-[var(--cp-text-secondary)]">默认值</th>
                          <th className="px-3 py-2 text-left font-semibold text-[var(--cp-text-secondary)]">转出</th>
                          <th className="px-3 py-2 text-left font-semibold text-[var(--cp-text-secondary)]">描述</th>
                        </tr>
                      </thead>
                      <tbody>
                        {columns.map((col, idx) => (
                          <tr key={idx} className="border-b border-[var(--cp-border-subtle)] hover:bg-[var(--cp-bg-hover)]">
                            <td className="px-3 py-1.5 font-mono text-[11px]">{col.name}</td>
                            <td className="px-3 py-1.5">{col.rname}</td>
                            <td className="px-3 py-1.5 font-mono text-[11px]">{col.type}</td>
                            <td className="px-3 py-1.5">{col.req_or_opt}</td>
                            <td className="px-3 py-1.5 font-mono text-[11px]">{col.default_v}</td>
                            <td className="px-3 py-1.5">{col.c_type}</td>
                            <td className="px-3 py-1.5 text-[var(--cp-text-tertiary)]">{col.rdesc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button onClick={handleSaveColumns} disabled={saving} className="mt-4">
                    {saving ? "保存中..." : "保存列定义"}
                  </Button>
                </div>
              </ScrollArea>
            </div>
          )}
        </Tabs>
      )}
    </div>
  )
}

function InfoField({ label, value, onChange, disabled, multiline }: {
  label: string; value: string; onChange?: (v: string) => void; disabled?: boolean; multiline?: boolean
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-2">
      <Label className="text-[12px] text-[var(--cp-text-secondary)] text-right pt-1.5">{label}</Label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="h-20 px-3 py-1.5 border border-input rounded-md text-[12px] font-mono resize-none disabled:opacity-50"
        />
      ) : (
        <Input value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled} className="h-8 text-[12px] font-mono" />
      )}
    </div>
  )
}
