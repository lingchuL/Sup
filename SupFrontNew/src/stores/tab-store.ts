import { create } from "zustand"
import { TabItem, TabType } from "@/lib/types"

interface TabState {
  tabs: TabItem[]
  activeTabId: string
  nextTabIndex: number

  addTab: (type: TabType, label?: string, data?: any) => string
  removeTab: (id: string) => void
  setActiveTab: (id: string) => void
  reorderTabs: (fromIndex: number, toIndex: number) => void
  updateTabLabel: (id: string, label: string) => void
  updateTabData: (id: string, data: any) => void
  getTab: (id: string) => TabItem | undefined
}

export const useTabStore = create<TabState>((set, get) => ({
  tabs: [
    {
      id: "workspace",
      type: "workspace" as TabType,
      label: "\u5de5\u4f5c\u533a",
      closable: false,
    },
  ],
  activeTabId: "workspace",
  nextTabIndex: 1,

  addTab: (type, label, data) => {
    const state = get()
    const idx = state.nextTabIndex
    const defaultLabels: Record<string, string> = {
      table_view: "\u8868\u683c\u89c6\u56fe",
      table_info: "\u8868\u4fe1\u606f",
      settings: "\u8bbe\u7f6e",
    }
    const id = `${type}_${idx}`
    const newTab: TabItem = {
      id,
      type,
      label: label ?? `${defaultLabels[type] ?? type} ${idx}`,
      closable: type !== "workspace",
      data,
    }
    set({
      tabs: [...state.tabs, newTab],
      activeTabId: id,
      nextTabIndex: idx + 1,
    })
    return id
  },

  removeTab: (id) => {
    const state = get()
    const idx = state.tabs.findIndex((t) => t.id === id)
    if (idx === -1) return
    const tab = state.tabs[idx]
    if (!tab.closable) return

    const newTabs = state.tabs.filter((t) => t.id !== id)
    let newActiveId = state.activeTabId
    if (state.activeTabId === id) {
      // Switch to adjacent tab
      const newIdx = Math.min(idx, newTabs.length - 1)
      newActiveId = newTabs[newIdx]?.id ?? "workspace"
    }
    set({ tabs: newTabs, activeTabId: newActiveId })
  },

  setActiveTab: (id) => set({ activeTabId: id }),

  reorderTabs: (fromIndex, toIndex) => {
    const state = get()
    // Don't reorder the workspace tab (index 0)
    if (fromIndex === 0 || toIndex === 0) return
    const newTabs = [...state.tabs]
    const [moved] = newTabs.splice(fromIndex, 1)
    newTabs.splice(toIndex, 0, moved)
    set({ tabs: newTabs })
  },

  updateTabLabel: (id, label) => {
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, label } : t)),
    }))
  },

  updateTabData: (id, data) => {
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, data: { ...t.data, ...data } } : t)),
    }))
  },

  getTab: (id) => {
    return get().tabs.find((t) => t.id === id)
  },
}))
