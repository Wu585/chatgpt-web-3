import useSWR from "swr";
import {useUserStore} from "@/store/userStore.ts";
import {useAjax} from "@/lib/ajax.ts";

export const useGetMessagesById = (chatId?: string) => {
  const {user} = useUserStore();
  const {get} = useAjax();

  const key = chatId && user && user.id ? [`/api/userSessionMessage/getSessionsByUserIdAndChatId`, user.id, chatId] : null;

  return useSWR(key,
    async ([url, userId, chatId]) => {
      if (!user) {
        console.error("User is not defined");
        return null;
      }

      if (!chatId) {
        console.error("chatId is not defined");
        return null;
      }

      console.log("Making API request with userId:", user.id, "and chatId:", chatId);

      const response = await get<Resource<{
        chatId: string;
        answer: string;
        question: string;
        name: string;
      }[]>>(url, {
        params: {
          userId,
          chatId,
        },
      });

      return response.data.data;
    }
  );
};
