import {useAjax} from "@/lib/ajax.ts";
import useSWR from "swr";

export const useHistoryImages = () => {
  const {get} = useAjax();

  return useSWR("/images/history", async (path) => (await get<string[]>(path)).data)
}
