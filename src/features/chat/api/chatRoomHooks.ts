import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { 
  loadChatLogs, 
  sendTextContent, 
  sendImageContent, 
  exitChat, 
  inviteUser 
} from "./chatRoomApis";

// 채팅 로그 조회 훅
export const useChatRoomQuery = (roomId: string) => {
  return useSuspenseQuery({
    queryKey: ["chatRoom", roomId],
    queryFn: () => loadChatLogs(roomId),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};

// 텍스트 메시지 전송 훅
export const useSendTextMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, message }: { roomId: string; message: { content: string } }) =>
      sendTextContent(roomId, message),
    onSuccess: (_, { roomId }) => {
      // 채팅방 데이터 무효화하여 최신 메시지 반영
      queryClient.invalidateQueries({ queryKey: ["chatRoom", roomId] });
    },
    onError: (error) => {
      console.error("텍스트 메시지 전송 실패:", error);
    },
  });
};

// 이미지 메시지 전송 훅
export const useSendImageMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, formData }: { roomId: string; formData: FormData }) =>
      sendImageContent(roomId, formData),
    onSuccess: (_, { roomId }) => {
      // 채팅방 데이터 무효화하여 최신 메시지 반영
      queryClient.invalidateQueries({ queryKey: ["chatRoom", roomId] });
    },
    onError: (error) => {
      console.error("이미지 메시지 전송 실패:", error);
    },
  });
};

// 채팅방 나가기 훅
export const useExitChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => exitChat(roomId),
    onSuccess: (_, roomId) => {
      // 채팅방 데이터 제거
      queryClient.removeQueries({ queryKey: ["chatRoom", roomId] });
      // 채팅방 목록 무효화
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    },
    onError: (error) => {
      console.error("채팅방 나가기 실패:", error);
    },
  });
};

// 사용자 초대 훅
export const useInviteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, data }: { roomId: string; data: { newUsernameList: string[] } }) =>
      inviteUser(roomId, data),
    onSuccess: (_, { roomId }) => {
      // 채팅방 데이터 무효화하여 새로운 사용자 정보 반영
      queryClient.invalidateQueries({ queryKey: ["chatRoom", roomId] });
    },
    onError: (error) => {
      console.error("사용자 초대 실패:", error);
    },
  });
}; 