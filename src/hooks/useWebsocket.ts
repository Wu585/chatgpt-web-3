import {useEffect, useRef} from "react";
import {useUserStore} from "@/store/userStore.ts";
import {useMessagesStore} from "@/store/useMessagesStore.ts";
import {Message} from "@/components/Chat.tsx";
import {useWriteMessageStore} from "@/store/useWriteMessageStore.ts";
import {useGetMessagesById} from "@/hooks/useGetMessagesById.ts";
import {useRoleStore} from "@/store/useRoleStore.tsx";

export const useRolePlayWebsocket = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const {user} = useUserStore()
  const {setWriteMessage} = useWriteMessageStore()
  const currentContentRef = useRef<Message>({
    content: "",
    role: "assistant"
  });

  useEffect(() => {
    if (user) {
      wsRef.current = new WebSocket(`ws:192.168.31.110:8000/api/websocket/${user.id}`);
      // wsRef.current = new WebSocket(`ws:172.16.131.165:8000/api/websocket/${user.id}`);
      // wsRef.current = new WebSocket(`ws:localhost:9527`);
      const ws = wsRef.current;
      ws.onopen = () => {
        console.log('ws open');
      };
      ws.onclose = () => {
        console.log('ws close');
      };
      ws.onmessage = (e) => {
        console.log(e.data);

        if (typeof e.data === "string" && e.data !== "end" && JSON.parse(e.data).content !== null) {
          const content = JSON.parse(e.data)
          currentContentRef.current.content += content.content
          setWriteMessage(currentContentRef.current.content)
        }
        if (e.data.size) {
          console.log("")
        }
        if (e.data === "end") {
          setTimeout(() => {
            currentContentRef.current.content = ""
          })
        }
      }
    }
  }, [user])
  return {ws: wsRef.current, currentContent: currentContentRef.current};
}

export const useWebsocket = ({isAudio, chatId}: { isAudio?: boolean, chatId?: string }) => {
  const wsRef = useRef<WebSocket | null>(null);
  const {user} = useUserStore()
  const {setMessages, setIsLoading} = useMessagesStore()
  const {setRoleMessage} = useRoleStore()

  const {mutate} = useGetMessagesById(chatId)

  const newestMessageRef = useRef<Message>({
    content: "",
    role: "assistant"
  });

  let mergedBlob = new Blob()

  useEffect(() => {
    if (user) {
      wsRef.current = new WebSocket(`ws:192.168.31.110:8000/api/websocket/${user.id}`);
      // wsRef.current = new WebSocket(`ws:172.16.131.165:8000/api/websocket/${user.id}`);
      // wsRef.current = new WebSocket(`ws:localhost:9527`);
      const ws = wsRef.current;
      ws.onopen = () => {
        console.log('ws open');
      };
      ws.onclose = () => {
        console.log('ws close');
      };
      ws.onmessage = (e) => {
        console.log(e.data);

        if (typeof e.data === "string" && e.data !== "end" && JSON.parse(e.data).content !== null) {
          const content = JSON.parse(e.data)
          newestMessageRef.current.content += content.content
        }
        if (e.data.size) {
          mergedBlob = new Blob([mergedBlob, e.data])
        }
        if (e.data === "end") {
          setMessages({
            role: "assistant",
            content: newestMessageRef.current.content
          })
          setIsLoading(false)
          setRoleMessage("")
          mutate()
          if (isAudio) {
            const audioElement = new Audio();
            // 将Audio元素的src设置为临时的URL
            audioElement.src = URL.createObjectURL(new Blob([mergedBlob]));
            // 播放音频
            audioElement.play();
          }
          mergedBlob = new Blob()
          setTimeout(() => {
            newestMessageRef.current.content = ""
          })
        }
      }
    }
  }, [user])
  return {ws: wsRef.current};
}
