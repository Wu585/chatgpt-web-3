import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";

const Write = () => {
  const length = ["自动", "短", "中等", "长"]
  const style = ["自动", "电子邮件", "消息", "评论", "段落", "文章", "博客文章", "想法", "大纲"]
  const tone = ["自动", "友善", "随意", "友好", "专业", "诙谐", "有趣", "正式"]
  return (
    <div className={"h-full overflow-hidden"}>
      <header className={"p-4"}>
        <h2 className={"text-2xl font-bold text-black dark:text-white"}>写作</h2>
      </header>
      <main className={"grid h-4/5 grid-cols-12 overflow-hidden rounded-md shadow-sm p-4"}>
        <div className={"col-span-12 space-y-4 bg-[#fff] p-4 dark:bg-[#18181c] lg:col-span-5"}>
          <Label className={"text-md flex items-center space-x-2 font-bold"}>
            写作内容
          </Label>
          <Textarea placeholder="告诉我该写点什么."/>
          <Label className={"text-md flex items-center space-x-2 font-bold"}>
            长度
          </Label>
          <div className={"flex flex-wrap items-center gap-4"}>
            {length.map(item => <span key={item}
                                      className={"cursor-pointer hover:text-[#18a058] dark:hover:text-[#63e2b7] border-2 p-1 rounded-md"}>{item}</span>)}
          </div>
          <Label className={"text-md flex items-center space-x-2 font-bold"}>
            格式
          </Label>
          <div className={"flex flex-wrap items-center gap-4"}>
            {style.map(item => <span key={item}
                                     className={"cursor-pointer hover:text-[#18a058] dark:hover:text-[#63e2b7] border-2 p-1 rounded-md"}>{item}</span>)}
          </div>
          <Label className={"text-md flex items-center space-x-2 font-bold"}>
            语气
          </Label>
          <div className={"flex flex-wrap items-center gap-4"}>
            {tone.map(item => <span key={item}
                                    className={"cursor-pointer hover:text-[#18a058] dark:hover:text-[#63e2b7] border-2 p-1 rounded-md"}>{item}</span>)}
          </div>
        </div>
        <div className={"col-span-12 space-y-4 bg-[#f7f7fa] p-4 dark:bg-[#0f0f12] lg:col-span-7 flex flex-col"}>
          <Label className={"text-md flex items-center space-x-2 font-bold"}>
            预览
          </Label>
          <Textarea placeholder="预览内容." className={"flex-1"}/>
          <Button className={"w-full"}>生成内容</Button>
        </div>
      </main>
    </div>
  );
}

export default Write

