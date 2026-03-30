import { create } from "zustand"
import { HTableSOpData } from "@/lib/types"

// Per-tab data storage
interface TableDataState {
  tabDatas: Record<string, any>
  updateTabData: (tabKey: string, tabData: any) => void
  clearTabData: (tabKey: string) => void
}

export const useTableDataStore = create<TableDataState>((set) => ({
  tabDatas: {},
  updateTabData: (tabKey, tabData) =>
    set((state) => ({
      tabDatas: { ...state.tabDatas, [tabKey]: tabData },
    })),
  clearTabData: (tabKey) =>
    set((state) => {
      const { [tabKey]: _, ...rest } = state.tabDatas
      return { tabDatas: rest }
    }),
}))

// Table operation queue
interface TableOpState {
  opDatas: HTableSOpData[]
  updateOpDatas: (data: HTableSOpData[]) => void
}

export const useTableOpStore = create<TableOpState>((set) => ({
  opDatas: [],
  updateOpDatas: (opDatas) => set({ opDatas }),
}))
