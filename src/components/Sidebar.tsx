import {Home, MessageSquare, Image, Pen, SquareUserRound} from "lucide-react";
import UserAvatar from "@/components/UserAvatar.tsx";
import ModeToggle from "@/components/mode-toggle.tsx";
import {useLocation, useNavigate,} from "react-router-dom";
import {cn} from "@/lib/utils.ts";
import Announcement from "@/components/Announcement.tsx";
import {useChatList} from "@/hooks/useChatList.ts";

const Sidebar = () => {
  const navigate = useNavigate()

  const {data: chatList} = useChatList()

  const chatPath = chatList && chatList.length > 0 ? `/chat/${chatList[0].parentMessageId}` : '/chat'

  const routesMap = [
    {
      path: "/home",
      icon: <Home/>,
      name: "主页"
    },
    {
      path: "/chat",
      icon: <MessageSquare/>,
      name: "对话"
    },
    {
      path: "/dall",
      icon: <Image/>,
      name: "DALL.E"
    },
    {
      path: "/write",
      icon: <Pen/>,
      name: "写作"
    },
    {
      path: "/userinfo",
      icon: <SquareUserRound/>,
      name: "个人中心"
    }
  ]

  const {pathname} = useLocation()
  const url = '/' + pathname.split('/')[1]

  const onClickLink = (i: {
    path: string
    name: string
  }) => {
    if (i.path === "/chat") {
      navigate(chatPath)
    } else {
      navigate(i.path)
    }
  }

  return (
    <div className={"bg-[#e8eaf1] md:py-4 md:pt-6 dark:bg-[#25272d] md:block md:w-[70px] md:h-full"}>
      <div className={"flex flex-col md:justify-between md:h-full"}>
        <div className={"flex pt-2 md:pt-0 md:flex-col items-center md:space-y-4"}>
          {routesMap.map(i =>
            <div
              key={i.path}
              onClick={() => onClickLink(i)}
              className={cn("flex flex-col items-center justify-center basis-1/4", i.name === "个人中心" && "md:hidden")}>
              <div>
                <div className={`flex flex-col items-center justify-center group h-8 w-8 md:h-12 md:w-12 shrink-0 
          cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c]`}>
                  <div className={cn("group-hover:scale-110 group-hover:text-[#eb2f96] dark:group-hover:text-[#ff8cc8]",
                    url === i.path ? "text-[#eb2f96] dark:text-[#ff8cc8]" : "")}>
                    {i.icon}
                  </div>
                </div>
              </div>
              <span
                className={cn("text-sm py-1", url === i.path ? "text-[#eb2f96] dark:text-[#ff8cc8]" : "")}>{i.name}</span>
            </div>)}
        </div>
        <div className={"hidden md:flex flex-col justify-center items-center space-y-4"}>
          <Announcement/>
          <ModeToggle/>
          <UserAvatar onClick={() => navigate("userinfo")}/>
        </div>
      </div>
    </div>
  );
}

export default Sidebar

