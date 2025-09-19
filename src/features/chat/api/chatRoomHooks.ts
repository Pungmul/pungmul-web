import {
  useMutation,
  useInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  loadChatLogs,
  loadChatRoomInfo,
  sendTextContent,
  sendImageContent,
  exitChat,
  inviteUser,
} from "./chatRoomApis";
import { getQueryClient } from "@pThunder/core";

// 채팅 로그 조회 훅 (기존 단일 쿼리)
export const useChatRoomQuery = (roomId: string) => {
  return useSuspenseQuery({
    queryKey: ["chatRoom", roomId],
    queryFn: () => loadChatRoomInfo(roomId),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};

// 채팅 로그 무한 스크롤 훅
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
  });
};

// 텍스트 메시지 전송 훅
export const useSendTextMessageMutation = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      message,
    }: {
      roomId: string;
      message: { content: string };
    }) => sendTextContent(roomId, message),
    onSuccess: (_, { roomId }) => {
      // 채팅방 데이터 무효화하여 최신 메시지 반영
      return queryClient.invalidateQueries({ queryKey: ["chatRoom" , "chatRoomInfinite", roomId] });

    },
    onError: (error) => {
      console.error("텍스트 메시지 전송 실패:", error);
    },
  });
};

// 이미지 메시지 전송 훅
export const useSendImageMessageMutation = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      formData,
    }: {
      roomId: string;
      formData: FormData;
    }) => sendImageContent(roomId, formData),
    onSuccess: (_, { roomId }) => {
      // 채팅방 데이터 무효화하여 최신 메시지 반영
      return queryClient.invalidateQueries({ queryKey: ["chatRoom", "chatRoomInfinite", roomId] });

    },
    onError: (error) => {
      console.error("이미지 메시지 전송 실패:", error);
    },
  });
};

// 채팅방 나가기 훅
export const useExitChatMutation = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => exitChat(roomId),
    onSuccess: (_, roomId) => {
      // 채팅방 데이터 제거
      return queryClient.removeQueries({ queryKey: ["chatRoom", "chatRoomInfinite", roomId] });
    },
    onError: (error) => {
      console.error("채팅방 나가기 실패:", error);
    },
  });
};

// 사용자 초대 훅
export const useInviteUserMutation = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      data,
    }: {
      roomId: string;
      data: { newUsernameList: string[] };
    }) => inviteUser(roomId, data),
    onSuccess: (_, { roomId }) => {
      // 채팅방 데이터 무효화하여 새로운 사용자 정보 반영
      return queryClient.invalidateQueries({ queryKey: ["chatRoom", "chatRoomInfinite", roomId] });
    },
    onError: (error) => {
      console.error("사용자 초대 실패:", error);
    },
  });
};
