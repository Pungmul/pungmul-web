import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLightningMeetingAPI } from "../api/deleteLightningMeeting";
import { lightningQueryKeys } from "./queryKeys";

/**
 * 번개 모임 삭제하는 Mutation Hook
 */
export const useDeleteLightningMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLightningMeetingAPI,
    onSuccess: (data) => {
      // 참여 상태 쿼리 무효화하여 최신 상태로 업데이트
      return queryClient.invalidateQueries({
        queryKey: lightningQueryKeys.status(),
      });
      console.log("번개 삭제 성공:", data);
    },
    onError: (error) => {
      console.error("번개 삭제 중 에러:", error);
    },
  });
};
