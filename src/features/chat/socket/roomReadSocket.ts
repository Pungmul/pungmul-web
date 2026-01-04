import { useCallback, useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import {
  SocketService,
  useSocketConnection,
  useSocketSubscription,
} from "@/core/socket";

import { ChatRoomDto, ChatRoomListItemDto } from "../types";
import { useGetToken } from "@pThunder/features/auth";

/**
 * 서버에서 받는 읽음 처리 소켓 메시지 타입
 */
interface ReadSocketMessage {
  messageLogId: number;
  domainType: string;
  businessIdentifier: string;
  identifier: string; // chatRoomUUID
  stompDest: string;
  content: {
    userId: number;
    messageIds: number[];
    readAt: string;
  };
}

/**
 * 채팅방의 읽음 처리를 관리하는 소켓 훅
 *
 * @description
 * 1. 사용자가 메시지를 읽었음을 서버에 알림 (readSign)
 * 2. 다른 사용자의 읽음 상태를 실시간으로 수신
 * 3. Query 캐시를 업데이트하여 UI에 자동 반영
 *
 * @example
 * const { readSign, isConnected } = useRoomReadSocket(roomId);
 *
 * // 새 메시지 받았을 때
 * readSign();
 */
export function useRoomReadSocket(roomId: string) {
  const queryClient = useQueryClient();
  const isConnected = useSocketConnection();
  const { data: token } = useGetToken();

  // 페이지 가시성 상태 추적
  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);

  // 읽음 처리 대기 플래그
  const pendingReadSignRef = useRef(false);

  /**
   * 다른 사용자의 읽음 상태 업데이트 처리
   * 소켓으로 받은 읽음 정보를 Query 캐시에 반영
   */
  const handleReadMessage = useCallback(
    (message: unknown) => {
      const readMessage = message as ReadSocketMessage;
      console.log("Received read message:", readMessage);

      const { userId, messageIds } = readMessage.content;

      // messageIds가 비어있으면 현재 메시지 리스트의 최신 메시지 ID 사용
      const chatRoomData = queryClient.getQueryData<ChatRoomDto>([
        "chatRoom",
        roomId,
      ]);

      let lastReadMessageId: number | null = null;

      if (messageIds.length > 0) {
        // messageIds가 있으면 그 중 최대값 사용
        lastReadMessageId = Math.max(...messageIds);
      } else if (chatRoomData?.messageList?.list) {
        // messageIds가 없으면 현재 메시지 리스트의 최신 메시지 ID 사용
        const messageList = chatRoomData.messageList.list;
        const latestMessage = messageList[messageList.length - 1];
        if (latestMessage && typeof latestMessage.id === "number") {
          lastReadMessageId = latestMessage.id;
        }
      }

      if (lastReadMessageId === null) {
        console.warn("Cannot determine lastReadMessageId, skipping update");
        return;
      }

      // ChatRoom 쿼리의 userInitReadList 업데이트
      queryClient.setQueryData<ChatRoomDto>(
        ["chatRoom", roomId],
        (prevData) => {
          if (!prevData) return prevData;

          return {
            ...prevData,
            userInitReadList: prevData.userInitReadList.map((user) =>
              user.userId === userId ? { ...user, lastReadMessageId } : user
            ),
          };
        }
      );

      console.log(
        `Updated userInitReadList for userId: ${userId}, lastReadMessageId: ${lastReadMessageId}`
      );
    },
    [queryClient, roomId]
  );

  /**
   * 현재 사용자의 읽음 상태를 서버에 전송
   *
   * @description
   * - 페이지가 보이는 상태에서만 읽음 신호 전송
   * - 페이지가 숨겨진 상태면 대기 플래그 설정
   * - ChatRoomList의 unreadCount를 즉시 0으로 업데이트 (낙관적 업데이트)
   * - 실제 읽음 처리는 서버에서 소켓으로 브로드캐스트됨
   */
  const readSign = useCallback(() => {
    // 토큰이 없으면 (로그아웃 상태) 읽음 신호 전송하지 않음
    if (!token) {
      console.warn("Cannot send read sign: No token (logged out)");
      return;
    }

    if (!isConnected) {
      console.warn("Cannot send read sign: WebSocket not connected");
      return;
    }

    // 페이지가 보이지 않으면 읽음 처리 보류
    if (!isPageVisible) {
      console.log("Page not visible, pending read sign");
      pendingReadSignRef.current = true;
      return;
    }

    const message = {
      chatRoomUUID: roomId,
    };

    // 서버에 읽음 신호 전송
    SocketService.sendMessage(`/pub/chat/read/${roomId}`, message);
    // 대기 플래그 초기화
    pendingReadSignRef.current = false;
    // ChatRoomList의 unreadCount 즉시 업데이트 (낙관적 업데이트)
    queryClient.setQueryData<ChatRoomListItemDto[]>(
      ["chatRoomList"],
      (prevData) => {
        if (!prevData) return [];
        return prevData.map((room) =>
          room.chatRoomUUID === roomId ? { ...room, unreadCount: 0 } : room
        );
      }
    );
  }, [token, isConnected, isPageVisible, queryClient, roomId]);

  /**
   * 페이지 가시성 변경 감지
   * - 페이지가 보이게 되면 대기 중인 읽음 처리 실행
   * - 페이지가 숨겨지면 읽음 처리 중단
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hasFocus();
      setIsPageVisible(visible);

      // 페이지가 다시 보이게 되고, 대기 중인 읽음 처리가 있고, 토큰이 있으면 실행
      if (visible && pendingReadSignRef.current && token) {
        console.log("Page became visible, executing pending read sign");
        readSign();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [readSign, token]);

  /**
   * 연결 시 자동으로 읽음 처리
   * 채팅방 진입 시 자동으로 읽음 신호 전송
   */
  useEffect(() => {
    // 토큰이 없으면 (로그아웃 상태) 읽음 신호 전송하지 않음
    if (!token || !isConnected) {
      return;
    }
    readSign();
  }, [token, isConnected, readSign]);

  /**
   * 읽음 상태 소켓 구독
   * 다른 사용자의 읽음 상태를 실시간으로 수신
   */
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
