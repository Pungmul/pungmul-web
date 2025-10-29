"use client";
import {
  LightningMeeting,
  UserParticipationData,
} from "../types";
import { isLightningMeetingMessage } from "../services/isLightningMeetingMessage";
import { sharedSocketManager } from "@pThunder/core/socket/SharedSocketManager";
import { useEffect, useState, useRef } from "react";
import { useGetMyPageInfo } from "@pThunder/features/my-page";
import {
  lightningDataQueryKeys,
  lightningQueryKeys,
  useLoadLightningData,
  useUserParticipationStatus,
} from "../queries";
import { useGetToken } from "@pThunder/features/auth";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { mapClubToSchoolName } from "@/features/club";
import { useClubList } from "@/features/club/queries/useClubList";

export const useLightningSocket = () => {
  const queryClient = useQueryClient();

  const { data: myInfo } = useGetMyPageInfo();
  const { data: clubList } = useClubList();
  const { data: lightningData } = useLoadLightningData();
  const { data: userParticipationData } = useUserParticipationStatus();
  const { data: token } = useGetToken();

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const subscriptionsRef = useRef<Map<string, (content: unknown) => void>>(new Map());
  const userParticipationDataRef = useRef<UserParticipationData | null>(null);

  // 최신 userParticipationData를 ref로 유지
  useEffect(() => {
    userParticipationDataRef.current = userParticipationData ?? null;
  }, [userParticipationData]);

  useEffect(() => {
    if (!token) {
      return;
    }
    // 클럽 목록이 없으면 반환
    if (!clubList) {
      return;
    }
    // 이미 연결 중이거나 연결된 상태면 중복 연결 방지
    if (isConnecting || isConnected) {
      return;
    }
    // SharedWorker를 통한 웹소켓 연결
    const connectSharedSocket = async () => {
      try {
        setIsConnecting(true);
        await sharedSocketManager.connect({
          url:
            process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8080/ws",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsConnected(true);
        setIsConnecting(false);
        // 전체 공개 채널 구독
        const wholeTopic = "/sub/lightning-meeting/search";
        const wholeCallback = (content: unknown) => {
          if (!isLightningMeetingMessage(content)) {
            console.error("Invalid message content");
            return;
          }
          const messageContent = content;
          queryClient.setQueryData(
            lightningDataQueryKeys.lightningData(),
            (prev: {
              normalLightningMeetings: LightningMeeting[];
              schoolLightningMeetings: LightningMeeting[];
            }) => ({
              ...prev,
              normalLightningMeetings: messageContent.content,
            })
          );
          console.log("updated whole lightning list", messageContent.content);

          const latestUserParticipation = userParticipationDataRef.current;
          if (latestUserParticipation?.participant) {
            const newUserParticipationData = findUserParticipationStatus(
              latestUserParticipation,
              messageContent.content
            );

            if (!!newUserParticipationData) {
              updateUserParticipationStatus({
                queryClient,
                userParticipationData: newUserParticipationData,
              });
            } else {
              deleteUserParticipationStatus({
                queryClient,
              });
            }
          }
        };
        subscriptionsRef.current.set(wholeTopic, wholeCallback);
        sharedSocketManager.subscribe(wholeTopic, wholeCallback);

        // 학교별 채널 구독
        if (myInfo?.groupName && clubList) {
          const schoolTopic = `/sub/lightning-meeting/search/${mapClubToSchoolName(
            clubList,
            myInfo.groupName
          )}`;
          const schoolCallback = (content: unknown) => {
            if (!isLightningMeetingMessage(content)) {
              console.error("Invalid message content");
              return;
            }
            const messageContent = content;
            queryClient.setQueryData(
              lightningDataQueryKeys.lightningData(),
              (prev: {
                normalLightningMeetings: LightningMeeting[];
                schoolLightningMeetings: LightningMeeting[];
              }) => ({
                ...prev,
                schoolLightningMeetings: messageContent.content,
              })
            );

            const latestUserParticipation = userParticipationDataRef.current;
            if (latestUserParticipation) {
              const newUserParticipationData = findUserParticipationStatus(
                latestUserParticipation,
                messageContent.content
              );
              if (!!newUserParticipationData) {
                updateUserParticipationStatus({
                  queryClient,
                  userParticipationData: newUserParticipationData,
                });
              } else {
                deleteUserParticipationStatus({
                  queryClient,
                });
              }
            }
          };
          subscriptionsRef.current.set(schoolTopic, schoolCallback);
          sharedSocketManager.subscribe(schoolTopic, schoolCallback);
        }
      } catch (error) {
        console.error("Worker 연결 실패:", error);
        setIsConnected(false);
        setIsConnecting(false);

        // 연결 실패 시 3초 후 재시도
        setTimeout(() => {
          if (!isConnected && !isConnecting) {
            connectSharedSocket();
          }
        }, 3000);
      }
    };

    connectSharedSocket();

    return () => {
      // 컴포넌트 언마운트 시 구독 해제
      subscriptionsRef.current.forEach((callback, topic) => {
        sharedSocketManager.unsubscribe(topic, callback);
      });
      subscriptionsRef.current.clear();
    };
  }, [myInfo?.groupName, token, clubList, queryClient]); // userParticipationData 의존성 제거

  return {
    lightningSocket: sharedSocketManager,
    wholeLightningList: lightningData?.normalLightningMeetings || [],
    schoolLightningList: lightningData?.schoolLightningMeetings || [],
    myInfo,
    userParticipationData,
    isConnected: isConnected || sharedSocketManager.getConnectionStatus(),
    isConnecting,
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

export const deleteUserParticipationStatus = ({
  queryClient,
}: {
  queryClient: QueryClient;
}) => {
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

export const updateUserParticipationStatus = ({
  queryClient,
  userParticipationData,
}: {
  queryClient: QueryClient;
  userParticipationData: LightningMeeting;
}) => {
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
