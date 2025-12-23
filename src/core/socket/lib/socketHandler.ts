import { sharedSocketManager } from "../SharedSocketManager";
import { SocketConfig, Subscription } from "../types";

export async function connectSocket(config: SocketConfig): Promise<void> {
  return await sharedSocketManager.connect(config);
}

export async function subscribeSocket(
  topic: string,
  callback: (data: unknown) => void
): Promise<Subscription> {
  return await sharedSocketManager.subscribe(topic, callback);
}

export async function unsubscribeSocket(
  subscription: Subscription
): Promise<void> {
  return await sharedSocketManager.unsubscribe(subscription);
}

export function sendMessage(topic: string, message: unknown) {
  return sharedSocketManager.sendMessage(topic, message);
}

export function disconnectSocket(): void {
  sharedSocketManager.disconnect();
}
