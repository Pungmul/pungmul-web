import { useCallback } from "react";
import { Message } from "../types";
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
      const parsedMessage = message as Message;
      onAlarm(parsedMessage);
    },
    [onAlarm]
  );

  const handleMessage = useCallback(
    (message: unknown) => {
      const parsedMessage = message as Message;
      onMessage(parsedMessage);
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
