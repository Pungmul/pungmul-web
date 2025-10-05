import { PromotionResponseDetailDto } from "../types";

export const cancelResponseAPI = async (responseId: string) => {
  const response = await fetch(`/api/promotions/responses/${responseId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const responseDetail: PromotionResponseDetailDto = await response.json();
  return responseDetail;
};

