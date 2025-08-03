"use client";
import { getToken } from "@pThunder/features/auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function WebSocketWorker() {
  const { data: token } = useQuery({
    queryKey: ["token"],
    queryFn: () => {
      return getToken();
    },
  });

  useEffect(() => {
    if (token) {
      const registerWorker = async () => {
        const worker = new SharedWorker("./socket-worker.js");
        worker.port.onmessage = (event) => {
          console.log("event 수신", event);
        };
        if (worker) {
          worker.port.postMessage({
            type: "CONNECT",
            data: {
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/ws`,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          });
        }
      };

      registerWorker();
    }
  }, [token]);

  return null;
}
