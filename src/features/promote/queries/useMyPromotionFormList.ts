import { useQuery } from "@tanstack/react-query";
import { fetchMyPromotionFormList } from "../api";

export const useMyPromotionFormList = () => {
  return useQuery({
    queryKey: ["myPromotionFormList"],
    queryFn: fetchMyPromotionFormList,
    staleTime: 0,
    gcTime: 2000,
  });
};


