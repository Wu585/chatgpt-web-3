import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useRolePlayWebsocket} from "@/hooks/useWebsocket.ts";
import {useModelStore} from "@/store/useModelStore.tsx";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group.tsx";
import {useState} from "react";
import {useWriteMessageStore} from "@/store/useWriteMessageStore.ts";

const Write = () => {
  const {ws} = useRolePlayWebsocket()
  const {model} = useModelStore()
  const {writeMessage} = useWriteMessageStore()

  const length = ["自动", "短", "中等", "长"]
  const style = ["自动", "电子邮件", "消息", "评论", "段落", "文章", "博客文章", "想法", "大纲"]
  const tone = ["自动", "友善", "随意", "友好", "专业", "诙谐", "有趣", "正式"]

  const [selectedValue, setSelectedValue] = useState({
    length: "",
    style: "",
    tone: ""
  })

  const onValueChangeLength = (value: string) => {
    setSelectedValue({
      ...selectedValue,
      length: value
    })
  }

  const onValueChangeStyle = (value: string) => {
    setSelectedValue({
      ...selectedValue,
      style: value
    })
  }

  const onValueChangeTone = (value: string) => {
    setSelectedValue({
      ...selectedValue,
      tone: value
    })
  }

  const [writePrompt, setWritePrompt] = useState("")

  const prompt = `\n\t现在你是一个写作文案专家，请根据我给出的要求和内容帮我生成写作内容。\n\t#要求：\n\t1、长度：${selectedValue.length}\n\t2、格式：${selectedValue.style}\n\t3、语气：${selectedValue.tone}\n\t4、语言：中文\n\t#内容：\n\t${writePrompt}\n\t`

  const onGenerateContent = () => {
    ws?.send(JSON.stringify({
      content: prompt,
      semantics: true,
      model
    }))
  }
  return (
    <div className={"h-full overflow-auto"}>
      <header className={"p-4"}>
        <h2 className={"text-2xl font-bold text-black dark:text-white"}>写作</h2>
      </header>
      <main className={"grid h-full md:h-4/5 grid-cols-12 overflow-hidden rounded-md shadow-sm p-4"}>
        <div className={"col-span-12 space-y-4 bg-[#fff] p-4 dark:bg-[#18181c] lg:col-span-5"}>
          <Label className={"text-md flex items-center space-x-2 font-bold"}>
            写作内容
          </Label>
          <Textarea placeholder="告诉我该写点什么." value={writePrompt}
                    onChange={(e) => setWritePrompt(e.target.value)}/>
          <Label className={"text-md flex items-center space-x-2 font-bold"}>
            长度
          </Label>
          <ToggleGroup type={"single"} className={"flex flex-wrap items-start gap-4 justify-start"}
                       onValueChange={onValueChangeLength} defaultValue={length[0]}>
            {length.map(item => <ToggleGroupItem value={item} key={item}
                                                 className={"cursor-pointer hover:text-[#18a058] dark:hover:text-[#63e2b7] border-2 p-1 rounded-md"}>{item}</ToggleGroupItem>)}
          </ToggleGroup>
          <Label className={"text-md flex items-center space-x-2 font-bold"}>
            格式
          </Label>
          <ToggleGroup type={"single"} className={"flex flex-wrap items-center gap-4 justify-start"}
                       onValueChange={onValueChangeStyle} defaultValue={style[0]}>
            {style.map(item => <ToggleGroupItem value={item} key={item}
                                                className={"cursor-pointer hover:text-[#18a058] dark:hover:text-[#63e2b7] border-2 p-1 rounded-md"}>{item}</ToggleGroupItem>)}
          </ToggleGroup>
          <Label className={"text-md flex items-center space-x-2 font-bold"}>
            语气
          </Label>
          <ToggleGroup type={"single"} className={"flex flex-wrap items-center gap-4 justify-start"}
                       onValueChange={onValueChangeTone} defaultValue={tone[0]}>
            {tone.map(item => <ToggleGroupItem value={item} key={item}
                                               className={"cursor-pointer hover:text-[#18a058] dark:hover:text-[#63e2b7] border-2 p-1 rounded-md"}>{item}</ToggleGroupItem>)}
          </ToggleGroup>
        </div>
        <div
          className={"col-span-12 space-y-4 bg-[#f7f7fa] p-2 dark:bg-[#0f0f12] lg:col-span-7 flex flex-col overflow-auto"}>
          <Label className={"text-md flex items-center space-x-2 font-bold"}>
            预览
          </Label>
          <Textarea placeholder="预览内容." className={"flex-1"} value={writeMessage}/>
          <Button className={"w-full"} onClick={onGenerateContent}>生成内容</Button>
        </div>
      </main>
    </div>
  );
}

export default Write

