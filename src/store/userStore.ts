import {create} from 'zustand'

interface UserStore {
  user: {
    id: string
    username: string
  } | undefined
  setUser: (user: UserStore["user"]) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  setUser: (user) => set(() => ({
    user
  }))
}))
