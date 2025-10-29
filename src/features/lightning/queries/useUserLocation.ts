import { useQuery } from "@tanstack/react-query";
import { getUserLocationAPI } from "../api/getUserLocation";
import { locationQueryKeys } from "./queryKeys";

/**
 * 사용자 위치를 조회하는 Query Hook
 */
export const useUserLocation = () => {
  return useQuery({
    queryKey: locationQueryKeys.userLocation(),
    queryFn: getUserLocationAPI,
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false, // 창 포커스 시 재요청 방지
    refetchOnMount: false, // 마운트 시 재요청 방지
    refetchOnReconnect: false, // 네트워크 재연결 시 재요청 방지
    retry: 2,
  });
};
