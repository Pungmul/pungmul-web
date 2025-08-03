import { CLUB_NAMES, mapClubToSchoolName } from "../model/constant";
import { SelectorItem } from "@pThunder/shared/components/form/Selector";

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
