import {create} from 'zustand'

interface Message {
  content: string,
  role: "assistant" | "user" | "system"
  imageMessageSrc?: string
  id?: string
}

interface MessagesStore {
  messages: Message[]
  setMessages: (message: Message) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  resetMessages: () => void
  updateAllMessages: (messages: Message[]) => void
  isAudio: boolean
  setIsAudio: (isAudio: boolean) => void
  currentMessage: Message
  setCurrentMessage: (message: Message) => void
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
  })),
  updateAllMessages: (messages) => set(() => ({
    messages
  })),
  isAudio: false,
  setIsAudio: (isAudio: boolean) => set(() => ({
    isAudio
  })),
  currentMessage: {
    content: "",
    role: "assistant"
  },
  setCurrentMessage: (message) => set(() => ({
    currentMessage: message
  }))
}))
