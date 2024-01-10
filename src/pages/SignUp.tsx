import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link, useNavigate} from "react-router-dom";
import ModeToggle from "@/components/mode-toggle.tsx";
import {useAjax} from "@/lib/ajax.ts";
import {useToast} from "@/components/ui/use-toast.ts";

const formSchema = z.object({
  username: z.string().nonempty({
    message: "用户名不能为空"
  }),
  password: z.string().nonempty({
    message: "密码不能为空"
  }),
  "confirm-password": z.string().nonempty({
    message: "确认密码不能为空"
  }),
}).refine(data => data.password === data["confirm-password"], {
  message: "确认密码必须和密码一致",
  path: ["confirm-password"],
})

const SignUp = () => {
  const {toast} = useToast()
  const {post} = useAjax()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      "confirm-password": ""
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    post("/auth/sign-up", {
      username: values.username,
      password: values.password
    }).then(() => {
      toast({
        description: "注册成功，请登录!"
      })
      navigate("/sign-in")
    }).catch(() => {
      toast({
        description: "注册失败",
        variant: "destructive"
      })
    })
  }

  return (
    <div className={"h-screen w-full dark:bg-[#11114] bg-secondary flex"}>
      <div
        className={"border-solid border-2 m-auto bg-white dark:bg-[#18181c] w-[420px] rounded-md"}>
        <div className={"p-6"}>
          <header>
            <h1 className={"text-3xl font-bold dark:text-white"}>注册 聊天机器人</h1>
          </header>
          <main>
            <p className={"mb-3 mt-2"}>
              <span className={"pr-1 text-black dark:text-white"}>已有账号？</span>
              <Link to={"/sign-in"} className={"text-[#eb2f96]"}>去登录</Link>
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
                <FormField render={({field}) => (
                  <FormItem className={"py-2"}>
                    <FormControl>
                      <Input placeholder={"请确认密码"} {...field} type={"password"}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )} control={form.control} name={"confirm-password"}/>
                <Button type="submit" className={"w-full my-2 bg-secondary text-black dark:text-white"}>注册</Button>
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

export default SignUp

