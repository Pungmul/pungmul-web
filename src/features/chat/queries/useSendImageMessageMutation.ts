import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendImageMessage } from "../api";

export const useSendImageMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      formData,
    }: {
      roomId: string;
      formData: FormData;
    }) => sendImageMessage(roomId, formData),
    onSuccess: (_, { roomId }) => {
      // 채팅방 데이터 무효화하여 최신 메시지 반영
      return queryClient.invalidateQueries({
        queryKey: ["chatRoom", "chatRoomInfinite", roomId],
      });
    },
    onError: (error) => {
      console.error("이미지 메시지 전송 실패:", error);
    },
  });
};
