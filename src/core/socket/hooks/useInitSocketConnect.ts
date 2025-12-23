"use client";
import { useEffect } from "react";
import { useSocketConnection } from "./useSocketConnection";
import { connectSocket } from "../lib/socketHandler";
import { useGetToken } from "@pThunder/features/auth";

export function useInitSocketConnect() {
  const { data: token } = useGetToken();
  const isConnected = useSocketConnection();

  useEffect(() => {
    if (isConnected || !token) {
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
  }, [isConnected, token]);
}
