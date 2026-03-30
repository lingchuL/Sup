import { create } from "zustand"
import { AntdOption } from "@/lib/types"

interface CoPiperState {
  projDir: string
  serverName: string
  tbOptions: AntdOption[]
  updateProjDir: (projDir: string) => void
  updateServerName: (serverName: string) => void
  updateTbOptions: (tbOptions: AntdOption[]) => void
}

export const useCoPiperStore = create<CoPiperState>((set) => ({
  projDir: "",
  serverName: "",
  tbOptions: [],
  updateProjDir: (projDir) => set({ projDir }),
  updateServerName: (serverName) => set({ serverName }),
  updateTbOptions: (tbOptions) => set({ tbOptions }),
}))
