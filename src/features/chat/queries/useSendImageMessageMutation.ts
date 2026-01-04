import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendImageMessage } from "../api";
import { chatQueryKeys } from "./keys";

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
        queryKey: chatQueryKeys.room(roomId),
      });
    },
    onError: (error) => {
      console.error("이미지 메시지 전송 실패:", error);
    },
  });
};
