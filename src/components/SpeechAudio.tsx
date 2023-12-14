import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {Mic} from "lucide-react";
import {useWebsocket} from "@/hooks/useWebsocket.ts";
import {useModelStore} from "@/store/useModelStore.tsx";
import {useUserStore} from "@/store/userStore.ts";
import {useToast} from "@/components/ui/use-toast.ts";
import {useMessagesStore} from "@/store/useMessagesStore.ts";

export function SpeechAudio() {
  const {setMessages, setIsLoading} = useMessagesStore()

  const recognition = new webkitSpeechRecognition();
  const {ws} = useWebsocket()
  const {model} = useModelStore()
  const {user} = useUserStore()
  const {toast} = useToast()

  const onRecordVoice = () => {
    // 设置语音识别的语言（根据需要修改）
    recognition.lang = 'zh-CN';
    recognition.start();
    // 设置为连续模式
    recognition.continuous = true;

    recognition.onresult = function (event: any) {
      if (!user) {
        return toast({
          description: "未登录，请先登录",
          variant: "destructive"
        })
      }
      setIsLoading(true)
      const transcript = event.results[0][0].transcript;
      console.log('识别到的文本:', transcript);
      setMessages({
        role: "user",
        content: transcript
      })
      ws?.send(JSON.stringify({
        role: user.id,
        content: transcript,
        semantics: true,
        model,
      }))
    };
  }

  const onEnd = () => {
    console.log('结束录音')
    recognition.stop()
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Mic onClick={onRecordVoice} className={"h-8 w-12 px-1 cursor-pointer"}/>
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
