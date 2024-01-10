import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUserStore} from "@/store/userStore.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useEffect} from "react";
import {Button} from "@/components/ui/button.tsx";
import {useAjax} from "@/lib/ajax.ts";
import {useToast} from "@/components/ui/use-toast.ts";

const formSchema = z.object({
  username: z.string().nonempty({
    message: "用户名不能为空"
  }),
})

const changePasswordFormSchema = z.object({
  lastPassword: z.string().nonempty({
    message: "旧密码不能为空"
  }),
  password: z.string().nonempty({
    message: "新密码不能为空"
  }),
  confirmPassword: z.string().nonempty({
    message: "确认密码不能为空"
  }),
}).refine(data => data.password === data["confirmPassword"], {
  message: "确认密码必须和新密码一致",
  path: ["confirmPassword"],
})


const UserInfo = () => {
  const {user, setUser} = useUserStore()
  const {post} = useAjax()
  const {toast} = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username,
    },
  })

  useEffect(() => {
    if (user) {
      form.setValue("username", user.username)
    }
  }, [user])

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    console.log(value);
    if (user) {
      post("/user/update", {
        id: user?.id,
        username: value.username
      }).then(() => {
        setUser({
          ...user,
          username: value.username
        })
        sessionStorage.setItem("userInfo", JSON.stringify({
          ...user,
          username: value.username
        }))
        toast({
          description: "修改用户成功！"
        })
      })
    }
  }

  const onLogout = () => {
    sessionStorage.removeItem("userInfo")
    window.location.reload();
  }

  const formChangePassword = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      lastPassword: "",
      password: "",
      confirmPassword: ""
    },
  })

  const onChangePassword = (value: z.infer<typeof changePasswordFormSchema>) => {
    if (user) {
      post("/user/update", {
        id: user.id,
        password: value.password
      }).then(() => {
        toast({
          description: "密码修改成功！请重新登录"
        })
        setUser(null)
        sessionStorage.removeItem("userInfo")
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      }).catch(() => {
        toast({
          description: "密码修改失败！",
          variant: "destructive"
        })
      })
    }
  }

  return (
    <div className={"min-h-full p-8"}>
      <header className={"mb-4"}>
        <h1 className={"mb-2 text-2xl font-bold text-black dark:text-white"}>个人中心</h1>
      </header>
      <main>
        <Tabs defaultValue="overview" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="overview" className={"px-16"}>总览</TabsTrigger>
            <TabsTrigger value="password" className={"px-16"}>密码</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className={"pr-8"}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField render={({field}) => (
                  <FormItem className={"py-2"}>
                    <FormLabel>昵称</FormLabel>
                    <FormControl>
                      <Input {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )} control={form.control} name={"username"}/>
                <div className={"flex space-x-4"}>
                  <Button type="submit" className={"my-2 text-white dark:text-black"}>更新</Button>
                  <Button type={"button"} className={"my-2 text-white dark:text-black"}
                          onClick={onLogout}>退出登录</Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="password" className={"pr-8"}>
            <Form {...formChangePassword}>
              <form onSubmit={formChangePassword.handleSubmit(onChangePassword)}>
                <FormField render={({field}) => (
                  <FormItem className={"py-2"}>
                    <FormLabel>旧密码</FormLabel>
                    <FormControl>
                      <Input {...field} type={"password"}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )} control={formChangePassword.control} name={"lastPassword"}/>
                <FormField render={({field}) => (
                  <FormItem className={"py-2"}>
                    <FormLabel>新密码</FormLabel>
                    <FormControl>
                      <Input {...field} type={"password"}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )} control={formChangePassword.control} name={"password"}/>
                <FormField render={({field}) => (
                  <FormItem className={"py-2"}>
                    <FormLabel>确认密码</FormLabel>
                    <FormControl>
                      <Input {...field} type={"password"}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )} control={formChangePassword.control} name={"confirmPassword"}/>
                <div className={"flex space-x-4"}>
                  <Button type="submit" className={"my-2 text-white dark:text-black"}>更新密码</Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default UserInfo

