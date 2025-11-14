"use client";
import { useMemo } from "react";

import {
  createEditProfileSchema,
} from "@/features/my-page/types";
import { ClubInfo } from "@/features/club/types";
import { NO_CLUB_VALUE } from "@/features/club/constant";

export const useEditProfileSchema = (
  clubList?: ClubInfo[]
) => {
  return useMemo(() => {
    const clubNames = clubList?.map((club) => club.clubName);
    return createEditProfileSchema([NO_CLUB_VALUE, ...(clubNames ?? [])]);
  }, [clubList]);
};


