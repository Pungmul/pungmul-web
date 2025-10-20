import { useEffect, useState } from "react";
import { sharedSocketManager } from "@pThunder/core/socket/SharedSocketManager";
import { useGetToken } from "@pThunder/features/auth";
import { useGetMyPageInfo } from "@pThunder/features/my-page";
import { useChatRoomStore } from "@pThunder/features/chat/store/chatRoomStore";
import { ChatRoomUpdateMessage } from "../types";

export function useRoomListSocket() {
  const { data: token } = useGetToken();
  const { data: userData } = useGetMyPageInfo();

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  // Zustand 스토어에서 메시지 핸들러 가져오기
  const { handleSocketMessage:handleChatRoomUpdateMessage } = useChatRoomStore();

  useEffect(() => {
    if (!token || !userData?.name) {
      return;
    }

    // 이미 연결 중이거나 연결된 상태면 중복 연결 방지
    if (isConnecting || isConnected) {
      return;
    }

    const handleSocketMessage = (data: unknown) => {
      const message = data as ChatRoomUpdateMessage;
      try {
        // 채팅 메시지인 경우 스토어 업데이트
        if (message) {
          // 소켓 메시지 핸들러로도 전달 (추가 처리 필요시)
          handleChatRoomUpdateMessage(message);
        }
      } catch (error) {
        console.error("Socket message parsing error:", error, message);
      }
    }
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

        // 채팅 알림 구독
        const notificationTopic = `/sub/chat/notification/${userData.username}`;
        sharedSocketManager.subscribe(notificationTopic, handleSocketMessage);

      } catch {
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
      if (userData?.name) {
        const notificationTopic = `/sub/chat/notification/${userData.name}`;
        sharedSocketManager.unsubscribe(notificationTopic, handleSocketMessage);
      }

      // 다른 채팅방에서 소켓을 사용하지 않는다면 연결 해제
      if (
        sharedSocketManager.getConnectionStatus() &&
        sharedSocketManager.getSubscriptionCount() === 0
      ) {
        sharedSocketManager.disconnect();
      }

      setIsConnected(false);
      setIsConnecting(false);
    };
  }, [token, userData, handleChatRoomUpdateMessage]);

  return { isConnected };
}
