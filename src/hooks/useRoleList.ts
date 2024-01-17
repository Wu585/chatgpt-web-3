import useSWR from "swr";
import {useAjax} from "@/lib/ajax.ts";

interface Role {
  id: string
  title: string
  iconUrl: string
  remark: string
}

export const useRoleList = () => {
  const {get} = useAjax();

  return useSWR("/actors", async (path) => (await get<Role[]>(path)).data)
}
