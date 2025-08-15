import { LightningMeetingMessage } from "./type";

export function isLightningMeetingMessage(message: unknown): message is LightningMeetingMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "messageLogId" in message &&
    "domainType" in message &&
    "businessIdentifier" in message &&
    "identifier" in message &&
    "stompDest" in message &&
    "content" in message
  );
}