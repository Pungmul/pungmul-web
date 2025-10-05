import { PromotionDetail } from "../types";

export const loadPromotionDetail = async (publicId: string) => {
  const response = await fetch(`/api/promotions/detail/${publicId}`);
  const performance: PromotionDetail = await response.json();
  return performance;
};
