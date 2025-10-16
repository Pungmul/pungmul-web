import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendTextMessage } from "../api";

export const useSendTextMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      message,
    }: {
      roomId: string;
      message: { content: string };
    }) => sendTextMessage(roomId, message),
    onSuccess: (_, { roomId }) => {
      // 채팅방 데이터 무효화하여 최신 메시지 반영
      return queryClient.invalidateQueries({
        queryKey: ["chatRoom", "chatRoomInfinite", roomId],
      });
    },
    onError: (error) => {
      console.error("텍스트 메시지 전송 실패:", error);
    },
  });
};
