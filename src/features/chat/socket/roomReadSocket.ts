import { useCallback, useEffect } from "react";
import {
  SocketService,
  useSocketConnection,
  useSocketSubscription,
} from "@pThunder/core/socket";
import { useQueryClient } from "@tanstack/react-query";
import { ChatRoomListItemDto } from "../types";

export function useRoomReadSocket(roomId: string) {
  const queryClient = useQueryClient();
  const isConnected = useSocketConnection();

  const handleReadMessage = useCallback((message: unknown) => {
    console.log("Received read message:", message);
  }, []);

  const readSign = useCallback(() => {
    if (!isConnected) {
      console.warn("Cannot send read sign: WebSocket not connected");
      return;
    }

    const message = {
      chatRoomUUID: roomId,
    };

    SocketService.sendMessage(`/pub/chat/read/${roomId}`, message);

    queryClient.setQueryData(
      ["chatRoomList"],
      (prevData: ChatRoomListItemDto[] | undefined): ChatRoomListItemDto[] => {
        if (!prevData) return [];
        return prevData.map((room) =>
          room.chatRoomUUID === roomId ? { ...room, unreadCount: 0 } : room
        );
      }
    );
  }, [isConnected, queryClient, roomId]);
  
  useEffect(() => {
    if (!isConnected) {
      return;
    }
    readSign();
  }, [isConnected, readSign]);
  
  useSocketSubscription({
    topic: `/sub/chat/read/${roomId}`,
    onMessage: handleReadMessage,
    enabled: !!roomId,
  });

  return {
    readSign,
    isConnected,
  };
}
