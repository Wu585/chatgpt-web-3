import {create} from 'zustand'

interface Message {
  content: string,
  role: "assistant" | "user"
  imageMessageSrc?: string
}

interface MessagesStore {
  messages: Message[]
  setMessages: (message: Message) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  resetMessages: () => void
}

export const useMessagesStore = create<MessagesStore>((set) => ({
  messages: [],
  setMessages: (message: Message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set(() => ({
    isLoading
  })),
  resetMessages: () => set(() => ({
    messages: []
  }))
}))
