import useSWR from "swr";
import {useAjax} from "@/lib/ajax.ts";
import {cleanObject} from "@/lib/cleanObject.ts";

interface Role {
  id: string
  title: string
  iconUrl: string
  remark: string
}

export const useRoleList = (searchParam: {
  keyword: string,
  page: number,
  perPage: number
}) => {
  const {get} = useAjax();

  return useSWR([`/actors`, searchParam], async ([path, searchParam]) => (await get<{
    actors: Role[],
    counts: number
  }>(path, {
    params: cleanObject(searchParam)
  })).data)
}
