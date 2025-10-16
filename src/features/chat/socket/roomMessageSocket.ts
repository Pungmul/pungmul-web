import { useEffect, useState } from "react";
import { sharedSocketManager } from "@pThunder/core/socket/SharedSocketManager";
import { useGetToken } from "@pThunder/features/auth";
import { Message } from "../types";

export function useRoomMessageSocket(roomId: string, {
  onMessage,
  onAlarm,
}: {
  onMessage: (message: Message) => void;
  onAlarm: (message: Message) => void;
}) {
  const { data: token } = useGetToken();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!roomId || !token) {
      return;
    }

    // 이미 연결 중이거나 연결된 상태면 중복 연결 방지
    if (isConnecting || isConnected) {
      return;
    }

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

        // 채팅 알림 구독
        const alarmTopic = `/sub/chat/alarm/${roomId}`;
        console.log('🔍 채팅 알림 구독 시도:', alarmTopic);
        
        sharedSocketManager.subscribe(alarmTopic, (message) => {
          console.log('🔍 채팅 알림 메시지 수신:', message);
          const parsedMessage = message as Message;
          onAlarm(parsedMessage);
        });

        // 채팅 메시지 구독
        const messageTopic = `/sub/chat/message/${roomId}`;
        console.log('🔍 채팅 메시지 구독 시도:', messageTopic);
        
        sharedSocketManager.subscribe(messageTopic, (message) => {
          console.log('🔍 채팅 메시지 수신:', message);
          const parsedMessage = message as Message;
          onMessage(parsedMessage);
        });

        console.log("채팅 메시지 소켓 연결 성공 - roomId:", roomId);

      } catch (error) {
        console.error("채팅 메시지 소켓 연결 실패:", error);
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
      // 컴포넌트 언마운트 시 구독 해제 및 연결 해제
      const alarmTopic = `/sub/chat/alarm/${roomId}`;
      const messageTopic = `/sub/chat/message/${roomId}`;
      sharedSocketManager.unsubscribe(alarmTopic);
      sharedSocketManager.unsubscribe(messageTopic);
      
      // 다른 채팅방에서 소켓을 사용하지 않는다면 연결 해제
      if (sharedSocketManager.getConnectionStatus() && sharedSocketManager.getSubscriptionCount() === 0) {
        sharedSocketManager.disconnect();
      }
      
      setIsConnected(false);
      setIsConnecting(false);
      console.log("채팅 메시지 소켓 구독 해제 및 연결 해제 - roomId:", roomId);
    };
  }, [roomId, token]);

  return {
    isConnected,
    isConnecting,
    workerType: sharedSocketManager.getWorkerType(),
  };
} 