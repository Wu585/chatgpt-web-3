import {Outlet} from "react-router-dom";
import Sidebar from "@/components/Sidebar.tsx";

const MainLayout = () => {
  return (
    <div className={"h-screen flex md:flex-row"}>
      <div className={"fixed bottom-0 z-10 w-full md:w-auto md:relative "}>
        <Sidebar/>
      </div>
      <div className={"h-full w-full bg-[#f3f4fc] dark:bg-[#101014]"}>
        <Outlet/>
      </div>
    </div>
  );
}

export default MainLayout

