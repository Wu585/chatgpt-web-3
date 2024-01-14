import useSWR from "swr";
import {useAjax} from "@/lib/ajax.ts";

export interface Message {
  id: string
  role: "assistant" | "user" | "system"
  content: string
}

export const useGetMessagesById = (chatId?: string) => {
  const {get} = useAjax();

  const key = chatId ? ['/messages', chatId] : false

  return useSWR(key,
    async ([path, chatId]) => (await get<Message[]>(path, {
      params: {chatId}
    })).data);
};
