import useSWR from "swr";
import {useAjax} from "@/lib/ajax.ts";

interface Chat {
  id: string
  title: string
}

export const useChatList = () => {
  const {get} = useAjax();

  return useSWR("/chats", async (path) => (await get<Chat[]>(path)).data)
}
