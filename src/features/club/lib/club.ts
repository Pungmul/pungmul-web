import { ClubName } from "../constant";
import { ClubInfo } from "../types";

export const mapClubToClubId = (clubList: ClubInfo[],club: ClubName): number | null => {
  if (club === "없음") {
    return null;
  }

  return clubList?.find((c) => c.clubName === club)?.clubId ?? null;
};

export const mapClubToSchoolName = (clubList: ClubInfo[],club: ClubName): string => {
  if (club === "없음") {
    return "없음";
  }

  return clubList?.find((c) => c.clubName === club)?.school ?? "없음";
};

