"use client"

import dynamic from "next/dynamic"
import { useTabStore } from "@/stores/tab-store"
import { WorkspacePage } from "@/components/workspace/workspace-page"
import { SettingsPage } from "@/components/settings/settings-page"

// Dynamic import for TablePage (uses Handsontable which needs browser APIs)
const TablePage = dynamic(
  () => import("@/components/table-view/table-page").then((m) => ({ default: m.TablePage })),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center text-[var(--cp-text-tertiary)]">加载表格组件...</div> }
)

const TableInfoPage = dynamic(
  () => import("@/components/table-info/table-info-page").then((m) => ({ default: m.TableInfoPage })),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center text-[var(--cp-text-tertiary)]">加载表信息...</div> }
)

export function TabContent() {
  const { tabs, activeTabId } = useTabStore()
  const activeTab = tabs.find((t) => t.id === activeTabId)

  if (!activeTab) return null

  switch (activeTab.type) {
    case "workspace":
      return <WorkspacePage />
    case "table_view":
      return <TablePage tabKey={activeTab.id} />
    case "table_info":
      return <TableInfoPage tabKey={activeTab.id} data={activeTab.data} />
    case "settings":
      return <SettingsPage />
    default:
      return null
  }
}
