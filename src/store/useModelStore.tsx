import {create} from 'zustand'

interface UserStore {
  model: "gpt-3.5-turbo" | "gpt-4-1106-preview"
  setModel: (model: UserStore["model"]) => void
}

export const useModelStore = create<UserStore>((set) => ({
  model: "gpt-3.5-turbo",
  setModel: (model) => set(() => ({
    model
  }))
}))
