"use client";
import { useMemo } from "react";
import { SelectorItem } from "@pThunder/shared/components/form/Selector";
import { useClubList } from "../queries/useClubList";
import { CLUB_NAMES } from "../constant";
import { mapClubToClubId, mapClubToSchoolName } from "@/features/club/lib";

export const useClubOptionsWithId = (): SelectorItem<number | null>[] => {
  const { data: clubList = [], isLoading } = useClubList();

  return useMemo(() => {
    if (isLoading || !clubList) {
      // 로딩 중이거나 데이터가 없을 때는 기본 옵션 반환 (clubId 사용)
      return [
        {
          label: "소속패 없음",
          value: null,
        },
        ...CLUB_NAMES.map((clubName) => ({
          label: `${clubName} (${mapClubToSchoolName(clubList, clubName)})`,
          value: mapClubToClubId(clubList, clubName),
        })),
      ];
    }

    // API에서 가져온 클럽 목록을 사용 (clubId를 value로 사용)
    return [
      {
        label: "소속패 없음",
        value: null,
      },
      ...clubList.map((club) => ({
        label: `${club.clubName} (${club.school})`,
        value: club.clubId,
      })),
    ];
  }, [clubList, isLoading]);
};

