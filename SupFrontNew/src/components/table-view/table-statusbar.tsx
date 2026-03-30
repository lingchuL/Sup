"use client"

interface StatusBarProps {
  synced?: boolean
  selectedCell?: string
  changedCount?: number
  tableName?: string
  rowCount?: number
  colCount?: number
}

export function TableStatusBar({ synced = true, selectedCell, changedCount = 0, tableName, rowCount, colCount }: StatusBarProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-1 border-t border-[var(--cp-border-subtle)] bg-white text-[11px] text-[var(--cp-text-tertiary)] font-mono flex-shrink-0">
      <div className="flex items-center gap-1">
        <div className={`w-1.5 h-1.5 rounded-full ${synced ? "bg-[var(--cp-success)]" : "bg-[var(--cp-warning)]"}`} />
        <span>{synced ? "已同步" : "未保存"}</span>
      </div>
      {selectedCell && <span>选中: {selectedCell}</span>}
      <span>修改: {changedCount}</span>
      <span className="ml-auto">{tableName ? `${tableName} · ` : ""}{rowCount ?? "—"} 行 × {colCount ?? "—"} 列</span>
    </div>
  )
}
