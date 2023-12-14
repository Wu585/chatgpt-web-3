import {Outlet} from "react-router-dom";
import Sidebar from "@/components/Sidebar.tsx";

const MainLayout = () => {
  return (
    <div className={"h-screen flex"}>
      <Sidebar/>
      <div className={"h-full w-full bg-[#f3f4fc] dark:bg-[#101014]"}>
        <Outlet/>
      </div>
    </div>
  );
}

export default MainLayout

