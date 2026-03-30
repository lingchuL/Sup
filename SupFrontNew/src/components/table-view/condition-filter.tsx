"use client"

import { useState } from "react"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Select } from "@/components/ui"
import { TbColInfo } from "@/lib/types"

export interface ConditionData {
  cName: string
  qType: string
  qValue: string
}

const STR_QUERY_TYPES = [
  { value: "contain", label: "包含" },
  { value: "not_contain", label: "不包含" },
  { value: "start_with", label: "开头是" },
  { value: "end_with", label: "结尾是" },
  { value: "equal", label: "等于" },
  { value: "not_equal", label: "不等于" },
  { value: "empty", label: "为空" },
  { value: "not_empty", label: "不为空" },
]

const NUM_QUERY_TYPES = [
  { value: "gt", label: "大于" },
  { value: "lt", label: "小于" },
  { value: "gte", label: "大于等于" },
  { value: "lte", label: "小于等于" },
  { value: "equal", label: "等于" },
  { value: "not_equal", label: "不等于" },
  { value: "empty", label: "为空" },
  { value: "not_empty", label: "不为空" },
]

const BOOL_QUERY_TYPES = [
  { value: "equal", label: "等于" },
  { value: "not_equal", label: "不等于" },
  { value: "empty", label: "为空" },
  { value: "not_empty", label: "不为空" },
]

interface ConditionFilterProps {
  columns: TbColInfo[]
  conditions: ConditionData[]
  onChange: (conditions: ConditionData[]) => void
  allOrAny: "all" | "any"
  onAllOrAnyChange: (v: "all" | "any") => void
  onFilter: () => void
  enabled: boolean
  onEnabledChange: (v: boolean) => void
}

export function ConditionFilter({ columns, conditions, onChange, allOrAny, onAllOrAnyChange, onFilter, enabled, onEnabledChange }: ConditionFilterProps) {
  function addCondition() {
    onChange([...conditions, { cName: columns[0]?.name ?? "", qType: "contain", qValue: "" }])
  }

  function removeCondition(idx: number) {
    onChange(conditions.filter((_, i) => i !== idx))
  }

  function updateCondition(idx: number, field: keyof ConditionData, value: string) {
    const newConds = [...conditions]
    newConds[idx] = { ...newConds[idx], [field]: value }
    onChange(newConds)
  }

  function getQueryTypes(colName: string) {
    const col = columns.find((c) => c.name === colName)
    if (!col) return STR_QUERY_TYPES
    if (["int", "float"].includes(col.type)) return NUM_QUERY_TYPES
    if (col.type === "bool") return BOOL_QUERY_TYPES
    return STR_QUERY_TYPES
  }

  return (
    <div className="space-y-3 p-1">
      <div className="flex items-center gap-2 text-[12px]">
        <span className="text-[var(--cp-text-secondary)]">匹配以下</span>
        <Select
          value={allOrAny}
          onChange={(v) => onAllOrAnyChange(v as "all" | "any")}
          options={[
            { value: "all", label: "所有" },
            { value: "any", label: "任一" },
          ]}
          className="h-7 w-[80px] text-[12px]"
        />
        <span className="text-[var(--cp-text-secondary)]">条件</span>
      </div>

      {conditions.map((cond, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <Select
            value={cond.cName}
            onChange={(v) => updateCondition(idx, "cName", v)}
            options={columns.filter((c) => c.name && !c.name.startsWith("_sup")).map((c) => ({
              value: c.name, label: c.rname || c.name,
            }))}
            className="h-7 w-[120px] text-[11px]"
          />
          <Select
            value={cond.qType}
            onChange={(v) => updateCondition(idx, "qType", v)}
            options={getQueryTypes(cond.cName)}
            className="h-7 w-[90px] text-[11px]"
          />
          {!["empty", "not_empty"].includes(cond.qType) && (
            <Input value={cond.qValue} onChange={(e) => updateCondition(idx, "qValue", e.target.value)} className="h-7 w-[100px] text-[11px]" />
          )}
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-[var(--cp-text-tertiary)]" onClick={() => removeCondition(idx)}>x</Button>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="h-7 text-[11px]" onClick={addCondition}>+ 添加条件</Button>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-[11px] text-[var(--cp-text-secondary)] cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={(e) => onEnabledChange(e.target.checked)} className="w-3.5 h-3.5 rounded" />
            启用
          </label>
          <Button size="sm" className="h-7 text-[11px]" onClick={onFilter}>筛选</Button>
        </div>
      </div>
    </div>
  )
}
