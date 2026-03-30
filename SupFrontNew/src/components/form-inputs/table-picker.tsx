"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui"
import { Popover } from "@/components/ui"
import { ScrollArea } from "@/components/ui"
import { useCoPiperStore } from "@/stores/copiper-store"
import { CallCoPiperPost } from "@/lib/api"
import { AntdOption } from "@/lib/types"

interface TablePickerProps {
  value: string[]
  onChange: (values: string[]) => void
  showRefresh?: boolean
  size?: "sm" | "default"
}

export function TablePicker({ value, onChange, showRefresh, size = "default" }: TablePickerProps) {
  const { tbOptions, projDir, updateTbOptions } = useCoPiperStore()
  const [open, setOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [level, setLevel] = useState(0)
  const [path, setPath] = useState<string[]>([])
  const [search, setSearch] = useState("")

  const displayText = value.length > 0 ? value.join(" / ") : "选择表格..."

  // Get current level options
  const currentOptions = useMemo(() => {
    let opts = tbOptions
    for (let i = 0; i < path.length; i++) {
      const found = opts.find((o) => o.value === path[i])
      if (found?.children) opts = found.children
      else return []
    }
    return opts
  }, [tbOptions, path])

  // Filter by search
  const filteredOptions = useMemo(() => {
    if (!search) return currentOptions
    return currentOptions.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
  }, [currentOptions, search])

  function handleSelect(opt: AntdOption) {
    const newPath = [...path, opt.value]
    if (opt.children && opt.children.length > 0) {
      setPath(newPath)
      setLevel(level + 1)
      setSearch("")
    } else {
      onChange(newPath)
      setOpen(false)
      setPath([])
      setLevel(0)
      setSearch("")
    }
  }

  function handleBack() {
    if (path.length > 0) {
      setPath(path.slice(0, -1))
      setLevel(level - 1)
      setSearch("")
    }
  }

  function handleOpenChange(o: boolean) {
    setOpen(o)
    if (!o) {
      setPath([])
      setLevel(0)
      setSearch("")
    }
  }

  async function handleRefresh() {
    if (!projDir || refreshing) return
    setRefreshing(true)
    try {
      const params = new Map<string, string>()
      params.set("action", "get_tb_cascader_options")
      params.set("proj_dir", projDir)
      const res = await CallCoPiperPost(params, new FormData())
      const data = JSON.parse(res)
      if (data.options) updateTbOptions(data.options)
    } catch {}
    setRefreshing(false)
  }

  const h = size === "sm" ? "h-7 text-[12px]" : "h-8 text-[13px]"

  const triggerButton = (
    <Button variant="outline" className={`${h} justify-start font-normal flex-1 min-w-[180px] truncate`} onClick={() => handleOpenChange(!open)}>
      <span className="truncate">{displayText}</span>
    </Button>
  )

  return (
    <div className="flex gap-1">
      <Popover
        trigger={triggerButton}
        open={open}
        onOpenChange={handleOpenChange}
        align="start"
        width="320px"
      >
        <div className="flex flex-col">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索表格..."
            className="w-full px-3 py-2 text-[12px] border-b border-[var(--cp-border-subtle)] outline-none bg-transparent"
            autoFocus
          />
          <ScrollArea className="max-h-[260px]">
            {path.length > 0 && (
              <div
                onClick={handleBack}
                className="flex items-center gap-1 px-3 py-2 text-[12px] text-[var(--cp-text-tertiary)] hover:bg-[var(--cp-bg-hover)] cursor-pointer"
              >
                <span>&larr;</span> 返回上级
              </div>
            )}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-4 text-[12px] text-[var(--cp-text-tertiary)] text-center">未找到</div>
            )}
            {filteredOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className="flex items-center px-3 py-2 text-[12px] hover:bg-[var(--cp-bg-hover)] cursor-pointer"
              >
                <span className="flex-1 truncate">{opt.label}</span>
                {opt.children && opt.children.length > 0 && (
                  <span className="text-[var(--cp-text-tertiary)] text-[11px]">&rsaquo;</span>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      </Popover>
      {showRefresh && (
        <Button variant="outline" size="icon" className={h} onClick={handleRefresh} disabled={refreshing}>
          <svg className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
        </Button>
      )}
    </div>
  )
}
