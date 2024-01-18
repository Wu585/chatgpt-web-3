import {Link, useNavigate} from "react-router-dom";
import {Brush, MessageCircle, PenTool, X} from "lucide-react";
import {useEffect, useState} from "react";
import {useAjax} from "@/lib/ajax.ts";
import {useUserStore} from "@/store/userStore.ts";
import {useRoleStore} from "@/store/useRoleStore.tsx";
import {useMessagesStore} from "@/store/useMessagesStore.ts";
import {useModelStore} from "@/store/useModelStore.tsx";
import useSWR from "swr";
import {useChatList} from "@/hooks/useChatList.ts";
import {useWebSocketStore} from "@/store/useWebSocketStore.ts";
import {Input} from "@/components/ui/input.tsx";
import {useDebounce} from "@/hooks/useDounce.ts";

export interface Role {
  id: number
  iconUrl: string
  roleMessage: string
  roleName: string
}

const Home = () => {
  const [keyword, setKeyword] = useState("")

  const debouncedKeyword = useDebounce(keyword)

  const {setRoleMessage, setRoleName, setCurrentRole} = useRoleStore()
  const {setIsLoading} = useMessagesStore()

  /*const listmap = {
    "全部": [],
    "创作": [],
    "办公": [],
    "医疗健康": [],
    "学习辅导": [],
    "法律服务": []
  }*/

  const [roleList, setRoleList] = useState<Role[]>([])

  const {user} = useUserStore()
  const {model} = useModelStore()
  const {mutate} = useChatList()

  const {get, post} = useAjax()

  const {data: queryRoles} = useSWR(["/role/getByName", debouncedKeyword], async ([path]) => {
    const response = await get<Resource<{
      id: number
      roleName: string
      roleMessage: string
    }[]>>(path, {
      params: {
        name: keyword
      }
    })
    return response.data.data
  })


  const {data: allRoles} = useSWR(`/role/queryAll`, async path => {
    const response = await get<Resource<{
      id: number
      roleName: string
      roleMessage: string
    }[]>>(path)
    return response.data.data
  })

  const {data: roleDescList} = useSWR(`/roleDesc/queryAll`, async path => {
    const response = await get<Resource<{
      id: string
      image: string
      roleId: number
    }[]>>(path)
    return response.data.data
  })

  useEffect(() => {
    if (allRoles && roleDescList) {
      const updatedRoleList = allRoles.map(role => {
        const roleDesc = roleDescList.find(item => item.roleId === role.id)
        return {
          ...role,
          iconUrl: roleDesc ? roleDesc.image : "",
        }
      })
      setRoleList(updatedRoleList);
    }
  }, [allRoles, roleDescList])

  useEffect(() => {
    if (queryRoles && roleDescList) {
      const updatedRoleList = queryRoles.map(role => {
        const roleDesc = roleDescList.find(item => item.roleId === role.id)
        return {
          ...role,
          iconUrl: roleDesc ? roleDesc.image : "",
        }
      })
      setRoleList(updatedRoleList);
    }
  }, [queryRoles, roleDescList])

  const navigate = useNavigate()

  // const {ws} = useWebsocket({})

  const {ws} = useWebSocketStore()

  const onUseRole = async (item: Role) => {
    if (user) {
      setRoleMessage(item.roleMessage)
      setRoleName(item.roleName)
      setCurrentRole(item)

      const res = await post<{
        msg: string
      }>('/sessionParentList/create', {
        name: item.roleName,
        userId: user?.id
      })
      const chatId = res.data.msg
      await mutate()
      setIsLoading(true)
      ws?.send(JSON.stringify({
        role: item.id,
        content: `${item.roleMessage}`,
        semantics: true,
        model,
        chatId
      }))
      navigate(`/chat/${chatId}`)
    }
  }

  return (
    <div className={"h-full overflow-auto md:p-6"}>
      <header className={"mb-2 text-center text-3xl font-extrabold text-[#eb2f96] dark:text-[#ff8cc8]"}>AI 聊天机器人
      </header>
      <div className={"mt-10 flex items-center justify-center space-x-4"}>
        <Link to={"/chat"}>
          <div className={"text-[#eb2f96] dark:text-[#ff8cc8] flex items-center space-x-1"}>
            <MessageCircle/>
            <span>AI对话</span>
          </div>
        </Link>
        <Link to={"/dall"}>
          <div className={"text-[#eb2f96] dark:text-[#ff8cc8] flex items-center space-x-1"}>
            <Brush/>
            <span>AI绘画</span>
          </div>
        </Link>
        <Link to={"/write"}>
          <div className={"text-[#eb2f96] dark:text-[#ff8cc8] flex items-center space-x-1"}>
            <PenTool/>
            <span>AI写作</span>
          </div>
        </Link>
      </div>

      <div className={"mt-3 relative"}>
        <Input
          placeholder={"输入要查询的角色"}
          className={"border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}/>
        <X
          className={"absolute h-6 w-6  text-muted-foreground right-2 top-2 cursor-pointer"}
          onClick={() => setKeyword("")}
        />
      </div>

      {/*<div className={"md:w-[1000px]"}>
        <ScrollArea className="whitespace-nowrap">
          <div
            className={"my-6 sticky left-0 right-0 top-0 z-50 overflow-auto bg-[#f3f4fc] py-2 dark:bg-[#101014]"}>
            {Object.keys(listmap).map(item => <span key={item}
                                                    className={"border-2 py-1 px-4 rounded-full mx-1 cursor-pointer"}>{item}</span>)}
          </div>
          <ScrollBar orientation="horizontal"/>
        </ScrollArea>
      </div>*/}
      <div className={"w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4"}>
        {roleList.map((item) =>
          <div
            key={item.id}
            className={"border-2 m-auto w-full rounded-md bg-white p-4 dark:bg-[#18181c] transition-transform transform hover:scale-105 ease-in"}>
            <div className={"flex items-start"}>
              <div
                className={"mr-3 flex h-[80px] w-[80px] min-w-[80px] overflow-hidden rounded-md bg-[#f3f4fb] dark:bg-[#28282c]"}>
                <img className={""} src={item.iconUrl} alt=""/>
              </div>
              <div className={"flex-row justify-between"}>
                <h2
                  className={"css-0 mb-2 line-clamp-1 break-all text-xl font-semibold tracking-wide"}>{item.roleName}</h2>
                <div className={"min-h-[60px]"}>
                  <p className={"line-clamp-3 w-full break-all text-sm text-gray-400"}>
                    {item.roleMessage}
                  </p>
                </div>
              </div>
            </div>
            <div className={"mt-4 flex justify-end text-[#eb2f96] dark:text-[#ff8cc8]"}>
              <div className={"rounded-full border-2 px-4 cursor-pointer"} onClick={() => onUseRole(item)}>使用</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home

