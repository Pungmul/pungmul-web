import { PromotionResponseDetailDto } from "@pThunder/features/promote/types";

export const loadPromotionResponseDetail = async (responseId: string) => {
  const response = await fetch(
    `/api/promotions/responses/${responseId}`
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const responseDetail: PromotionResponseDetailDto = await response.json();
  return responseDetail;
};