import {create} from 'zustand'
import {MutableRefObject} from "react";

interface WebSocketStore {
  ws: WebSocket | null
  setWs: (ws: WebSocket) => void,
  wsRef?: MutableRefObject<WebSocket | null>,
  setWsRef?: (wsRef: WebSocketStore["wsRef"]) => void
}

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  ws: null,
  setWs: (ws) => set(() => ({
    ws
  })),
  /*wsRef: useRef(null),
  setWsRef: (wsRef) => set(() => ({
    wsRef
  }))*/
}))
