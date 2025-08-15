import {
  isLightningMeetingMessage,
  LightningMeeting,
  mapClubToSchoolName,
} from "@pThunder/shared";
import { sharedSocketManager } from "@pThunder/core/socket/SharedSocketManager";
import { useEffect, useState, useRef } from "react";
import { useGetMyPageInfo } from "@pThunder/features/my-page";
import { useLoadLightningData } from "../api/api";
import { useGetToken } from "@pThunder/features/auth/api";

export const useLightningSocket = () => {
  const { data: myInfo } = useGetMyPageInfo();
  const { data: lightningData } = useLoadLightningData();
  const { data: token } = useGetToken();

  const [wholeLightningList, setWholeLightningList] = useState<
    LightningMeeting[]
  >(lightningData?.normalLightningMeetings || []);
  const [schoolLightningList, setSchoolLightningList] = useState<
    LightningMeeting[]
  >(lightningData?.schoolLightningMeetings || []);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const subscriptionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!token) {
      console.error("Token is not found");
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
          url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080/ws',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsConnected(true);
        setIsConnecting(false);
        // 전체 공개 채널 구독
        const wholeTopic = "/sub/lightning-meeting/search";
        sharedSocketManager.subscribe(wholeTopic, (content) => {
          if (!isLightningMeetingMessage(content)) {
            console.error("Invalid message content");
            return;
          }
          const messageContent = content;
          setWholeLightningList([...messageContent.content as LightningMeeting[]]);
        });

        // 학교별 채널 구독
        if (myInfo?.groupName) {
          const schoolTopic = `/sub/lightning-meeting/search/${mapClubToSchoolName(myInfo.groupName)}`;
          sharedSocketManager.subscribe(schoolTopic, (content) => {
            if (!isLightningMeetingMessage(content)) {
              console.error("Invalid message content");
              return;
            }
            const messageContent = content;
            setSchoolLightningList([...messageContent.content as LightningMeeting[]]);
          });
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
      subscriptionsRef.current.forEach(topic => {
        sharedSocketManager.unsubscribe(topic);
      });
      subscriptionsRef.current.clear();
    };
  }, [myInfo, token, isConnected, isConnecting]);

  useEffect(() => {
    if (lightningData) {
      setWholeLightningList(lightningData.normalLightningMeetings || []);
      setSchoolLightningList(lightningData.schoolLightningMeetings || []);
    }
  }, [lightningData]);

  return {
    lightningSocket: sharedSocketManager,
    wholeLightningList,
    schoolLightningList,
    myInfo,
    isConnected: isConnected || sharedSocketManager.getConnectionStatus(),
    isConnecting,
  };
};
