import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exitChat } from "../api";

export const useExitChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => exitChat(roomId),
    onSuccess: async (_, roomId) => {
      // 채팅방 데이터 제거
      await queryClient.invalidateQueries({
        queryKey: ["chatRoom", roomId],
      });
      
      await queryClient.invalidateQueries({
        queryKey: ["chatRoomInfinite", roomId],
      });
    },
    onError: (error) => {
      console.error("채팅방 나가기 실패:", error);
    },
  });
};
