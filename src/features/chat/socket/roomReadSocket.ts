import { useCallback, useEffect, useState } from "react";
import { sharedSocketManager } from "@pThunder/core/socket/SharedSocketManager";
import { useGetToken } from "@pThunder/features/auth/api";

export function useRoomReadSocket(roomId: string) {
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

        // 채팅 읽음 상태 구독
        const readTopic = `/sub/chat/read/${roomId}`;
        sharedSocketManager.subscribe(readTopic, (message) => {
          console.log("Received read message:", message);
        });

        console.log("채팅 읽음 소켓 연결 성공 - roomId:", roomId);

        // 초기 읽음 상태 전송
        readSign();

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
      // 컴포넌트 언마운트 시 구독 해제
      const readTopic = `/sub/chat/read/${roomId}`;
      sharedSocketManager.unsubscribe(readTopic);
      console.log("채팅 읽음 소켓 구독 해제 - roomId:", roomId);
    };
  }, [roomId, token, isConnected, isConnecting]);

  const readSign = useCallback(() => {
    if (!isConnected) {
      console.warn("Cannot send read sign: WebSocket not connected");
      return;
    }

    const message = {
      roomId: roomId,
    };

    console.log("Sending read sign:", message);
    
    sharedSocketManager.sendMessage(`/pub/chat/read/${roomId}`, message);
  }, [roomId, isConnected]);

  return {
    readSign,
    isConnected,
    isConnecting,
    workerType: sharedSocketManager.getWorkerType(),
  };
}
