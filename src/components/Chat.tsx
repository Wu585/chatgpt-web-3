import ChatMessage from "@/components/ChatMessage.tsx";
import FormInput from "@/components/FormInput.tsx";
import {ChangeEvent, ElementRef, FormEvent, useEffect, useRef, useState} from "react";
import {useMessagesStore} from "@/store/useMessagesStore.ts";
import {useWebsocket} from "@/hooks/useWebsocket.ts";
import {useModelStore} from "@/store/useModelStore.tsx";
import {Delete, Edit, MessageCircle} from "lucide-react";
import {Progress} from "@/components/ui/progress.tsx";

export interface Message {
  content: string
  role: "assistant" | "user"
}

const Chat = () => {
  const {messages, setMessages, isLoading, setIsLoading} = useMessagesStore()
  const {model} = useModelStore()

  const [value, setValue] = useState('')
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  const scrollRef = useRef<ElementRef<"div">>(null)

  const {ws} = useWebsocket()

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({behavior: "smooth"})
  }, [messages.length])
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    setMessages({
      role: "user",
      content: value
    })
    e.preventDefault()
    ws?.send(JSON.stringify({
      role: 1,
      content: value,
      semantics: true,
      model,
    }))
    setValue('')
  }

  return (
    <div className={"h-full flex w-full"}>
      <aside className={"hidden md:flex w-[260px] max-w-[260px] border-2 flex-col justify-between"}>
        <div className={"flex h-14 items-center bg-white px-4 dark:bg-[#18181c] justify-center"}>
          <div className={"border-2 px-8 py-1 rounded-md cursor-pointer"}>+ 新对话</div>
        </div>
        <div className={"min-h-0 flex-1 overflow-hidden overflow-y-auto px-4 py-4 "}>
          <div className={"flex border-2 justify-between py-2 rounded-md px-2 cursor-pointer"}>
            <div className={" flex"}>
              <MessageCircle className={"w-4"}/>
              <span>新对话</span>
            </div>
            <div className={"flex space-x-1"}>
              <Edit className={"w-4"}/>
              <Delete className={"w-4"}/>
            </div>
          </div>
        </div>
        <div className={"side-wallet-box border-t p-4 dark:border-t-neutral-800"}>
          余额1800 (80%)
          <Progress value={80} className={"border-2"}/>
        </div>
      </aside>
      <div className={"flex h-full flex-col justify-between w-full"}>
        <header className={"relative z-20 border-b dark:border-b-neutral-800"}>
          <div className={"m-auto flex h-14 max-w-screen-2xl items-center justify-between px-4"}>
            <div className={"flex min-w-0 flex-1 items-center space-x-2 overflow-hidden pr-2"}>
              <h2 className={"overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold"}>对话标题！</h2>
            </div>
          </div>
        </header>
        <main className={"px-4 flex-1 overflow-auto"}>
          {messages.length === 0 && <div className={"flex justify-center items-center h-full flex-col"}>
              <h2 className={"mb-6 rounded px-4 py-2 text-center text-3xl font-bold"}>AI聊天机器人</h2>
              <div className={"w-full flex items-center justify-center space-x-6"}>
                  <span>写文案</span>
                  <span>生活质感</span>
                  <span>职场助手</span>
              </div>
          </div>}
          {messages.map((message, index) => <ChatMessage key={index} {...message}/>)}
          {isLoading && <ChatMessage role={"assistant"} isLoading={isLoading}/>}
          <div ref={scrollRef}/>
        </main>
        <footer>
          <FormInput input={value} handleInputChange={handleInputChange} onSubmit={onSubmit} isLoading={false}/>
        </footer>
      </div>
    </div>
  );
}

export default Chat

