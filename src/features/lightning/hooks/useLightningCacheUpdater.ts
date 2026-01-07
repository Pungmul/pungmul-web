"use client";
import { useCallback, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { LightningMeeting, UserParticipationData } from "../types";
import { lightningQueryKeys } from "../queries";

/**
 * 번개 데이터 캐시 업데이트를 담당하는 훅
 * @param userParticipationData - 현재 사용자의 번개 참여 상태
 * @returns 캐시 업데이트 함수들
 */
export const useLightningCacheUpdater = (
  userParticipationData: UserParticipationData | undefined
) => {
  const queryClient = useQueryClient();
  const userParticipationDataRef = useRef<UserParticipationData | null>(null);

  // 최신 userParticipationData를 ref로 유지
  useEffect(() => {
    userParticipationDataRef.current = userParticipationData ?? null;
  }, [userParticipationData]);

  const deleteUserParticipationStatus = useCallback(() => {
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
  }, [queryClient]);

  const updateUserParticipationStatus = useCallback(
    (meeting: LightningMeeting) => {
      queryClient.setQueryData(
        lightningQueryKeys.status(),
        (prev: UserParticipationData) => ({
          ...prev,
          lightningMeeting: meeting,
        })
      );
    },
    [queryClient]
  );

  const updateWholeLightningList = useCallback(
    (newMeetings: LightningMeeting[]) => {
      queryClient.setQueryData<{
        normalLightningMeetings: LightningMeeting[];
        schoolLightningMeetings: LightningMeeting[];
      }>(lightningQueryKeys.data(), (prev) => {
        if (prev) {
          return {
            ...prev,
            normalLightningMeetings: newMeetings,
          };
        }
        return {
          normalLightningMeetings: newMeetings,
          schoolLightningMeetings: [],
        };
      });
    },
    [queryClient]
  );

  const updateSchoolLightningList = useCallback(
    (newMeetings: LightningMeeting[]) => {
      queryClient.setQueryData<{
        normalLightningMeetings: LightningMeeting[];
        schoolLightningMeetings: LightningMeeting[];
      }>(lightningQueryKeys.data(), (prev) => {
        if (prev) {
          return {
            ...prev,
            schoolLightningMeetings: newMeetings,
          };
        }
        return {
          normalLightningMeetings: [],
          schoolLightningMeetings: newMeetings,
        };
      });
    },
    [queryClient]
  );

  const syncUserParticipation = useCallback(
    (newMeetings: LightningMeeting[]) => {
      const latestUserParticipation = userParticipationDataRef.current;
      if (!latestUserParticipation?.participant) return;

      const updatedMeeting = newMeetings.find(
        (meeting) =>
          latestUserParticipation.lightningMeeting?.id === meeting.id
      );

      if (updatedMeeting) {
        updateUserParticipationStatus(updatedMeeting);
      } else {
        deleteUserParticipationStatus();
      }
    },
    [updateUserParticipationStatus, deleteUserParticipationStatus]
  );

  return {
    updateWholeLightningList,
    updateSchoolLightningList,
    syncUserParticipation,
  };
};
