"use client";
import { LightningMeeting, UserParticipationData } from "../types";
import { isLightningMeetingMessage } from "../services/isLightningMeetingMessage";
import { useSocketSubscription } from "@pThunder/core/socket";
import { useEffect, useRef, useCallback } from "react";
import { useGetMyPageInfo } from "@pThunder/features/my-page";
import {
  lightningDataQueryKeys,
  lightningQueryKeys,
  useLoadLightningData,
  useUserParticipationStatus,
} from "../queries";
import { useQueryClient } from "@tanstack/react-query";
import { mapClubToSchoolName } from "@/features/club";
import { useClubList } from "@/features/club/queries/useClubList";

export const useLightningSocket = () => {
  const queryClient = useQueryClient();

  const { data: myInfo } = useGetMyPageInfo();
  const { data: clubList } = useClubList();
  const { data: lightningData } = useLoadLightningData();
  const { data: userParticipationData } = useUserParticipationStatus();

  const userParticipationDataRef = useRef<UserParticipationData | null>(null);

  // 최신 userParticipationData를 ref로 유지
  useEffect(() => {
    userParticipationDataRef.current = userParticipationData ?? null;
  }, [userParticipationData]);

  const deleteUserParticipationStatus = () => {
    queryClient.setQueryData(
      lightningQueryKeys.status(),
      (prev: UserParticipationData): UserParticipationData => ({
        ...prev,
        isOrganizer: false,
        participant: false,
        lightningMeeting: null,
        chatRoomUUID: null,
      })
    );
  };

  const updateUserParticipationStatus = (
    userParticipationData: LightningMeeting
  ) => {
    queryClient.setQueryData(
      lightningQueryKeys.status(),
      (prev: {
        isOrganizer: boolean;
        participant: boolean;
        lightningMeeting: LightningMeeting;
        chatRoomUUID: string | null;
      }) => ({
        ...prev,
        lightningMeeting: userParticipationData,
      })
    );
  };

  const wholeCallback = useCallback((content: unknown) => {
    if (!isLightningMeetingMessage(content)) {
      console.error("Invalid message content");
      return;
    }
    const { content: newWholeLightningMeetings } = content;
    queryClient.setQueryData<{
      normalLightningMeetings: LightningMeeting[];
      schoolLightningMeetings: LightningMeeting[];
    }>(lightningDataQueryKeys.lightningData(), (prev) => {
      if (prev) {
        return {
          ...prev,
          normalLightningMeetings: newWholeLightningMeetings,
        };
      }
      return {
        normalLightningMeetings: newWholeLightningMeetings,
        schoolLightningMeetings: [],
      };
    });
    console.log("updated whole lightning list", newWholeLightningMeetings);

    const latestUserParticipation = userParticipationDataRef.current;
    if (latestUserParticipation?.participant) {
      const newUserParticipationData = findUserParticipationStatus(
        latestUserParticipation,
        newWholeLightningMeetings
      );

      if (!!newUserParticipationData) {
        updateUserParticipationStatus(newUserParticipationData);
      } else {
        deleteUserParticipationStatus();
      }
    }
  }, []);

  const schoolCallback = useCallback((content: unknown) => {
    if (!isLightningMeetingMessage(content)) {
      console.error("Invalid message content");
      return;
    }
    const { content: newSchoolLightningMeetings } = content;
    queryClient.setQueryData<{
      normalLightningMeetings: LightningMeeting[];
      schoolLightningMeetings: LightningMeeting[];
    }>(lightningDataQueryKeys.lightningData(), (prev) => {
      if (prev) {
        return {
          ...prev,
          schoolLightningMeetings: newSchoolLightningMeetings,
        };
      } else {
        return {
          normalLightningMeetings: [],
          schoolLightningMeetings: newSchoolLightningMeetings,
        };
      }
    });

    const latestUserParticipation = userParticipationDataRef.current;
    if (latestUserParticipation) {
      const newUserParticipationData = findUserParticipationStatus(
        latestUserParticipation,
        newSchoolLightningMeetings
      );
      if (!!newUserParticipationData) {
        updateUserParticipationStatus(newUserParticipationData);
      } else {
        deleteUserParticipationStatus();
      }
    }
  }, []);

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

const findUserParticipationStatus = (
  userParticipationData: UserParticipationData,
  lightningMeeting: LightningMeeting[]
) => {
  return lightningMeeting.find(
    (lightningMeeting) =>
      userParticipationData.lightningMeeting?.id === lightningMeeting.id
  );
};
