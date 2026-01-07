"use client";
import { useCallback } from "react";

import { useSocketSubscription } from "@pThunder/core/socket";
import { useGetMyPageInfo } from "@pThunder/features/my-page";
import { mapClubToSchoolName } from "@/features/club";
import { useClubList } from "@/features/club/queries/useClubList";

import { useLoadLightningData, useUserParticipationStatus } from "../queries";
import { isLightningMeetingMessage } from "../services/isLightningMeetingMessage";
import { useLightningCacheUpdater } from "./useLightningCacheUpdater";

export const useLightningSocket = () => {
  const { data: myInfo } = useGetMyPageInfo();
  const { data: clubList } = useClubList();
  const { data: lightningData } = useLoadLightningData();
  const { data: userParticipationData } = useUserParticipationStatus();

  const {
    updateWholeLightningList,
    updateSchoolLightningList,
    syncUserParticipation,
  } = useLightningCacheUpdater(userParticipationData);

  const wholeCallback = useCallback(
    (content: unknown) => {
      if (!isLightningMeetingMessage(content)) {
        console.error("Invalid message content");
        return;
      }
      const { content: newWholeLightningMeetings } = content;
      updateWholeLightningList(newWholeLightningMeetings);
      syncUserParticipation(newWholeLightningMeetings);
      console.log("updated whole lightning list", newWholeLightningMeetings);
    },
    [updateWholeLightningList, syncUserParticipation]
  );

  const schoolCallback = useCallback(
    (content: unknown) => {
      if (!isLightningMeetingMessage(content)) {
        console.error("Invalid message content");
        return;
      }
      const { content: newSchoolLightningMeetings } = content;
      updateSchoolLightningList(newSchoolLightningMeetings);
      syncUserParticipation(newSchoolLightningMeetings);
    },
    [updateSchoolLightningList, syncUserParticipation]
  );

  useSocketSubscription({
    topic: "/sub/lightning-meeting/search",
    onMessage: wholeCallback,
  });

  useSocketSubscription({
    topic:
      !!myInfo?.groupName && !!clubList
        ? `/sub/lightning-meeting/search/${mapClubToSchoolName(
            clubList!,
            myInfo!.groupName!
          )}`
        : undefined,
    onMessage: schoolCallback,
    enabled: !!myInfo?.groupName && !!clubList,
  });

  return {
    wholeLightningList: lightningData?.normalLightningMeetings || [],
    schoolLightningList: lightningData?.schoolLightningMeetings || [],
    myInfo,
    userParticipationData,
  };
};
