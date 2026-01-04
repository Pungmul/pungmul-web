"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Alert } from "@/shared";

import { useExitChatMutation } from "../queries";
import { chatQueryKeys } from "../queries/keys";
import { removeChatRoom } from "../services/chatRoomListUpdater";
import type { ChatRoomListItemDto } from "../types";

interface UseExitChatRoomOptions {
  roomId: string;
  /** 나가기 성공 후 리다이렉트 경로 (기본값: /chats/r/inbox) */
  redirectPath?: string;
}

/**
 * 채팅방 나가기 기능을 제공하는 훅
 * - 확인 다이얼로그 표시
 * - 채팅방 나가기 API 호출
 * - 관련 쿼리 캐시 정리
 * - 목록 페이지로 리다이렉트
 */
export const useExitChatRoom = ({
  roomId,
  redirectPath = "/chats/r/inbox",
}: UseExitChatRoomOptions) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const exitChatMutation = useExitChatMutation();

  const exitChatRoom = useCallback(() => {
    Alert.confirm({
      title: "채팅방 나가기",
      message: "채팅방을 나가시겠습니까?",
      confirmColor: "var(--color-red-500)",
      onConfirm: () => {
        exitChatMutation.mutate(roomId, {
          onSuccess: async () => {
            // 해당 채팅방 쿼리 캐시 제거
            queryClient.removeQueries({
              queryKey: chatQueryKeys.room(roomId),
            });
            queryClient.removeQueries({
              queryKey: chatQueryKeys.roomInfinite(roomId),
            });

            // 채팅방 목록에서 제거
            queryClient.setQueryData(
              chatQueryKeys.roomList(),
              (old: ChatRoomListItemDto[] | undefined) =>
                old ? removeChatRoom(old, roomId) : [],
            );

            // 목록 페이지로 이동
            router.replace(redirectPath);
          },
          onError: () => {
            Alert.alert({
              title: "채팅방 나가기 실패",
              message: "채팅방 나가기에 실패했습니다.\n다시 시도해주세요.",
            });
          },
        });
      },
    });
  }, [roomId, redirectPath, router, queryClient, exitChatMutation]);

  return {
    exitChatRoom,
    isExiting: exitChatMutation.isPending,
  };
};
