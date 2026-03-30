"use client"

import { useState } from "react"
import { Modal, ModalTitle, ModalFooter } from "@/components/ui"
import { Button } from "@/components/ui"
import { TablePicker } from "@/components/form-inputs/table-picker"
import { useCoPiperStore } from "@/stores/copiper-store"
import { CallPluginExec, PluginExecParams } from "@/lib/api"

export function DeleteTableModal() {
  const { projDir, updateTbOptions } = useCoPiperStore()
  const [open, setOpen] = useState(false)
  const [casVs, setCasVs] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const dbKey = casVs.join("_")

  async function handleDelete() {
    if (!dbKey) return
    setSubmitting(true)
    try {
      const params = new PluginExecParams("copiper_data", "del_tb", `db_key=${dbKey}|proj_dir=${projDir}`)
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
      <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={() => setOpen(true)}>删除表格</Button>
      <Modal open={open} onOpenChange={setOpen} className="max-w-md">
        <ModalTitle>删除表格</ModalTitle>
        <div className="py-3">
          <TablePicker value={casVs} onChange={setCasVs} />
          {dbKey && <p className="text-[11px] text-[var(--cp-text-tertiary)] mt-2 font-mono">{dbKey}</p>}
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={submitting || !dbKey}>
            {submitting ? "删除中..." : "删除"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
