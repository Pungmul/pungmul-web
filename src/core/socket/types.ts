export interface SocketConfig {
  url: string;
  headers?: Record<string, string>;
}

export interface Subscription {
  topic: string;
  id: string;
}

type WorkerMessageType = "CONNECT" | "SUBSCRIBE" | "UNSUBSCRIBE" | "SEND_MESSAGE" | "DISCONNECT";

type WorkerResponseType = "CONNECTED" | "SUBSCRIBED" | "MESSAGE" | "ERROR";

export interface WorkerMessage {
  type: WorkerMessageType;
  data?: unknown;
  commandId?: string;
}

export interface WorkerResponse {
  type: WorkerResponseType;
  data?: unknown;
  error?: unknown;
  commandId?: string;
  clientId?: string;
}