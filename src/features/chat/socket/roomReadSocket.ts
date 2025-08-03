import { useCallback, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

import { mySocketFactory } from "@/core";

export function useRoomReadSocket(roomId: string) {
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!roomId) return;
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
        console.log("Connected to WebSocket");
        client.subscribe(`/sub/chat/read/${roomId}`, (response) => {
          console.log("Received message:", response.body);
        });

        console.log("Sending message:", {
          roomId: roomId,
        });
        client.publish({
          destination: `/pub/chat/read/${roomId}`,
          body: JSON.stringify({
            chatRoomUUID: roomId,
          }),
        });
      },
      onStompError: (frame) => {
        console.error("리드 소켓 Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomId]);

  const readSign = useCallback(() => {
    stompClientRef.current?.publish({
      destination: `/pub/chat/read/${roomId}`,
      body: JSON.stringify({
        roomId: roomId,
      }),
    });
  }, [roomId]);

  return {
    readSign,
  };
}
