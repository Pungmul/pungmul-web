import { useSuspenseQuery } from "@tanstack/react-query";
import { loadChatRoomInfo } from "../api";
import { chatQueryKeys } from "./keys";
import { DEFAULT_STALE_TIME_MS, DEFAULT_GC_TIME_MS } from "../constant/query";

export const useChatRoomQuery = (roomId: string) => {
  return useSuspenseQuery({
    queryKey: chatQueryKeys.room(roomId),
    queryFn: () => loadChatRoomInfo(roomId),
    retry: 0,
    staleTime: DEFAULT_STALE_TIME_MS,
    gcTime: DEFAULT_GC_TIME_MS,
    refetchOnMount: "always"
  });
};
