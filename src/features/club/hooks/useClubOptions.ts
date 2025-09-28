"use client";
import { useMemo } from "react";
import { SelectorItem } from "@pThunder/shared/components/form/Selector";
import { useClubList } from "../queries/useClubList";
import { CLUB_NAMES, NO_CLUB_VALUE } from "../constant";

export const useClubOptions = (): SelectorItem<string | null>[] => {
  const { data: clubList, isLoading } = useClubList();

  return useMemo(() => {
    if (isLoading || !clubList) {
      // 로딩 중이거나 데이터가 없을 때는 기본 옵션 반환 (clubName 사용)
      return [
        {
          label: "소속패 없음",
          value: NO_CLUB_VALUE,
        },
        ...CLUB_NAMES.map((clubName) => ({
          label: `${clubName}`,
          value: clubName,
        })),
      ];
    }

    // API에서 가져온 클럽 목록을 사용 (clubName을 value로 사용)
    return [
      {
        label: "소속패 없음",
        value: NO_CLUB_VALUE,
      },
      ...clubList.map((club) => ({
        label: `${club.clubName} (${club.school})`,
        value: club.clubName,
      })),
    ];
  }, [clubList, isLoading]);
};

