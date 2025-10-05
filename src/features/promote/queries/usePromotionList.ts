import { useQuery } from "@tanstack/react-query";
import { fetchPromotionList } from "../api";

export const usePromotionList = () => {
  return useQuery({
    queryKey: ["promotionList"],
    queryFn: fetchPromotionList,
    staleTime: 0,
    gcTime: 2000,
  });
};


