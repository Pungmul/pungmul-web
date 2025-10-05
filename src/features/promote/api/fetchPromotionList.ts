import type { Promotion } from "../types";

export const fetchPromotionList = async (): Promise<Promotion[]> => {
  const response = await fetch("/api/promotions/list");

  if (!response.ok) {
    throw new Error("Failed to load promotion list");
  }

  const { performanceList } = await response.json();
  return performanceList;
};


