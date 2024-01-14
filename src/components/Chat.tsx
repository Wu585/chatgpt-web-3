import ChatMessage from "@/components/ChatMessage.tsx";
import FormInput from "@/components/FormInput.tsx";
import {ChangeEvent, ChangeEventHandler, ElementRef, FormEvent, useEffect, useRef, useState} from "react";
import {useMessagesStore} from "@/store/useMessagesStore.ts";
import {Delete, Edit, Menu, MessageCircle} from "lucide-react";
import {Progress} from "@/components/ui/progress.tsx";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {cn} from "@/lib/utils.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useAjax} from "@/lib/ajax.ts";
import {useToast} from "@/components/ui/use-toast.ts";
import {useGetMessagesById} from "@/hooks/useGetMessagesById.ts";
import {useChatList} from "@/hooks/useChatList.ts";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet.tsx";

export interface Message {
  content: string
  role: "assistant" | "user" | "system"
}

export interface Chat {
  id: string
  title: string
}

const Chat = () => {
  const {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    updateAllMessages,
    currentMessage,
    setIsAudio
  } = useMessagesStore()

  const {toast} = useToast()
  const navigate = useNavigate()

  const [currentChat, setCurrentChat] = useState<Chat | null>(null)

  const urlParams = useParams()

  const [value, setValue] = useState('')
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const scrollRef = useRef<ElementRef<"div">>(null)
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({behavior: "smooth"})
  }, [messages.length])

  // const {ws} = useWebsocket({chatId: urlParams.chatId})

  const createEvent = (value: string, chatId?: string) => {
    console.log('createEvent')
    return new EventSource(`/api/messages/stream?role=user&content=${value}&model=gpt-3.5-turbo&chatId=${chatId}`)
  }

  const eventSourceRef = useRef<EventSource | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {

    setIsLoading(true)
    setIsAudio(false)
    setMessages({
      role: "user",
      content: value
    })
    e.preventDefault()

    // 如果已经存在eventSource，则先关闭它
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // 创建新的eventSource
    eventSourceRef.current = createEvent(value, urlParams.chatId);

    eventSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data).data
      console.log(data);
      if (data === "END") {
        eventSourceRef.current?.close()
      }
    }

    setValue('')
  }

  useEffect(() => {
    // 在组件卸载时关闭eventSource
    return () => {
      if (eventSourceRef.current) {
        console.log("close222")
        eventSourceRef.current.close();
      }
    };
  }, []);

  const {post, patch, destroy} = useAjax()

  const {data: chatList, mutate} = useChatList()

  const [nameValue, setNameValue] = useState("")

  const {data: currentMessages, mutate: mutateMessages} = useGetMessagesById(urlParams.chatId)

  useEffect(() => {
    if (!urlParams.chatId && chatList) {
      navigate(`chat/${chatList[0].id}`)
    }
  }, [urlParams.chatId, chatList]);

  useEffect(() => {
    if (currentMessages) {
      updateAllMessages(currentMessages)
    }
  }, [currentMessages])

  useEffect(() => {
    // url有就找到；没有的话就是删除后选择列表剩下的第一个
    if (chatList) {
      setCurrentChat(chatList.find(item => item.id === urlParams.chatId) || chatList[0])
    }
  }, [chatList, urlParams.chatId])

  const onCreateChat = async (title = "新对话") => {
    const {data} = await post<Chat>('/chats', {title})
    // setCurrentRole(null)
    navigate(`/chat/${data.id}`)
    await mutate()
  }

  const onSelectChat = async (chat: Chat) => {
    setNameValue(chat.title)
    setCurrentChat(chat)
    navigate(`/chat/${chat.id}`)
  }

  const onChangeChatName: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setNameValue(e.target.value)
  }

  const onSaveChangeName = async () => {
    if (!nameValue) {
      return toast({description: "标题不能为空", variant: "destructive"})
    }

    if (currentChat && urlParams.chatId) {
      await patch(`/chats/${urlParams.chatId}`, {
        title: nameValue,
      })
      await mutate()
    }
  }

  const onDeleteChat = async () => {
    if (chatList && chatList.length === 1) {
      return toast({
        description: "只有一个对话了，不能删除",
        variant: "destructive"
      })
    }
    await destroy(`/chats/${urlParams.chatId}`)
    const latestChatList = await mutate()
    if (latestChatList) {
      navigate(`/chat/${latestChatList[0].id}`)
    }
  }

  return (
    <div className={"h-full flex w-full"}>
      <aside
        className={cn("hidden md:flex w-[260px] max-w-[260px] border-2 flex-col justify-between")}>
        <div className={"flex h-14 items-center bg-white px-4 dark:bg-[#18181c] justify-center"}>
          <div className={"border-2 px-8 py-1 rounded-md cursor-pointer"} onClick={() => onCreateChat()}>+
            新对话
          </div>
        </div>
        <div className={"min-h-0 flex-1 overflow-hidden overflow-y-auto px-4 py-4 space-y-2"}>
          {chatList?.map(chat => <div key={chat.id}
                                      onClick={() => onSelectChat(chat)}
                                      className={cn("flex border-[1px] justify-between py-2 rounded-md px-2 cursor-pointer border-gray-500",
                                        chat.id === urlParams.chatId ? "border-[#eb2f96] border-[1px]" : "")}>
            <div className={"flex"}>
              <MessageCircle className={"w-4 mr-2"}/>
              <span>{chat.title}</span>
            </div>
            {chat.id === currentChat?.id && <div className={"flex space-x-1"}>
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Edit className={"w-4"}/>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>编辑</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div>
                            <Input value={nameValue} onChange={onChangeChatName}/>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction onClick={onSaveChangeName}>保存</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Delete className={"w-4"}/>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>删除</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div>
                            确认删除该条对话？
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction onClick={onDeleteChat}>确认</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>}
          </div>)}

        </div>
        <div className={"side-wallet-box border-t p-4 dark:border-t-neutral-800"}>
          余额1800 (80%)
          <Progress value={80} className={"border-2"}/>
        </div>
      </aside>
      <div className={"flex h-full flex-col justify-between w-full"}>
        <header className={"relative z-20 border-b dark:border-b-neutral-800"}>
          <div className={"flex h-14 max-w-screen-2xl items-center justify-between px-4"}>
            <div className={"flex min-w-0 flex-1 items-center space-x-2 overflow-hidden pr-2"}>
              <Sheet>
                <SheetTrigger className={"md:hidden pr-4"}>
                  <Menu/>
                </SheetTrigger>
                <SheetContent side={"left"} className={"p-0 bg-secondary pt-10 w-[260px]"}>
                  <aside
                    className={cn("md:flex w-[260px] max-w-[260px] border-2 flex-col justify-between")}>
                    <div className={"flex h-14 items-center bg-white px-4 dark:bg-[#18181c] justify-center"}>
                      <div className={"border-2 px-8 py-1 rounded-md cursor-pointer"} onClick={() => onCreateChat()}>+
                        新对话
                      </div>
                    </div>
                    <div className={"min-h-0 flex-1 overflow-hidden overflow-y-auto px-4 py-4 space-y-2"}>
                      {chatList?.map(chat => <div key={chat.id}
                                                  onClick={() => onSelectChat(chat)}
                                                  className={cn("flex border-[1px] justify-between py-2 rounded-md px-2 cursor-pointer border-gray-500",
                                                    chat.id === urlParams.chatId ? "border-[#eb2f96] border-[1px]" : "")}>
                        <div className={"flex"}>
                          <MessageCircle className={"w-4 mr-2"}/>
                          <span>{chat.title}</span>
                        </div>
                        {chat.id === currentChat?.id && <div className={"flex space-x-1"}>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Edit className={"w-4"}/>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>编辑</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <div>
                                        <Input value={nameValue} onChange={onChangeChatName}/>
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>取消</AlertDialogCancel>
                                        <AlertDialogAction onClick={onSaveChangeName}>保存</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Delete className={"w-4"}/>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>删除</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <div>
                                        确认删除该条对话？
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>取消</AlertDialogCancel>
                                        <AlertDialogAction onClick={onDeleteChat}>确认</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>}
                      </div>)}

                    </div>
                    <div className={"side-wallet-box border-t p-4 dark:border-t-neutral-800"}>
                      余额1800 (80%)
                      <Progress value={80} className={"border-2"}/>
                    </div>
                  </aside>
                </SheetContent>
              </Sheet>
              <h2
                className={"overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold"}>{currentChat?.title}</h2>
            </div>
          </div>
        </header>
        <main className={"px-4 flex-1 overflow-auto h-full"}>
          {messages.length === 0 && !isLoading && <div className={"flex justify-center items-center h-full flex-col"}>
              <h2 className={"mb-6 rounded px-4 py-2 text-center text-3xl font-bold"}>AI聊天机器人</h2>
              <div className={"w-full flex items-center justify-center space-x-6"}>
                  <span>写文案</span>
                  <span>生活质感</span>
                  <span>职场助手</span>
              </div>
          </div>}
          {messages.map((message, index) => message.content && <ChatMessage key={index} {...message}/>)}
          {isLoading ? <ChatMessage role={"assistant"} isLoading={isLoading}/> : currentMessage.content ?
            <ChatMessage role={"assistant"} content={currentMessage.content}/> : null}
          <div ref={scrollRef}/>
        </main>
        <footer>
          <FormInput chatId={urlParams.chatId} input={value} handleInputChange={handleInputChange}
                     onSubmit={onSubmit} isLoading={false}/>
        </footer>
      </div>
    </div>
  );
}

export default Chat

