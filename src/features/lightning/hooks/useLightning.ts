import { useMyInfoStore } from "@pThunder/features/my-page";
import { LightningMeeting, LightningMeetingMessage, mapClubToSchoolName } from "@pThunder/shared";
import { mySocketFactory } from "@pThunder/core/socket/SocketFactory";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

export const useLightningSocket = () => {
    const stompClientRef = useRef<Client | null>(null);
    const { myInfo } = useMyInfoStore();
    const [wholeLightningList, setWholeLightningList] = useState<
      LightningMeeting[]
    >([]);
    const [schoolLightningList, setSchoolLightningList] = useState<
      LightningMeeting[]
    >([]);
  

    useEffect(() => {
        const loadLightningData = async () => {
        try {
          console.log("loadLightningData");
          const response = await fetch(`/lightning/search`, {
            credentials: "include",
          });
    
          const { normalLightningMeetings, schoolLightningMeetings } =
            await response.json();
    
          setWholeLightningList([...normalLightningMeetings]);
          setSchoolLightningList([...schoolLightningMeetings]);
        } catch (error) {
          console.error("Error fetching lightning data:", error);
        }
      };
  
      loadLightningData();
    }, []);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
  
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
  
          if (myInfo?.groupName) {
            console.log(
              "myInfo",
              `/sub/lightning-meeting/search/${mapClubToSchoolName(
                myInfo?.groupName
              )}`
            );
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
    }, [myInfo]);
  
    return {
      lightningSocket: stompClientRef.current,
      wholeLightningList,
      schoolLightningList,
      myInfo,
    };
  };