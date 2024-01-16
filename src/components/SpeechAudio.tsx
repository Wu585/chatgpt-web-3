import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {Mic} from "lucide-react";
import {useModelStore} from "@/store/useModelStore.tsx";
import {useUserStore} from "@/store/userStore.ts";
import {useToast} from "@/components/ui/use-toast.ts";
import {useMessagesStore} from "@/store/useMessagesStore.ts";
import {useWebSocketStore} from "@/store/useWebSocketStore.ts";
import {useState} from "react";
import {useRoleStore} from "@/store/useRoleStore.tsx";
import {useAjax} from "@/lib/ajax.ts";

interface SpeechAudio {
  chatId?: string
}

export function SpeechAudio({chatId}: SpeechAudio) {
  const {post} = useAjax()

  const {setMessages, setIsLoading, setIsAudio} = useMessagesStore()

  const recognition = new webkitSpeechRecognition();
  const {ws} = useWebSocketStore()
  const {model} = useModelStore()
  const {user} = useUserStore()
  const {currentRole} = useRoleStore()
  const {toast} = useToast()

  const [transcript, setTranscript] = useState("")

  const onRecordVoice = () => {
    // 设置语音识别的语言（根据需要修改）
    recognition.lang = 'zh-CN';
    recognition.start();
    // 设置为连续模式
    recognition.continuous = true;

    setIsAudio(true)

    recognition.onresult = function (event: any) {
      if (!user) {
        return toast({
          description: "未登录，请先登录",
          variant: "destructive"
        })
      }
      setIsLoading(true)

      const trans = event.results[0][0].transcript
      console.log('识别到的文本:', transcript);
      setTranscript(trans)

      setMessages({
        role: "user",
        content: trans
      })

      currentRole ?
        ws?.send(JSON.stringify({
          role: currentRole.id,
          content: trans,
          semantics: true,
          model,
          chatId
        })) : ws?.send(JSON.stringify({
          content: trans,
          semantics: true,
          model,
          chatId
        }))
    };
  }

  const onEnd = () => {
    console.log('结束录音')
    recognition.stop()
    setTranscript("")
    // setIsAudio(false)
  }

  const onClickAudio = () => {
    post<Blob>("/audio", {}, {
      responseType: "blob"
    }).then(res => {
      console.log(res);
    const blob = new Blob([res.data])
      console.log(blob);
      const url = URL.createObjectURL(blob)
      const audioElement = new Audio();
      // 将Audio元素的src设置为临时的URL
      audioElement.src = url
      // 播放音频
      audioElement.play();
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Mic onClick={onRecordVoice} className={"h-8 w-12 px-1 cursor-pointer"}/>
        <Mic onClick={onClickAudio} className={"h-8 w-12 px-1 cursor-pointer"}/>
      </AlertDialogTrigger>
      <AlertDialogContent className={"flex items-center justify-center flex-col w-64"}>
        <div className={"flex items-center justify-center"}>
          <Mic className={"h-8 w-12 px-1 cursor-pointer"}/>
          实时录音中...
        </div>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <button onClick={onEnd}>结束</button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
