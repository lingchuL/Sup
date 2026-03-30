import { create } from "zustand"
import { FromToItem } from "@/lib/types"

interface IdxMappingState {
  ptbFromTo: Record<string, Record<string, FromToItem>>
  ptbToFrom: Record<string, Record<string, FromToItem>>
  setMappings: (
    ptbFromTo: Record<string, Record<string, FromToItem>>,
    ptbToFrom: Record<string, Record<string, FromToItem>>
  ) => void
  setMapping: (ptb: string, rel_dir: string, idx_name: string, rid: string | number) => void
  getFromToByPtbIdx: (ptb: string, idx: string) => FromToItem | undefined
  getToFromByPtbId: (ptb: string, id: string | number) => FromToItem | undefined
  clearPtbMappings: (ptb: string) => void
}

export const useIdxMappingStore = create<IdxMappingState>((set, get) => ({
  ptbFromTo: {},
  ptbToFrom: {},

  setMappings: (ptbFromTo, ptbToFrom) => set({ ptbFromTo, ptbToFrom }),

  setMapping: (ptb, rel_dir, idx_name, rid) =>
    set((state) => {
      const item: FromToItem = { rel_dir, idx_name, rid }
      const idKey = String(rid)
      return {
        ptbFromTo: {
          ...state.ptbFromTo,
          [ptb]: { ...(state.ptbFromTo[ptb] || {}), [idx_name]: item },
        },
        ptbToFrom: {
          ...state.ptbToFrom,
          [ptb]: { ...(state.ptbToFrom[ptb] || {}), [idKey]: item },
        },
      }
    }),

  getFromToByPtbIdx: (ptb, idx) => get().ptbFromTo[ptb]?.[idx],
  getToFromByPtbId: (ptb, id) => get().ptbToFrom[ptb]?.[String(id)],

  clearPtbMappings: (ptb) =>
    set((state) => {
      const { [ptb]: _f, ...restFrom } = state.ptbFromTo
      const { [ptb]: _t, ...restTo } = state.ptbToFrom
      return { ptbFromTo: restFrom, ptbToFrom: restTo }
    }),
}))
