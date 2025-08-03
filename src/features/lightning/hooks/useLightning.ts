import {
  LightningMeeting,
  LightningMeetingMessage,
  mapClubToSchoolName,
} from "@pThunder/shared";
import { mySocketFactory } from "@pThunder/core/socket/SocketFactory";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { useGetMyPageInfo } from "@pThunder/features/my-page/api/api";
import { useLoadLightningData } from "../api/api";
import { useGetToken } from "@pThunder/features/auth/api";

export const useLightningSocket = () => {
  const { data: myInfo } = useGetMyPageInfo();
  const { data: lightningData } = useLoadLightningData();
  const { data: token } = useGetToken();

  const stompClientRef = useRef<Client | null>(null);
  const [wholeLightningList, setWholeLightningList] = useState<
    LightningMeeting[]
  >(lightningData?.normalLightningMeetings || []);
  const [schoolLightningList, setSchoolLightningList] = useState<
    LightningMeeting[]
  >(lightningData?.schoolLightningMeetings || []);

  useEffect(() => {
    if (!token) {
      console.error("Token is not found");
      return;
    }

    const socket = mySocketFactory();
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log("STOMP Debug:", str);
      },
      connectHeaders: {
        Authorization: `Bearer ${token}`, // JWT 토큰 추가
      },
      onConnect: () => {
        // 서버로부터 메시지 수신
        client.subscribe("/sub/lightning-meeting/search", (response) => {
          const { content } = JSON.parse(
            response.body
          ) as LightningMeetingMessage;
          console.log("wholeLightningList content", content);
          setWholeLightningList([...content]);
        });

        console.log("✌🏻전체 공개 채널 연결 성공", myInfo?.groupName,mapClubToSchoolName(myInfo!.groupName!))
        if (myInfo?.groupName) {
          client.subscribe(
            `/sub/lightning-meeting/search/${mapClubToSchoolName(
              myInfo.groupName
            )}`,
            (response) => {
              const { content } = JSON.parse(
                response.body
              ) as LightningMeetingMessage;
              console.log("schoolLightningList content", content);
              setSchoolLightningList([...content]);
            }
          );
        }

        // 메시지 발행 예제
      },
      onStompError: (frame) => {
        console.log("frame", frame.headers);
        console.error("Broker reported error:", frame.headers["message"]);
        console.error("Additional details:", frame.body);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      console.log("WebSocket disconnected");
    };
  }, [myInfo, token]);

  useEffect(() => {
    if (lightningData) {
      setWholeLightningList(lightningData.normalLightningMeetings || []);
      setSchoolLightningList(lightningData.schoolLightningMeetings || []);
    }
  }, [lightningData]);

  return {
    lightningSocket: stompClientRef.current,
    wholeLightningList,
    schoolLightningList,
    myInfo,
  };
};
