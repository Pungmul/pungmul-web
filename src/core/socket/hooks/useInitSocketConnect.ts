"use client";
import { useEffect } from "react";
import { useSocketConnection } from "./useSocketConnection";
import { connectSocket, disconnectSocket } from "../lib/socketHandler";
import { useGetToken } from "@pThunder/features/auth";

export function useInitSocketConnect() {
  const { data: token } = useGetToken();
  const isConnected = useSocketConnection();

  useEffect(() => {
    if (isConnected) {
      return; // 이미 연결되어 있거나 토큰이 없으면 연결하지 않음
    }
    if (!token) {
      // 토큰이 없으면 연결을 끊음
      disconnectSocket();
      return;
    }
    connectSocket({
      url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8080/ws",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        console.log("웹 소켓 연결 성공");
      })
      .catch((error) => {
        console.error("웹 소켓 연결 실패:", error);
      });

    return () => {
      if (isConnected) {
        console.log("웹 소켓 연결 해제");
        disconnectSocket();
      }
    };
  }, [isConnected, token]);
}
