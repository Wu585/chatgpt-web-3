import useSWR from "swr";
import {useAjax} from "@/lib/ajax.ts";
import {cleanObject} from "@/lib/cleanObject.ts";

interface Role {
  id: string
  title: string
  iconUrl: string
  remark: string
}

export const useRoleList = (keyword: string) => {
  const {get} = useAjax();

  return useSWR([`/actors`, keyword], async ([path, keyword]) => (await get<Role[]>(path, {
    params: cleanObject({keyword})
  })).data)
}
