import {Outlet} from "react-router-dom";
import Sidebar from "@/components/Sidebar.tsx";

const MainLayout = () => {
  return (
    <div className={"h-screen flex flex-col-reverse md:flex-row"}>
      <div className={"z-10 w-full md:w-auto"}>
        <Sidebar/>
      </div>
      <div className={"flex-1 w-full bg-[#f3f4fc] dark:bg-[#101014] overflow-auto"}>
        <Outlet/>
      </div>
    </div>
  );
}

export default MainLayout

