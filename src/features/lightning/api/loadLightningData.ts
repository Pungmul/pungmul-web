import { LightningMeeting } from "../types";

/**
 * 번개 데이터 조회 API
 * @returns 전체/학교 번개 목록
 * @throws {Error} API 요청 실패 시
 */
export const loadLightningData = async (): Promise<{ normalLightningMeetings: LightningMeeting[], schoolLightningMeetings: LightningMeeting[] }> => {
  const response = await fetch(`/api/lightning/search`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch lightning data");
  }

  const { normalLightningMeetings, schoolLightningMeetings } =
    await response.json();
  return { normalLightningMeetings, schoolLightningMeetings };
};
