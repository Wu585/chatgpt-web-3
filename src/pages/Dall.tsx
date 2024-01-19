import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {FilePlus2, History} from "lucide-react";
import {useForm} from "react-hook-form"
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {useToast} from "@/components/ui/use-toast.ts";
import {PulseLoader} from "react-spinners";
import {useAjax} from "@/lib/ajax.ts";
import {useHistoryImages} from "@/hooks/useHistoryImages.ts";
import {Card} from "@/components/ui/card.tsx";
import {useUser} from "@/hooks/useUser.ts";

const Dall = () => {
  const {toast} = useToast()
  const {post} = useAjax()

  const {data:userInfo} = useUser()

  const form = useForm({
    defaultValues: {
      model: "dall-e-2",
      size: "1024x1024",
      number: 1,
      quality: "standard",
      style: "natural",
      prompt: ""
    }
  })

  const [imgSrc, setImgSrc] = useState("https://hh.feixue666.com/i/2023/12/04/656d655f79a20.jpg")
  const [isLoading, setIsLoading] = useState(false)

  const {data: historyImages} = useHistoryImages()

  const onSubmit = () => {
    const value = form.getValues()
    if (!value.prompt) {
      console.log('return ')
      return
    }
    setIsLoading(true)

    console.log(value);

    post<{ url: string }[]>("/images", {
      ...value,
      n: value.number,
      user: userInfo!.username
    }).then(res => {
      setImgSrc(res.data[0].url)
    }).catch(() => {
      toast({
        description: "出错啦,请重新尝试",
        variant: "destructive"
      })
    }).finally(() => {
      setIsLoading(false)
    })

    /*if (user) {
      post<{
        msg: string
      }>("/images", {
        ...value,
        user: user?.username
      }).then(res => {
        setImgSrc(res.data.msg)
      }).catch(() => {
        toast({
          description: "出错啦,请重新尝试",
          variant: "destructive"
        })
      }).finally(() => {
        setIsLoading(false)
      })
    }*/
  }

  const modelValue = form.watch("model")

  const getHistory = () => {
    console.log(historyImages);
  }

  return (
    <div className={"h-full overflow-auto p-4"}>
      <header className={""}>
        <h2 className={"text-2xl font-bold text-black dark:text-white"}>DALL·E</h2>
        <p className={"mt-2 text-zinc-400"}>输入描述性文本，使用 AI 轻松生成图像</p>
      </header>
      <Tabs defaultValue="generate" className="w-full">
        <div
          className={"rounded-md bg-zinc-100 p-4 dark:bg-[#18181c]  mb-4 flex items-center justify-center"}>
          <TabsList>
            <TabsTrigger value="generate">
              <div className={"flex justify-center items-center px-10"}>
                <FilePlus2/>
                <span>生成图片</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="history" onClick={() => getHistory()}>
              <div className={"flex justify-center items-center px-10"}>
                <History/>
                <span>历史记录</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="generate">
          <div className={"md:flex w-full md:space-x-4"}>
            <div className={"w-full md:w-1/3 h-100 rounded-md bg-zinc-100 p-4 dark:bg-[#18181c]"}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField control={form.control} render={({field}) => <FormItem>
                    <FormLabel>模型</FormLabel>
                    <Select onValueChange={value => {
                      field.onChange(value)
                      form.setValue("size", "1024x1024")
                      form.setValue("quality", "standard")
                      form.setValue("style", "natural")
                    }} defaultValue={field.value}>
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

                  <FormField control={form.control} render={({field}) => <FormItem>
                    <FormLabel>图片尺寸</FormLabel>
                    <Select onValueChange={field.onChange}
                            value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display"/>
                        </SelectTrigger>
                      </FormControl>
                      {modelValue === "dall-e-2" ? <SelectContent>
                        <SelectItem value="256x256">256x256</SelectItem>
                        <SelectItem value="512x512">512x512</SelectItem>
                        <SelectItem value="1024x1024">1024x1024</SelectItem>
                      </SelectContent> : <SelectContent>
                        <SelectItem value="1024x1024">1024x1024</SelectItem>
                        <SelectItem value="1792x1024">1792x1024</SelectItem>
                        <SelectItem value="1024x1792">1024x1792</SelectItem>
                      </SelectContent>}
                    </Select>
                  </FormItem>} name={"size"}/>

                  <FormField render={({field}) => <FormItem>
                    <FormLabel>风格</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display"/>
                        </SelectTrigger>
                      </FormControl>
                      {form.getValues("model") === "dall-e-2" ? <SelectContent>
                        <SelectItem value="natural">自然</SelectItem>
                      </SelectContent> : <SelectContent>
                        <SelectItem value="natural">自然</SelectItem>
                        <SelectItem value="vivid">二次元</SelectItem>
                      </SelectContent>}
                    </Select>
                  </FormItem>} name={"style"}/>

                  <FormField render={({field}) => <FormItem>
                    <FormLabel>画质</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display"/>
                        </SelectTrigger>
                      </FormControl>
                      {form.getValues("model") === "dall-e-2" ? <SelectContent>
                        <SelectItem value="standard">标准</SelectItem>
                      </SelectContent> : <SelectContent>
                        <SelectItem value="standard">标准</SelectItem>
                        <SelectItem value="hd">高清</SelectItem>
                      </SelectContent>}
                    </Select>
                  </FormItem>} name={"quality"}/>

                  <FormField render={({field}) => <FormItem>
                    <FormLabel>描述词</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="生成图片的描述词"
                        className="resize-none border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>} name={"prompt"}/>

                  <Button type={"submit"} className={"w-full mt-6"}>生成图片</Button>
                </form>
              </Form>
            </div>
            <div className={"w-full md:w-2/3 h-[640px] flex items-center justify-center"}>
              {isLoading ? <PulseLoader color="#36d7b7"/> :
                <img className={"object-fill h-full"} src={imgSrc} alt="暂无图片"/>}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8"}>
            {
              historyImages?.map(url =>
                <Card key={url} className={"rounded-lg overflow-hidden"}>
                  <img src={url} alt="暂无图片"/>
                </Card>)
            }
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dall

