"use client"

import { useState } from "react"
import { Modal, ModalTitle, ModalFooter } from "@/components/ui"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Label } from "@/components/ui"
import { Select } from "@/components/ui"
import { useCoPiperStore } from "@/stores/copiper-store"
import { CallPluginExec, PluginExecParams, CallCoPiperPost } from "@/lib/api"

const REL_DIR_PRESETS = ["basic", "JungoWorld", "Creata"]

export function AddTableModal() {
  const { projDir, updateTbOptions } = useCoPiperStore()
  const [open, setOpen] = useState(false)
  const [relDir, setRelDir] = useState("")
  const [fileName, setFileName] = useState("")
  const [tbName, setTbName] = useState("")
  const [sheetName, setSheetName] = useState("")
  const [from, setFrom] = useState("idx_name")
  const [idType, setIdType] = useState("int")
  const [idStartValue, setIdStartValue] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (!relDir || !fileName || !tbName || !sheetName) return
    setSubmitting(true)
    try {
      const dbKey = `${relDir}_${fileName}_${tbName}`
      const uuid = crypto.randomUUID()
      const ptb = tbName.includes("@") ? tbName.split("@")[1] : tbName
      const tbInfo: Record<string, any> = {
        rel_dir: relDir, file_name: fileName, tb_name: tbName,
        sheet_name: sheetName, from, id_type: idType, id_: uuid, ptb,
        ...(idType === "int" ? { id_start_value: idStartValue } : {}),
      }
      const params = new PluginExecParams("copiper_data", "add_tb", `db_key=${dbKey}|proj_dir=${projDir}`, JSON.stringify({ tb_info: tbInfo }))
      await CallPluginExec(params)
      await refreshOptions()
      setOpen(false)
      resetForm()
    } catch (e) {
      console.error(e)
    }
    setSubmitting(false)
  }

  async function refreshOptions() {
    const p = new PluginExecParams("copiper_data", "form_cascader_options", `proj_dir=${projDir}`)
    const res = await CallPluginExec(p)
    try {
      const data = JSON.parse(res)
      if (Array.isArray(data.result)) updateTbOptions(data.result)
    } catch {}
  }

  function resetForm() {
    setRelDir(""); setFileName(""); setTbName(""); setSheetName("")
    setFrom("idx_name"); setIdType("int"); setIdStartValue(1)
  }

  return (
    <>
      <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={() => setOpen(true)}>新增表格</Button>
      <Modal open={open} onOpenChange={setOpen} className="max-w-lg">
        <ModalTitle>新增表格</ModalTitle>
        <div className="space-y-3 py-2">
          <Field label="相对路径">
            <Input value={relDir} onChange={(e) => setRelDir(e.target.value)} placeholder="basic" list="reldir-presets" className="h-8 text-[12.5px]" />
            <datalist id="reldir-presets">{REL_DIR_PRESETS.map((d) => <option key={d} value={d} />)}</datalist>
          </Field>
          <Field label="表名称">
            <Input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="4_常量表" className="h-8 text-[12.5px]" />
          </Field>
          <Field label="表功能名">
            <Input value={tbName} onChange={(e) => setTbName(e.target.value)} placeholder="FishSystem@ConstData" className="h-8 text-[12.5px]" />
          </Field>
          <Field label="表备注名">
            <Input value={sheetName} onChange={(e) => setSheetName(e.target.value)} placeholder="Excel sheet名" className="h-8 text-[12.5px]" />
          </Field>
          <Field label="本表索引列">
            <Select
              value={from}
              onChange={setFrom}
              options={[
                { value: "idx_name", label: "idx_name" },
                { value: "id", label: "id" },
              ]}
              className="h-8 text-[12.5px]"
            />
          </Field>
          <Field label="ID 类型">
            <Select
              value={idType}
              onChange={setIdType}
              options={[
                { value: "int", label: "int" },
                { value: "str", label: "str" },
              ]}
              className="h-8 text-[12.5px]"
            />
          </Field>
          {idType === "int" && (
            <Field label="ID 起始值">
              <Input type="number" min={1} value={idStartValue} onChange={(e) => setIdStartValue(Number(e.target.value))} className="h-8 text-[12.5px] w-[120px]" />
            </Field>
          )}
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={handleSubmit} disabled={submitting || !relDir || !fileName || !tbName || !sheetName}>
            {submitting ? "创建中..." : "创建"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[80px_1fr] items-center gap-2">
      <Label className="text-[12px] text-[var(--cp-text-secondary)] text-right">{label}</Label>
      <div>{children}</div>
    </div>
  )
}
