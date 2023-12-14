import {Link} from "react-router-dom";
import {Brush, MessageCircle, PenTool} from "lucide-react";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area.tsx";

const Home = () => {
  const listmap = {
    "全部": [],
    "创作": [],
    "办公": [],
    "医疗健康": [],
    "学习辅导": [],
    "法律服务": []
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
      <div className={"md:w-[1000px]"}>
        <ScrollArea className="whitespace-nowrap">
          <div
            className={"my-6 sticky left-0 right-0 top-0 z-50 overflow-auto bg-[#f3f4fc] py-2 dark:bg-[#101014]"}>
            {Object.keys(listmap).map(item => <span
              className={"border-2 py-1 px-4 rounded-full mx-1 cursor-pointer"}>{item}</span>)}
            {Object.keys(listmap).map(item => <span
              className={"border-2 py-1 px-4 rounded-full mx-1 cursor-pointer"}>{item}</span>)}
            {Object.keys(listmap).map(item => <span
              className={"border-2 py-1 px-4 rounded-full mx-1 cursor-pointer"}>{item}</span>)}
          </div>
          <ScrollBar orientation="horizontal"/>
        </ScrollArea>
      </div>
      <div className={"w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4"}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(() =>
          <div className={"border-2 m-auto w-full rounded-md bg-white p-4 dark:bg-[#18181c]"}>
            <div className={"flex items-start"}>
              <div
                className={"mr-3 flex h-[80px] w-[80px] min-w-[80px] overflow-hidden rounded-md bg-[#f3f4fb] dark:bg-[#28282c]"}>
                <img className={""} src="https://feixue666.com/wp-content/uploads/2023/11/ink.svg" alt=""/>
              </div>
              <div className={"flex-row justify-between"}>
                <h2
                  className={"css-0 mb-2 line-clamp-1 break-all text-xl font-semibold tracking-wide"}>文案改写专家</h2>
                <div className={"min-h-[60px]"}>
                  <p className={"line-clamp-3 w-full break-all text-sm text-gray-400"}>
                    对指定内容进行改写并润色，要求在不改变内容长度，保持语句通顺且句意不变的情况下，给出改写后的版本
                  </p>
                </div>
              </div>
            </div>
            <div className={"mt-4 flex justify-end text-[#eb2f96] dark:text-[#ff8cc8] "}>
              <div className={"rounded-full border-2 px-4 cursor-pointer"}>使用</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home

