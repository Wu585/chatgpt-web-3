import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "@/components/theme-provider"
import Home from "@/pages/Home.tsx";
import SignIn from "@/pages/SignIn.tsx";
import SignUp from "@/pages/SignUp.tsx";
import MainLayout from "@/components/MainLayout.tsx";
import Chat, {Message} from "@/components/Chat.tsx";
import Dall from "@/pages/Dall.tsx";
import Write from "@/pages/Write.tsx";
import {Toaster} from "@/components/ui/toaster"
import AuthNoLogin from "@/components/AuthNoLogin.tsx";
import {useChatList} from "@/hooks/useChatList.ts";
import {useUserStore} from "@/store/userStore.ts";
import {useEffect, useRef} from "react";
import {useWebSocketStore} from "@/store/useWebSocketStore.ts";
import {useMessagesStore} from "@/store/useMessagesStore.ts";
import {useRoleStore} from "@/store/useRoleStore.tsx";
import {useAjax} from "@/lib/ajax.ts";
import UserInfo from "@/pages/UserInfo.tsx";

function App() {
  const {data: chatList, mutate} = useChatList()
  const {user} = useUserStore()
  const {ws, setWs} = useWebSocketStore()
  const {post} = useAjax()

  const {setMessages, setIsLoading, isAudio, setIsAudio, setCurrentMessage} = useMessagesStore()
  const {setRoleMessage} = useRoleStore()

  useEffect(() => {
    if (user && chatList && chatList.length === 0) {
      console.log("初始化创建了会话")
      post<{
        msg: string
      }>('/sessionParentList/create', {
        name: "新对话",
        userId: user.id
      }).then(async () => {
        await mutate()
      })
    }
  }, [chatList])

  const newestMessageRef = useRef<Message>({
    content: "",
    role: "assistant"
  });

  let mergedBlob = new Blob()

  useEffect(() => {
    if (user) {
      console.log("websocket创建了")
      // setWs(new WebSocket(`ws:36.152.38.220:8000/api/websocket/${user?.id}`))
      setWs(new WebSocket(`ws:localhost:8000/api/websocket/${user?.id}`))
    }
    return () => {
      ws?.close()
    }
  }, [user, setWs])

  const wsEventHandlersRef = useRef({
    onopen: () => {
      console.log('ws open');
    },
    onclose: () => {
      console.log('ws close');
    },
    onmessage: (e: MessageEvent) => {
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
        console.log('isAudio');
        console.log(isAudio);
        // mutate()
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
  })

  useEffect(() => {
    if (ws) {
      console.log('isAudio');
      console.log(isAudio);
      console.log("websocket重新监听了")
      const {onopen, onclose, onmessage} = wsEventHandlersRef.current;
      ws.removeEventListener('open', onopen);
      ws.removeEventListener('close', onclose);
      ws.removeEventListener('message', onmessage);

      wsEventHandlersRef.current = {
        onopen: () => {
          console.log('ws open');
        },
        onclose: () => {
          console.log('ws close');
        },
        onmessage: (e: MessageEvent) => {
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
            console.log('isAudio');
            console.log(isAudio);
            // mutate()
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

      ws.addEventListener('open', wsEventHandlersRef.current.onopen);
      ws.addEventListener('close', wsEventHandlersRef.current.onclose);
      ws.addEventListener('message', wsEventHandlersRef.current.onmessage);
    }
  }, [ws, isAudio])

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <HashRouter>
        <Routes>
          <Route path={"/"} element={<AuthNoLogin>
            <MainLayout/>
          </AuthNoLogin>}>
            <Route path={""} element={<Navigate to={"home"}/>}/>
            <Route path={"home"} element={<Home/>}/>
            <Route path={"chat"}
                   element={<Navigate to={chatList && chatList[0] ? `/chat/${chatList[0].parentMessageId}` : ""}/>}/>
            <Route path={"chat/:chatId"} element={<Chat/>}/>
            <Route path={"dall"} element={<Dall/>}/>
            <Route path={"write"} element={<Write/>}/>
            <Route path={"userinfo"} element={<UserInfo/>}/>
          </Route>
          <Route path={"sign-in"} element={<SignIn/>}/>
          <Route path={"sign-up"} element={<SignUp/>}/>
        </Routes>
      </HashRouter>
      <Toaster/>
    </ThemeProvider>
  )
}

export default App
