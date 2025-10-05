import type { FormSaveDto } from "../types";

export const savePromotionForm = async (
  formId: number,
  form: FormSaveDto
) => {
  const response = await fetch(`/api/promotions/forms/${formId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    throw new Error("폼 저장 실패");
  }

  return response.json();
};


