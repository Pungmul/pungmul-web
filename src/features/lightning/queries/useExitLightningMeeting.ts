import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exitLightningMeetingAPI } from "../api/exitLightningMeeting";
import { lightningQueryKeys } from "./queryKeys";

/**
 * 번개 모임 탈퇴하는 Mutation Hook
 */
export const useExitLightningMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exitLightningMeetingAPI,
    onSuccess: async (data) => {
      // 참여 상태 쿼리 무효화하여 최신 상태로 업데이트
      return await queryClient
        .invalidateQueries({
          queryKey: lightningQueryKeys.status(),
        })
        .then(() => {
          console.log("번개 탈퇴 성공:", data);
        });
    },
    onError: (error) => {
      console.error("번개 탈퇴 중 에러:", error);
    },
  });
};
