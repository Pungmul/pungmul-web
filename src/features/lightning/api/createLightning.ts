import type { CreateLightningMeetingRequest } from "../types";

/**
 * 번개 모임 생성 API
 * @param request - 번개 생성 요청 데이터
 * @throws {Error} API 요청 실패 시
 */
export const createLightningAPI = async (
  request: CreateLightningMeetingRequest
): Promise<void> => {
  const response = await fetch(`/api/lightning/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("번개 생성 실패: " + response.status);
  }

  return response.json();
};
