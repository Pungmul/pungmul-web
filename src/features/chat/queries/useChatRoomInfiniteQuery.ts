import { useInfiniteQuery } from "@tanstack/react-query";
import { loadChatLogs } from "../api";

export const useChatRoomInfiniteQuery = (roomId: string) => {
  return useInfiniteQuery({
    queryKey: ["chatRoomInfinite", roomId],
    queryFn: ({ pageParam = 2 }) => loadChatLogs(roomId, pageParam),
    getNextPageParam: (lastPage) => {
      // hasNextPage가 true이면 다음 페이지 번호 반환, 아니면 undefined
      if (lastPage.size < 20) {
        return undefined;
      }
      return (lastPage.pageNum ?? 2) + 1;
    },
    initialPageParam: 2,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    refetchOnMount: "always"
  });
};
