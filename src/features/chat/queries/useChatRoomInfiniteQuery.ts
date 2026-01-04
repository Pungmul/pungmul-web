import { useInfiniteQuery } from "@tanstack/react-query";
import { loadChatLogs } from "../api";
import { chatQueryKeys } from "./keys";
import {
  DEFAULT_STALE_TIME_MS,
  DEFAULT_GC_TIME_MS,
  CHAT_LOG_PAGE_SIZE,
  CHAT_LOG_INITIAL_PAGE,
} from "../constant/query";

export const useChatRoomInfiniteQuery = (roomId: string) => {
  return useInfiniteQuery({
    queryKey: chatQueryKeys.roomInfinite(roomId),
    queryFn: ({ pageParam = CHAT_LOG_INITIAL_PAGE }) => loadChatLogs(roomId, pageParam),
    getNextPageParam: (lastPage) => {
      // hasNextPage가 true이면 다음 페이지 번호 반환, 아니면 undefined
      if (lastPage.size < CHAT_LOG_PAGE_SIZE) {
        return undefined;
      }
      return (lastPage.pageNum ?? CHAT_LOG_INITIAL_PAGE) + 1;
    },
    initialPageParam: CHAT_LOG_INITIAL_PAGE,
    staleTime: DEFAULT_STALE_TIME_MS,
    gcTime: DEFAULT_GC_TIME_MS,
    refetchOnMount: "always"
  });
};
