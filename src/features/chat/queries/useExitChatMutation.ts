import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exitChat } from "../api";
import { chatQueryKeys } from "./keys";

export const useExitChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => exitChat(roomId),
    onSuccess: async (_, roomId) => {
      // 채팅방 데이터 제거
      await queryClient.invalidateQueries({
        queryKey: chatQueryKeys.room(roomId),
      });
      
      await queryClient.invalidateQueries({
        queryKey: chatQueryKeys.roomInfinite(roomId),
      });
    },
    onError: (error) => {
      console.error("채팅방 나가기 실패:", error);
    },
  });
};
