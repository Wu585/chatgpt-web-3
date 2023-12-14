import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link, useNavigate} from "react-router-dom";
import ModeToggle from "@/components/mode-toggle.tsx";
import {useUserStore} from "@/store/userStore.ts";
import {useToast} from "@/components/ui/use-toast.ts";
import axios from "axios";

const formSchema = z.object({
  username: z.string().nonempty({
    message: "用户名不能为空"
  }),
  password: z.string().nonempty({
    message: "密码不能为空"
  }),
})

const SignIn = () => {
  const {setUser} = useUserStore()
  const {toast} = useToast()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await axios({
      method: "POST",
      url: "api/user/login",
      data: {
        username: values.username,
        password: values.password
      }
    })
    const data = res.data.data[0]
    setUser(data)
    sessionStorage.setItem("userInfo", JSON.stringify(data))
    toast({
      description: "登录成功"
    })
    navigate("/home")
  }

  return (
    <div className={"h-screen w-full dark:bg-[#11114] bg-secondary flex"}>
      <div
        className={"border-solid border-2 m-auto bg-white dark:bg-[#18181c] w-[420px] rounded-md"}>
        <div className={"p-6"}>
          <header>
            <h1 className={"text-3xl font-bold dark:text-white"}>登录 聊天机器人</h1>
          </header>
          <main>
            <p className={"mb-3 mt-2"}>
              <span className={"pr-1 text-black dark:text-white"}>新用户？</span>
              <Link to={"/sign-up"} className={"text-[#eb2f96]"}>注册账号</Link>
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField render={({field}) => (
                  <FormItem className={"py-2"}>
                    <FormControl>
                      <Input placeholder={"请输入用户名"} {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )} control={form.control} name={"username"}/>
                <FormField render={({field}) => (
                  <FormItem className={"py-2"}>
                    <FormControl>
                      <Input placeholder={"请输入密码"} {...field} type={"password"}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )} control={form.control} name={"password"}/>
                <Button type="submit" className={"w-full my-2 bg-secondary text-black dark:text-white"}>登录</Button>
              </form>
            </Form>
          </main>
          <footer>
            <ModeToggle/>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default SignIn

