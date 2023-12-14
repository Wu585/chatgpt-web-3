import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {FilePlus2, History} from "lucide-react";
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Form} from "@/components/ui/form.tsx";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  model: z.string().refine(value => ["dall-e-2", "dall-e-3"].includes(value), {
    message: "不可选择的模型"
  }),
  size: z.string().refine(value => ["256x256", "dall-e-3"].includes(value), {
    message: "不可选择的尺寸"
  })
})

const Dall = () => {
  const form =  useForm({
    defaultValues:{
      model:"dall-e-2",
      size:"",
      number: 1,
      quality:""
    }
  })

  return (
    <div className={"h-full overflow-hidden"}>
      <header className={"p-4"}>
        <h2 className={"text-2xl font-bold text-black dark:text-white"}>DALL·E</h2>
        <p className={"mt-2 text-zinc-400"}>输入描述性文本，使用 AI 轻松生成图像</p>
      </header>
      <Tabs defaultValue="generate" className="w-full">
        <div
          className={"rounded-md bg-zinc-100 p-4 dark:bg-[#18181c] sticky left-0 right-0 top-0 z-50 mb-4 flex w-full justify-center"}>
          <TabsList>
            <TabsTrigger value="generate">
              <div className={"flex justify-center items-center px-16"}>
                <FilePlus2/>
                <span>生成图片</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="history">
              <div className={"flex justify-center items-center px-16"}>
                <History/>
                <span>历史记录</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="generate">
          <div className={"flex w-full space-x-4"}>
            <div className={"w-2/3 border-2 h-80"}>
              111
            </div>
            <div className={"w-1/3 bg-gray-500 h-80"}>
              <Form>

              </Form>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}

export default Dall

