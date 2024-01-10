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
    return () => {
      wsRef.current?.close()
    }
  }, [user])
  return {ws: wsRef.current, currentContent: currentContentRef.current};
}

export const useWebsocket1 = ({chatId}: { chatId?: string }) => {
  const wsRef = useRef<WebSocket | null>(null);
  const {user} = useUserStore()
  const {setMessages, setIsLoading, isAudio, setIsAudio, setCurrentMessage} = useMessagesStore()
  const {setRoleMessage} = useRoleStore()

  const {mutate} = useGetMessagesById(chatId)

  const newestMessageRef = useRef<Message>({
    content: "",
    role: "assistant"
  });

  let mergedBlob = new Blob()

  useEffect(() => {
    if (user) {
      console.log("ws重新生成了");
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
          setIsLoading(false)
          newestMessageRef.current.content += content.content
          setCurrentMessage({
            role: "assistant",
            content: newestMessageRef.current.content
          })
        }

        if (typeof e.data === "string" && e.data !== "end" && JSON.parse(e.data).content === null) {
          setCurrentMessage({
            role: "assistant",
            content: ""
          })
          setMessages({
            role: "assistant",
            content: newestMessageRef.current.content
          })
          setIsLoading(false)
          setRoleMessage("")
        }

        if (e.data.size) {
          mergedBlob = new Blob([mergedBlob, e.data])
        }

        if (e.data === "end") {
          mutate()
          if (isAudio) {
            console.log("生成语音中...")
            const audioElement = new Audio();
            // 将Audio元素的src设置为临时的URL
            audioElement.src = URL.createObjectURL(new Blob([mergedBlob]));
            // 播放音频
            audioElement.play();
          }
          mergedBlob = new Blob()
          setTimeout(() => {
            newestMessageRef.current.content = ""
            setIsAudio(false)
          })
        }
      }
    }
    return () => {
      console.log("上一个websocket关闭了")
      wsRef.current?.close()
    }
  }, [user])
  return {ws: wsRef.current};
}

export const useWebsocket = ({chatId}: { chatId?: string }) => {
  const wsRef = useRef<WebSocket | null>(null);
  const {user} = useUserStore()
  const {setMessages, setIsLoading, isAudio, setIsAudio, setCurrentMessage} = useMessagesStore()
  const {setRoleMessage} = useRoleStore()

  const {mutate} = useGetMessagesById(chatId)

  const newestMessageRef = useRef<Message>({
    content: "",
    role: "assistant"
  });

  let mergedBlob = new Blob()

  useEffect(() => {
    if (user) {
      console.log("ws重新生成了");
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
          setIsLoading(false)
          newestMessageRef.current.content += content.content
          setCurrentMessage({
            role: "assistant",
            content: newestMessageRef.current.content
          })
        }

        if (typeof e.data === "string" && e.data !== "end" && JSON.parse(e.data).content === null) {
          setCurrentMessage({
            role: "assistant",
            content: ""
          })
          setMessages({
            role: "assistant",
            content: newestMessageRef.current.content
          })
          setIsLoading(false)
          setRoleMessage("")
        }

        if (e.data.size) {
          mergedBlob = new Blob([mergedBlob, e.data])
        }

        if (e.data === "end") {
          mutate()
          if (isAudio) {
            console.log("生成语音中...")
            const audioElement = new Audio();
            // 将Audio元素的src设置为临时的URL
            audioElement.src = URL.createObjectURL(new Blob([mergedBlob]));
            // 播放音频
            audioElement.play();
          }
          mergedBlob = new Blob()
          setTimeout(() => {
            newestMessageRef.current.content = ""
            setIsAudio(false)
          })
        }
      }
    }
    return () => {
      console.log("上一个websocket关闭了")
      wsRef.current?.close()
    }
  }, [user])
  return {ws: wsRef.current};
}
