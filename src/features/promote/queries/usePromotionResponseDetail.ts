import { useSuspenseQuery } from "@tanstack/react-query";
import { loadPromotionResponseDetail } from "../api";

export const usePromotionResponseDetail = (responseId: string) => {
  return useSuspenseQuery({
    queryKey: ["promotionResponseDetail", responseId],
    queryFn: () => loadPromotionResponseDetail(responseId),
  });
};
