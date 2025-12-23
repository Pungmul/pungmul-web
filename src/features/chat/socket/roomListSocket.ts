"use client";
import { useCallback, useEffect, useRef } from "react";
import { useGetMyPageInfo } from "@pThunder/features/my-page";
import { ChatRoomListItemDto, ChatRoomUpdateMessage } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { useChatRoomStore } from "../store/chatRoomStore";
import { useSocketSubscription } from "@pThunder/core/socket/hooks/useSocketSubscribe";

export function useRoomListSocket() {
  const { data: userData } = useGetMyPageInfo();
  const queryClient = useQueryClient();

  const currentChatRoomId = useChatRoomStore((state) => state.focusingRoomId);
  const idRef = useRef<string>(currentChatRoomId);

  useEffect(() => {
    idRef.current = currentChatRoomId;
  }, [currentChatRoomId]);

  const recieveMessage = useCallback(
    (message: ChatRoomUpdateMessage) => {
      const oldData = queryClient.getQueryData<ChatRoomListItemDto[]>([
        "chatRoomList",
      ]);
      if (!oldData) return;

      const room = oldData.find(
        (room) => room.chatRoomUUID === message.chatRoomUUID
      );
      if (!room) {
        queryClient.invalidateQueries({ queryKey: ["chatRoomList"] });
        return;
      }

      const { chatRoomUUID: roomId, content, timestamp } = message;
      queryClient.setQueryData(
        ["chatRoomList"],
        (oldData: ChatRoomListItemDto[] | undefined) => {
          if (!oldData) return oldData;
          return oldData
            .map((room) => {
              return room.chatRoomUUID === roomId
                ? {
                    ...room,
                    lastMessageContent: content,
                    lastMessageTime: timestamp,
                    unreadCount:
                      idRef.current === roomId
                        ? 0
                        : room.unreadCount
                        ? room.unreadCount + 1
                        : 1,
                  }
                : room;
            })
            .sort((a, b) => {
              return (
                new Date(b.lastMessageTime ?? "").getTime() -
                new Date(a.lastMessageTime ?? "").getTime()
              );
            });
        }
      );
    },
    [queryClient]
  );

  useSocketSubscription({
    topic: `/sub/chat/notification/${userData?.username}`,
    onMessage: recieveMessage,
    enabled: !!userData?.username,
  });
}
