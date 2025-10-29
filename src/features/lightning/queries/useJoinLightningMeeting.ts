import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinLightningMeetingAPI } from "../api/joinLightningMeeting";
import { lightningQueryKeys } from "./queryKeys";

/**
 * 번개 모임 참여하는 Mutation Hook
 */
export const useJoinLightningMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { meetingId: number }) => joinLightningMeetingAPI(variables),
    onSuccess: () => {
      // 참여 상태 쿼리 무효화하여 최신 상태로 업데이트
      return queryClient
        .invalidateQueries({
          queryKey: lightningQueryKeys.status(),
        })
        .then(() => {
          console.log("번개 참여 성공");
        });
    },
    onError: (error) => {
      console.error("번개 참여 중 에러:", error);
    },
  });
};
