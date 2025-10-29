import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserLocationAPI } from "../api/updateUserLocation";
import { locationQueryKeys } from "./queryKeys";

/**
 * 사용자 위치 업데이트하는 Mutation Hook
 */
export const useUpdateUserLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserLocationAPI,
    onSuccess: () => {
      // 사용자 위치 쿼리 무효화하여 최신 위치로 업데이트
      return queryClient.invalidateQueries({
        queryKey: locationQueryKeys.userLocation(),
      }).then(()=>{
        console.log("사용자 위치 업데이트 성공");
      });
    },
    onError: (error) => {
      console.error("사용자 위치 업데이트 중 에러:", error);
    },
  });
};
