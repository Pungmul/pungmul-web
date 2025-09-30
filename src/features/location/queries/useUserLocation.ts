import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserLocation } from "../api";
import { locationQueryKeys } from "../constant/queryKeys";

export const useUserLocation = () => {
  return useSuspenseQuery({
    queryKey: locationQueryKeys.user(),
    queryFn: getUserLocation,
    staleTime: 1000 * 30,
    gcTime: 1000 * 30,
  });
};

