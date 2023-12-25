import {create} from 'zustand'

interface WriteStore {
  writeMessage: string
  setWriteMessage: (message: string) => void
}

export const useWriteMessageStore = create<WriteStore>((set) => ({
  writeMessage: "",
  setWriteMessage: (message) => set(() => ({
    writeMessage: message
  }))
}))
