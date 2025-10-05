import { useSuspenseQuery } from "@tanstack/react-query";
import { loadPromotionDetail } from "../api";

export const usePromotionDetailQuery = (targetPerformanceKey: string) => {
  return useSuspenseQuery({
    queryKey: ["promotionDetail", targetPerformanceKey],
    queryFn: () => loadPromotionDetail(targetPerformanceKey),
  });
};
