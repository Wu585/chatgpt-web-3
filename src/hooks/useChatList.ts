import useSWR from "swr";
import {useUserStore} from "@/store/userStore.ts";
import {useAjax} from "@/lib/ajax.ts";

interface Chat {
  name: string
  userId: string
  id: string
  parentMessageId: string
}

export const useChatList = () => {
  const {user} = useUserStore();
  const {get} = useAjax();
  const key = user && user.id ? [`/sessionParentList/querySessionList`, user.id] : null;

  return useSWR(key, async (path) => {
    if (!user) {
      console.error("User is not defined");
      return null;
    }
    const response = await get<Resource<Chat[]>>(path[0], {
      params: {
        UserId: user.id
      }
    })

    return response.data.data
  })
}
