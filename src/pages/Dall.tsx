import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {FilePlus2, History} from "lucide-react";
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

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
  const form = useForm({
    defaultValues: {
      model: "dall-e-2",
      size: "120x120",
      number: 1,
      quality: "standard"
    }
  })

  const onSubmit = () => {
    console.log("")
  }

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
          <div className={"md:flex w-full md:space-x-4"}>
            <div className={"w-full md:w-1/2 border-2 h-100"}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField render={({field}) => <FormItem>
                    <FormLabel>模型</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dall-e-2">dall-e-2</SelectItem>
                        <SelectItem value="dall-e-3">dall-e-3</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>} name={"model"}/>

                  <FormField render={({field}) => <FormItem>
                    <FormLabel>图片尺寸</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1024x1024">1024x1024</SelectItem>
                        <SelectItem value="120x120">120x120</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>} name={"size"}/>

                  <FormField render={({field}) => <FormItem>
                    <FormLabel>画质</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">standard</SelectItem>
                        <SelectItem value="hd">hd</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>} name={"quality"}/>

                  <FormField render={({field}) => <FormItem>
                    <FormLabel>描述词</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="生成图片的描述词"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>} name={"description"}/>
                </form>
              </Form>
            </div>
            <div className={"w-full md:w-1/2 border-2 h-100"}>
              111
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}

export default Dall

