"use client"

import { useState } from "react"
import { Modal, ModalTitle, ModalFooter } from "@/components/ui"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Label } from "@/components/ui"
import { TablePicker } from "@/components/form-inputs/table-picker"
import { useCoPiperStore } from "@/stores/copiper-store"
import { CallPluginExec, PluginExecParams } from "@/lib/api"

export function RenameTableModal() {
  const { projDir, updateTbOptions } = useCoPiperStore()
  const [open, setOpen] = useState(false)
  const [casVs, setCasVs] = useState<string[]>([])
  const [renamed, setRenamed] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const dbKey = casVs.join("_")

  function handleSelect(vs: string[]) {
    setCasVs(vs)
    setRenamed([...vs])
  }

  async function handleRename() {
    if (!dbKey || renamed.length < 3) return
    setSubmitting(true)
    try {
      const newDbKey = renamed.join("_")
      const params = new PluginExecParams("copiper_data", "rename_tb", `db_key=${dbKey}|proj_dir=${projDir}|new_db_key=${newDbKey}`)
      await CallPluginExec(params)
      const p2 = new PluginExecParams("copiper_data", "form_cascader_options", `proj_dir=${projDir}`)
      const res = await CallPluginExec(p2)
      try { const d = JSON.parse(res); if (Array.isArray(d.result)) updateTbOptions(d.result) } catch {}
      setCasVs(renamed)
      setOpen(false)
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={() => setOpen(true)}>重命名</Button>
      <Modal open={open} onOpenChange={setOpen} className="max-w-md">
        <ModalTitle>重命名表格</ModalTitle>
        <div className="space-y-3 py-2">
          <TablePicker value={casVs} onChange={handleSelect} />
          {casVs.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-[60px_1fr] items-center gap-2">
                <Label className="text-[11px] text-[var(--cp-text-tertiary)] text-right">目录</Label>
                <Input value={renamed[0] || ""} disabled className="h-7 text-[12px] font-mono" />
              </div>
              <div className="grid grid-cols-[60px_1fr] items-center gap-2">
                <Label className="text-[11px] text-[var(--cp-text-tertiary)] text-right">文件名</Label>
                <Input value={renamed[1] || ""} onChange={(e) => setRenamed([renamed[0], e.target.value, renamed[2]])} className="h-7 text-[12px] font-mono" />
              </div>
              <div className="grid grid-cols-[60px_1fr] items-center gap-2">
                <Label className="text-[11px] text-[var(--cp-text-tertiary)] text-right">表名</Label>
                <Input value={renamed[2] || ""} onChange={(e) => setRenamed([renamed[0], renamed[1], e.target.value])} className="h-7 text-[12px] font-mono" />
              </div>
            </div>
          )}
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={handleRename} disabled={submitting || !dbKey}>
            {submitting ? "重命名中..." : "确认"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
