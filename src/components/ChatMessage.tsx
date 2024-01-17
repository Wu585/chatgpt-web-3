import {FC} from "react";
import {cn} from "@/lib/utils";
import {BeatLoader} from "react-spinners";
import {Button} from "@/components/ui/button";
import {Copy} from "lucide-react";
import ChatBotAvatar from "@/components/ChatBotAvatar.tsx";
import UserAvatar from "@/components/UserAvatar.tsx";
import {useToast} from "@/components/ui/use-toast.ts";

export interface ChatMessageProps {
  role: "assistant" | "user" | "system",
  content?: string
  isLoading?: boolean
  src?: string
  imageMessageSrc?: string
  onLoad?: () => void
}

const ChatMessage: FC<ChatMessageProps> = ({role, content, isLoading, imageMessageSrc, onLoad}) => {
  const {toast} = useToast()
  const onCopy = () => {
    if (!content) {
      return
    }
    if (imageMessageSrc) {
      navigator.clipboard.writeText(imageMessageSrc).then(() => {
        toast({
          description: "图片链接已复制到粘贴板！"
        })
      })
    } else {
      navigator.clipboard.writeText(content).then(() => {
        toast({
          description: "内容已复制到粘贴板！"
        })
      })
    }
  }

  return (
    <div className={cn(
      "group flex items-center gap-x-3 py-4 w-full",
      (role === "user" || role === "system") && "justify-end pl-12"
    )}>
      {role === "assistant" && <ChatBotAvatar/>}
      <div className={"rounded-md px-4 py-2 max-2-sm text-sm bg-primary/10 whitespace-pre-line"}>
        {isLoading ? <BeatLoader size={5}/> : content}
        {imageMessageSrc && <img src={imageMessageSrc} className={"w-80 h-auto"} alt="" onLoad={onLoad}/>}
      </div>
      {(role === "user" || role === "system") && <UserAvatar/>}
      {role === "assistant" && !isLoading && <Button onClick={onCopy}
                                                     className={"opacity-0 group-hover:opacity-100 transition"}
                                                     size={"icon"}
                                                     variant={"ghost"}>
          <Copy className={"h-4 w-4"}/>
      </Button>}
    </div>
  );
}

export default ChatMessage

