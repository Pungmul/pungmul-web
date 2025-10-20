import { useCallback, useEffect, useState } from "react";
import { sharedSocketManager } from "@pThunder/core/socket/SharedSocketManager";
import { useGetToken } from "@pThunder/features/auth";
import { useChatRoomStore } from "@pThunder/features/chat/store/chatRoomStore";

export function useRoomReadSocket(roomId: string) {
  const { data: token } = useGetToken();
  const { userCheckIn, userCheckOut } = useChatRoomStore();
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

    const handleReadMessage = (message: unknown) => {
      console.log("Received read message:", message);
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
        userCheckIn(roomId);
        // 채팅 읽음 상태 구독
        const readTopic = `/sub/chat/read/${roomId}`;
        sharedSocketManager.subscribe(readTopic, handleReadMessage);

      } catch (error) {
        console.error("채팅 읽음 소켓 연결 실패:", error);
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
      const readTopic = `/sub/chat/read/${roomId}`;
      
      sharedSocketManager.unsubscribe(readTopic, handleReadMessage);

      // 다른 채팅방에서 소켓을 사용하지 않는다면 연결 해제
      if (
        sharedSocketManager.getConnectionStatus() &&
        sharedSocketManager.getSubscriptionCount() === 0
      ) {
        sharedSocketManager.disconnect();
      }

      setIsConnected(false);
      setIsConnecting(false);
      userCheckOut();
    };
  }, [roomId, token]);

  const readSign = useCallback(() => {
    if (!isConnected) {
      console.warn("Cannot send read sign: WebSocket not connected");
      return;
    }

    const message = {
      chatRoomUUID: roomId,
    };
    
    sharedSocketManager.sendMessage(`/pub/chat/read/${roomId}`, message);
  }, [roomId, isConnected]);


  useEffect(() => {
    if (!isConnected) {
      return;
    }
    readSign();
  }, [readSign, isConnected]);

  return {
    readSign,
    isConnected,
    isConnecting,
    workerType: sharedSocketManager.getWorkerType(),
  };
}
