import { PromotionSurveyAnswerRequest } from "../types";

export const submitPromotionSurvey = async (
  publicId: string,
  answers: PromotionSurveyAnswerRequest[]
) => {
  const response = await fetch(`/api/promotions/submit/${publicId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit promotion survey: ${response.status}`);
  }

  return response.json();
};


