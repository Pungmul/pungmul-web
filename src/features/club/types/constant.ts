import { CLUB_NAMES, mapClubToSchoolName } from "@/shared/types/club/constant";
import { SelectorItem } from "@/shared/components/form/Selector";

export const CLUB_OPTIONS: SelectorItem<(typeof CLUB_NAMES)[number]|null>[] = [
  {
    label: "소속패 없음",
    value: null,
  },
  ...CLUB_NAMES.map((clubName) => ({
    label: `${clubName} (${mapClubToSchoolName(clubName)})`,
    value: clubName,
  })),
  
];
