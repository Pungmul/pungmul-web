import type { LightningMeeting } from "../types";

/**
 * 번개 리스트 필터링
 */
export const filterLightningList = (
  target: "전체" | "우리학교",
  wholeLightningList: LightningMeeting[],
  schoolLightningList: LightningMeeting[]
): LightningMeeting[] => {
  return target === "우리학교" ? schoolLightningList : wholeLightningList;
};