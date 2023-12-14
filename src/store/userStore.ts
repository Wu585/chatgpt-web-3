import {create} from 'zustand'

interface UserStore {
  user: {
    id: string
    username: string
  } | null
  setUser: (user: UserStore["user"]) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set(() => ({
    user
  }))
}))
