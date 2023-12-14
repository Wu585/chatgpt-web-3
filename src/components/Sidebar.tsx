import {Home, MessageSquare, Image, Pen} from "lucide-react";
import UserAvatar from "@/components/UserAvatar.tsx";
import ModeToggle from "@/components/mode-toggle.tsx";
import {Link, useLocation} from "react-router-dom";
import {cn} from "@/lib/utils.ts";
import Announcement from "@/components/Announcement.tsx";

const Sidebar = () => {
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
    }
  ]

  const {pathname} = useLocation()

  return (
    <div className={"h-full w-[70px] bg-[#e8eaf1] py-4 pt-6 dark:bg-[#25272d] hidden md:block"}>
      <div className={"flex flex-col justify-between h-full"}>
        <div className={"flex flex-col justify-center items-center space-y-4"}>
          {routesMap.map(i => <div key={i.path} className={"flex flex-col items-center justify-center"}>
            <Link to={i.path}>
              <div className={`flex flex-col items-center justify-center group h-12 w-12 shrink-0 
          cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c]`}>
                <div className={cn("group-hover:scale-110 group-hover:text-[#eb2f96] dark:group-hover:text-[#ff8cc8]",
                  pathname === i.path ? "text-[#eb2f96] dark:text-[#ff8cc8]" : "")}>
                  {i.icon}
                </div>
              </div>
            </Link>
            <span className={"text-sm py-1"}>{i.name}</span>
          </div>)}
        </div>
        <div className={"flex flex-col justify-center items-center space-y-4"}>
          <Announcement/>
          <ModeToggle/>
          <UserAvatar/>
        </div>
      </div>
    </div>
  );
}

export default Sidebar

