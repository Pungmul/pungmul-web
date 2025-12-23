import { useSuspenseQuery } from "@tanstack/react-query";
import { loadChatRoomInfo } from "../api";

export const useChatRoomQuery = (roomId: string) => {
  return useSuspenseQuery({
    queryKey: ["chatRoom", roomId],
    queryFn: () => loadChatRoomInfo(roomId),
    retry: 0,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    refetchOnMount: "always"
  });
};
