import { create } from "zustand"

interface AppState {
  userName: string
  userAvatar: string
  hasUp: boolean
  upAnnounce: string
  updateUserName: (userName: string) => void
  updateUserAvatar: (userAvatar: string) => void
  updateHasUpdate: (hasUp: boolean) => void
  updateUpAnnounce: (upAnnounce: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  userName: "",
  userAvatar: "",
  hasUp: false,
  upAnnounce: "",
  updateUserName: (userName) => set({ userName }),
  updateUserAvatar: (userAvatar) => set({ userAvatar }),
  updateHasUpdate: (hasUp) => set({ hasUp }),
  updateUpAnnounce: (upAnnounce) => set({ upAnnounce }),
}))
