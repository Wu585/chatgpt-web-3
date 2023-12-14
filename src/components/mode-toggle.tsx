import {useTheme} from "@/components/theme-provider.tsx";
import {Moon, Sun} from "lucide-react";

const ModeToggle = () => {
  const {setTheme, theme} = useTheme()

  const onChangeMode = () => {
    theme === "light" ? setTheme("dark") : setTheme("light")
  }

  return (
    <div className={"flex cursor-pointer"}>
      <div onClick={onChangeMode}>
        {theme === "light" ? <Moon className={"w-6 h-6"}/> : <Sun className={"w-6 h-6"}/>}
      </div>
      {/*<div onClick={onChangeMode}>
        {theme === "light" ? "暗黑" : "白天"}
      </div>*/}
    </div>
  );
}

export default ModeToggle

