import {Link, useNavigate} from "react-router-dom";
import {Brush, MessageCircle, PenTool, X} from "lucide-react";
import {useAjax} from "@/lib/ajax.ts";
import {useRoleList} from "@/hooks/useRoleList.ts";
import {useState} from "react";
import {useDebounce} from "@/hooks/useDebounce.ts";
import NoBorderInput from "@/components/NoBorderInput.tsx";

export interface Role {
  id: string
  iconUrl: string
  title: string
  remark: string
}

interface Chat {
  id: string
  title: string
}

const Home = () => {
  /*const listmap = {
    "全部": [],
    "创作": [],
    "办公": [],
    "医疗健康": [],
    "学习辅导": [],
    "法律服务": []
  }*/

  const [searchParams, setSearchParams] = useState({
    keyword: "",
    page: 1,
    perPage: 500
  })

  const debouncedKeyword = useDebounce(searchParams)

  const {post} = useAjax()

  const {data: roleList} = useRoleList(debouncedKeyword)

  const navigate = useNavigate()

  const onUseRole = async (item: Role) => {
    const chat = await post<Chat>("/chats", {
      title: item.title
    })

    const {id} = chat.data

    await post("/messages/normal-create", {
      role: "system",
      content: item.remark,
      model: "gpt-3.5-turbo",
      chatId: id
    }).then(() => {
      navigate(`/chat/${id}`)
    })
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
      <div className={"mt-3 relative"}>
        <NoBorderInput
          placeholder={"输入要查询的角色"}
          value={searchParams.keyword}
          onChange={(e) => setSearchParams({
            ...searchParams,
            keyword: e.target.value
          })}/>
        <X
          className={"absolute h-6 w-6  text-muted-foreground right-2 top-2 cursor-pointer"}
          onClick={() => setSearchParams({
            ...searchParams,
            keyword: ""
          })}
        />
      </div>
      <div className={"w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4"}>
        {roleList?.actors?.map((item) =>
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
                  className={"css-0 mb-2 line-clamp-1 break-all text-xl font-semibold tracking-wide"}>{item.title}</h2>
                <div className={"min-h-[60px]"}>
                  <p className={"line-clamp-3 w-full break-all text-sm text-gray-400"}>
                    {item.remark}
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

