import {useUserStore} from "@/store/userStore.ts";
import {Navigate} from "react-router-dom";
import {ReactNode, useEffect} from "react";

const AuthNoLogin = ({children}: { children: ReactNode }) => {
  console.log("认证权限")
  const {user, setUser} = useUserStore()
  useEffect(() => {
    console.log("路由刷新了")
    const userInfo = sessionStorage.getItem("userInfo")
    if (userInfo) {
      setUser(JSON.parse(userInfo))
    }
  }, [])
  if (!user && !sessionStorage.getItem("userInfo")) {
    return <Navigate to={"/sign-in"} replace/>
  }
  return children;
}

export default AuthNoLogin

