import ChatMessage from "@/components/ChatMessage.tsx";
import FormInput from "@/components/FormInput.tsx";
import {ChangeEvent, ChangeEventHandler, ElementRef, FormEvent, useEffect, useRef, useState} from "react";
import {useMessagesStore} from "@/store/useMessagesStore.ts";
import {useModelStore} from "@/store/useModelStore.tsx";
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
import {useUserStore} from "@/store/userStore.ts";
import {cn} from "@/lib/utils.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useAjax} from "@/lib/ajax.ts";
import {useToast} from "@/components/ui/use-toast.ts";
import {useGetMessagesById} from "@/hooks/useGetMessagesById.ts";
import {useChatList} from "@/hooks/useChatList.ts";
import {useWebSocketStore} from "@/store/useWebSocketStore.ts";
import {useRoleStore} from "@/store/useRoleStore.tsx";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet.tsx";

export interface Message {
  content: string
  role: "assistant" | "user"
}

export interface Chat {
  name: string
  userId: string
  id: string
  parentMessageId: string
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
  const {user} = useUserStore()
  const {model} = useModelStore()
  const {ws} = useWebSocketStore()
  const {currentRole, setCurrentRole} = useRoleStore()

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
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    setIsAudio(false)
    setMessages({
      role: "user",
      content: value
    })
    e.preventDefault()

    currentRole ?
      ws?.send(JSON.stringify({
        role: currentRole.id,
        content: value,
        semantics: true,
        model,
        chatId: urlParams.chatId
      })) : ws?.send(JSON.stringify({
        content: value,
        semantics: true,
        model,
        chatId: urlParams.chatId
      }))
    setValue('')
  }

  const {post} = useAjax()

  const {data: chatList, mutate} = useChatList()

  const [nameValue, setNameValue] = useState("")

  const {data: currentMessages} = useGetMessagesById(urlParams.chatId)

  useEffect(() => {
    if (currentMessages) {
      const x = currentMessages.map((item) => [{
        role: "user",
        content: item.question
      }, {
        role: "assistant",
        content: item.answer,
      }] as const)
      updateAllMessages(x.flat())
    }
  }, [currentMessages])

  useEffect(() => {
    // url有就找到；没有的话就是删除后选择列表剩下的第一个
    if (chatList) {
      setCurrentChat(chatList.find(item => item.parentMessageId === urlParams.chatId) || chatList[0])
    }
  }, [chatList, urlParams.chatId])

  const onCreateChat = async (name = "新对话") => {
    if (user) {
      const res = await post<{
        msg: string
      }>('/sessionParentList/create', {
        name: name,
        userId: user?.id,
      })
      setCurrentRole(null)
      navigate(`/chat/${res.data.msg}`)
      await mutate()
    }
  }

  const onSelectChat = async (chat: Chat) => {
    setNameValue(chat.name)
    setCurrentChat(chat)
    navigate(`/chat/${chat.parentMessageId}`)
  }

  const onChangeChatName: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setNameValue(e.target.value)
  }

  const onSaveChangeName = async () => {
    if (!nameValue) {
      return toast({description: "标题不能为空", variant: "destructive"})
    }

    if (user && currentChat && urlParams.chatId) {
      await post("/sessionParentList/update", {
        name: nameValue,
        userId: user?.id,
        chatId: urlParams.chatId
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
    await post(`/sessionParentList/delete?chatId=${urlParams.chatId}`, {})
    const latestChatList = await mutate()
    if (latestChatList) {
      navigate(`/chat/${latestChatList[0].parentMessageId}`)
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
                                        chat.parentMessageId === urlParams.chatId ? "border-[#eb2f96] border-[1px]" : "")}>
            <div className={"flex"}>
              <MessageCircle className={"w-4 mr-2"}/>
              <span>{chat.name}</span>
            </div>
            {chat.parentMessageId === currentChat?.parentMessageId && <div className={"flex space-x-1"}>
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
                                                    chat.parentMessageId === urlParams.chatId ? "border-[#eb2f96] border-[1px]" : "")}>
                        <div className={"flex"}>
                          <MessageCircle className={"w-4 mr-2"}/>
                          <span>{chat.name}</span>
                        </div>
                        {chat.parentMessageId === currentChat?.parentMessageId && <div className={"flex space-x-1"}>
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
                className={"overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold"}>{currentChat?.name}</h2>
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

