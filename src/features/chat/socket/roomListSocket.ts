import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

import { mySocketFactory } from "@/core";

export function useRoomListSocket() {
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    const socket = mySocketFactory();

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log("Connected to WebSocket");
        client.subscribe("/topic/greetings", (response) => {
          console.log("Received message:", response.body);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);
  
}
