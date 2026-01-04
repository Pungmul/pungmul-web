"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { loadChatRoomList } from "../api/loadChatRoomList";
import { chatQueryKeys } from "./keys";

export const useChatRoomListQuery = () => {
  return useSuspenseQuery({
    queryKey: chatQueryKeys.roomList(),
    queryFn: loadChatRoomList,
    retry: 2,
    staleTime: 0,
    gcTime: 0,
  });
};
