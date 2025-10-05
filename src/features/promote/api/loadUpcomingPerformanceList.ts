import { PromotionResponseDto } from "../types";

export const loadUpcomingPerformanceList = async () => {
  const response = await fetch(`/api/promotions/responses/me`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseList: PromotionResponseDto[] = await response.json();
  return responseList;
};
