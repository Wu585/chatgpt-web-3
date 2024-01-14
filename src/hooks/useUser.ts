import {useAjax} from "@/lib/ajax.ts";
import useSWR from "swr";

export const useUser = () => {
  const {get} = useAjax()

  return useSWR('/users/current-user', async (path) => {
    const response = await get<{
      username: string
      id: string
    }>(path)

    return response.data
  })

}
