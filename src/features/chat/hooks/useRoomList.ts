"use client";
import { useEffect, useCallback } from "react";
import { useChatRoomStore } from "@pThunder/features/chat/store/chatRoomStore";
import { useChatRoomListQuery } from "../queries";
import { useRoomListSocket } from "../socket";
import { ChatRoomInfo, ChatRoomListItemDto } from "../types";
import { useQueryClient } from "@tanstack/react-query";

/**
 * 채팅방 목록을 관리하는 통합 훅
 * Query + Socket + Zustand를 조합해서 실시간 채팅방 목록 관리
 */
export const useRoomList = () => {
  const queryClient = useQueryClient();
  // React Query로 초기 데이터 로드
  const {
    data: queryData,
    isLoading: queryLoading,
    error: queryError,
    refetch,
    isRefetching,
  } = useChatRoomListQuery();
  // Zustand 스토어
  const {
    isLoading: storeLoading,
    totalUnreadCount,
    setChatRooms,
    setLoading,
    setSocketConnected,
    getRoomById,
    updateLastMessage,
    incrementUnreadCount,
    resetUnreadCount,
    markAllAsRead,
  } = useChatRoomStore();

  const chatRoomData = useChatRoomStore(state => state.chatRooms);

  // Socket 연결
  const { isConnected: socketConnected } = useRoomListSocket();

  // Query 데이터가 변경되면 스토어 업데이트
  useEffect(() => {
    if (queryData && Array.isArray(queryData)) {
      setChatRooms(queryData);
    }
  }, [queryData, setChatRooms]);

  // Socket 연결 상태 동기화
  useEffect(() => {
    setSocketConnected(socketConnected);
  }, [socketConnected, setSocketConnected]);

  // 로딩 상태 동기화
  useEffect(() => {
    setLoading(queryLoading || isRefetching);
  }, [queryLoading, isRefetching, setLoading]);

  // 채팅방 입장 시 읽지 않은 메시지 수 초기화
  const enterRoom = useCallback(
    (roomId: string) => {
      resetUnreadCount(roomId);
    },
    [resetUnreadCount]
  );

  // 특정 채팅방의 읽지 않은 메시지 수 가져오기
  const getUnreadCount = useCallback(
    (roomId: string) => {
      const room = getRoomById(roomId);
      return room?.unreadCount || 0;
    },
    [getRoomById]
  );

  // 채팅방 목록 새로고침
  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // 수동으로 특정 룸 업데이트
  const updateRoom = useCallback(
    (roomId: string, updates: Partial<ChatRoomListItemDto>) => {
      // 스토어 업데이트
      useChatRoomStore.getState().updateChatRoom(roomId, updates);

      // Query 캐시도 업데이트
      queryClient.setQueryData(
        ["chatRoomList"],
        (oldData: ChatRoomInfo[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((room) =>
            room.chatRoomUUID === roomId ? { ...room, ...updates } : room
          );
        }
      );
    },
    [queryClient]
  );

  // 새 메시지 수신 시 처리
  const handleNewMessage = useCallback(
    (roomId: string, content: string, timestamp: string) => {
      updateLastMessage(roomId, content, timestamp);
      incrementUnreadCount(roomId);
    },
    [updateLastMessage, incrementUnreadCount]
  );

  return {
    // 데이터
    chatRooms: chatRoomData, // 항상 정렬된 목록 반환
    totalUnreadCount,

    // 상태
    isLoading: storeLoading,
    isSocketConnected: socketConnected,
    isRealtime: socketConnected && !storeLoading,
    error: queryError,

    // 액션들
    enterRoom,
    getUnreadCount,
    refresh,
    updateRoom,
    handleNewMessage,
    markAllAsRead,

    // 특정 채팅방 관련
    getRoomById,
  };
};
