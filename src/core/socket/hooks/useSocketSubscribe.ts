"use client";
import { useEffect, useRef } from "react";
import { useSocketConnection } from "./useSocketConnection";
import { subscribeSocket, unsubscribeSocket } from "../lib/socketHandler";
import { Subscription } from "../types";

interface UseSocketSubscriptionParams<T = unknown> {
  topic: string | undefined;
  onMessage: (data: T) => void;
  enabled?: boolean;
}

export function useSocketSubscription<T = unknown>({
  topic,
  onMessage,
  enabled = true,
}: UseSocketSubscriptionParams<T>) {
  const isConnected = useSocketConnection();

  const subscriptionRef = useRef<Subscription | null>(null);
  const handlerRef = useRef(onMessage);

  // 콜백 최신화 (ref 패턴)
  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!enabled || !topic) return;
    if (!isConnected) return;
    if (subscriptionRef.current) return;

    let cancelled = false;

    const stableHandler = (data: unknown) => {
      handlerRef.current(data as T);
    };

    subscribeSocket(topic, stableHandler).then((sub) => {
      if (cancelled) {
        unsubscribeSocket(sub);
        return;
      }
      subscriptionRef.current = sub;
    });

    return () => {
      cancelled = true;

      if (subscriptionRef.current) {
        unsubscribeSocket(subscriptionRef.current).then(() => {
          subscriptionRef.current = null;
        });
      }
    };
  }, [enabled, isConnected, topic]);
}
