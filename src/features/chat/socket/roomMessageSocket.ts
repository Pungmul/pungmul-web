import { useCallback } from "react";
import { Message, isMessage } from "../types";
import { useSocketSubscription } from "@pThunder/core/socket/hooks/useSocketSubscribe";

export function useRoomMessageSocket(
  roomId: string,
  {
    onMessage,
    onAlarm,
  }: {
    onMessage: (message: Message) => void;
    onAlarm: (message: Message) => void;
  }
) {
  const handleAlarm = useCallback(
    (message: unknown) => {
      if (!isMessage(message)) return;
      onAlarm(message);
    },
    [onAlarm]
  );

  const handleMessage = useCallback(
    (message: unknown) => {
      if (!isMessage(message)) return;
      onMessage(message);
    },
    [onMessage]
  );

  useSocketSubscription({
    topic: `/sub/chat/alarm/${roomId}`,
    onMessage: handleAlarm,
    enabled: !!roomId,
  });
  useSocketSubscription({
    topic: `/sub/chat/message/${roomId}`,
    onMessage: handleMessage,
    enabled: !!roomId,
  });
}
