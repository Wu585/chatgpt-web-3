import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "@/components/theme-provider"
import Home from "@/pages/Home.tsx";
import SignIn from "@/pages/SignIn.tsx";
import SignUp from "@/pages/SignUp.tsx";
import MainLayout from "@/components/MainLayout.tsx";
import Chat from "@/components/Chat.tsx";
import Dall from "@/pages/Dall.tsx";
import Write from "@/pages/Write.tsx";
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<MainLayout/>}>
            <Route path={"home"} element={<Home/>}/>
            <Route path={"chat"} element={<Chat/>}/>
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
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
