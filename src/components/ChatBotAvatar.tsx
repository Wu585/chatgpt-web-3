import {Avatar, AvatarImage} from "@/components/ui/avatar.tsx";

const ChatBotAvatar = () => {
  return (
    <Avatar className={"bg-green-400"}>
      <AvatarImage src="https://chat.chatgptdemo.net/assets/image/chatgpt.svg" alt="@shadcn" />
    </Avatar>
  );
}

export default ChatBotAvatar

