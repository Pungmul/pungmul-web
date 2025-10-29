import { useQuery } from "@tanstack/react-query";
import { getUserParticipationStatusAPI } from "../api/getUserParticipationStatus";
import { lightningQueryKeys } from "./queryKeys";

/**
 * 사용자 번개 참여 상태를 조회하는 Query Hook
 */
export const useUserParticipationStatus = () => {
  return useQuery({
    queryKey: lightningQueryKeys.status(),
    queryFn: getUserParticipationStatusAPI,
    gcTime: 0,
    staleTime: 0,
    retry: 2,
  });
};
