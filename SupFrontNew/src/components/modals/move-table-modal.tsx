"use client"

import { useState } from "react"
import { Modal, ModalTitle, ModalFooter } from "@/components/ui"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Label } from "@/components/ui"
import { TablePicker } from "@/components/form-inputs/table-picker"
import { useCoPiperStore } from "@/stores/copiper-store"
import { CallPluginExec, PluginExecParams } from "@/lib/api"

const REL_DIR_PRESETS = ["basic", "JungoWorld", "Creata"]

export function MoveTableModal() {
  const { projDir, updateTbOptions } = useCoPiperStore()
  const [open, setOpen] = useState(false)
  const [casVs, setCasVs] = useState<string[]>([])
  const [newRelDir, setNewRelDir] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const dbKey = casVs.join("_")

  async function handleMove() {
    if (!dbKey || !newRelDir) return
    setSubmitting(true)
    try {
      const params = new PluginExecParams("copiper_data", "move_tb", `db_key=${dbKey}|proj_dir=${projDir}|new_rel_dir=${newRelDir}`)
      await CallPluginExec(params)
      const p2 = new PluginExecParams("copiper_data", "form_cascader_options", `proj_dir=${projDir}`)
      const res = await CallPluginExec(p2)
      try { const d = JSON.parse(res); if (Array.isArray(d.result)) updateTbOptions(d.result) } catch {}
      setCasVs([])
      setOpen(false)
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={() => setOpen(true)}>移动表格</Button>
      <Modal open={open} onOpenChange={setOpen} className="max-w-md">
        <ModalTitle>移动表格</ModalTitle>
        <div className="space-y-3 py-2">
          <TablePicker value={casVs} onChange={setCasVs} />
          {dbKey && (
            <div className="grid grid-cols-[80px_1fr] items-center gap-2">
              <Label className="text-[12px] text-[var(--cp-text-secondary)] text-right">目标目录</Label>
              <Input value={newRelDir} onChange={(e) => setNewRelDir(e.target.value)} placeholder="要移动到的目录" list="move-presets" className="h-8 text-[12.5px]" />
              <datalist id="move-presets">{REL_DIR_PRESETS.map((d) => <option key={d} value={d} />)}</datalist>
            </div>
          )}
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
          <Button variant="destructive" onClick={handleMove} disabled={submitting || !dbKey || !newRelDir}>
            {submitting ? "移动中..." : "确认"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
