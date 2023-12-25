import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "@/components/theme-provider"
import Home from "@/pages/Home.tsx";
import SignIn from "@/pages/SignIn.tsx";
import SignUp from "@/pages/SignUp.tsx";
import MainLayout from "@/components/MainLayout.tsx";
import Chat from "@/components/Chat.tsx";
import Dall from "@/pages/Dall.tsx";
import Write from "@/pages/Write.tsx";
import {Toaster} from "@/components/ui/toaster"
import AuthNoLogin from "@/components/AuthNoLogin.tsx";
import {useChatList} from "@/hooks/useChatList.ts";

function App() {
  const {data: chatList} = useChatList()

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <HashRouter>
        <Routes>
          <Route path={"/"} element={<AuthNoLogin>
            <MainLayout/>
          </AuthNoLogin>}>
            <Route path={""} element={<Navigate to={"home"}/>}/>
            <Route path={"home"} element={<Home/>}/>
            <Route path={"chat"} element={<Navigate to={chatList ? `/chat/${chatList[0].parentMessageId}` : ""}/>}/>
            <Route path={"chat/:chatId"} element={<Chat/>}/>
            <Route path={"dall"} element={<Dall/>}/>
            <Route path={"write"} element={<Write/>}/>
          </Route>
        </Routes>
        <Routes>
          <Route path={"sign-in"} element={<SignIn/>}/>
        </Routes>
        <Routes>
          <Route path={"sign-up"} element={<SignUp/>}/>
        </Routes>
      </HashRouter>
      <Toaster/>
    </ThemeProvider>
  )
}

export default App
