import type { FormDto } from "../types";

export const fetchMyPromotionFormList = async (): Promise<FormDto[]> => {
  const response = await fetch("/api/promotions/forms/me");

  if (!response.ok) {
    throw new Error("Failed to load my promotion form list");
  }

  const { formList }: { formList: FormDto[] } = await response.json();
  return formList;
};


