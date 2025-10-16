"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { loadChatRoomList } from "../api/loadChatRoomList";

export const useChatRoomListQuery = () => {
  return useSuspenseQuery({
    queryKey: ["chatRoomList"],
    queryFn: loadChatRoomList,
    retry: 2,
    staleTime: 0,
    gcTime: 0,
  });
};
