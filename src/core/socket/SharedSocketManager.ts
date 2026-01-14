import {
  SocketConfig,
  Subscription,
  WorkerMessage,
  WorkerResponse,
} from "./types";

type PendingCommand = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  timeout: NodeJS.Timeout;
};

export class SharedSocketManager {
  private static instance: SharedSocketManager;
  private worker: SharedWorker | Worker | null = null;
  private port: MessagePort | null = null;
  private subscriptions = new Map<
    string,
    Map<string, (data: unknown) => void>
  >();
  private pendingSubscriptions = new Set<string>(); // 대기 중인 구독들
  private pendingCommands = new Map<string, PendingCommand>(); // commandId와 Promise 매핑
  private isConnected = false;
  private isSharedWorkerSupported: boolean;
  private workerMode: "shared" | "dedicated" = "dedicated";
  private readonly COMMAND_TIMEOUT = 30000; // 30초 타임아웃

  private stateSubscriptions = new Set<() => void>();

  private constructor() {
    this.isSharedWorkerSupported = typeof SharedWorker !== "undefined";
  }

  static getInstance(): SharedSocketManager {
    if (!SharedSocketManager.instance) {
      SharedSocketManager.instance = new SharedSocketManager();
    }
    return SharedSocketManager.instance;
  }

  async connect(config: SocketConfig): Promise<void> {
    if (this.worker) {
      console.log("🔍 이미 Worker가 존재함");
      return;
    }

    const tryConnect = async (useSharedWorker: boolean): Promise<void> => {
      this.workerMode = useSharedWorker ? "shared" : "dedicated";
      this.worker = useSharedWorker
        ? new SharedWorker("/socket-worker.js")
        : new Worker("/dedicated-worker.js");
      this.port =
        useSharedWorker
          ? (this.worker as SharedWorker).port
          : (this.worker as unknown as MessagePort);

      if (!this.port) {
        throw new Error("Worker port initialization failed");
      }

      this.port.addEventListener("message", (event: MessageEvent) => {
        const response = event.data as WorkerResponse;
        const { type, data, error, commandId } = response;
        console.log("🔍 Worker 메시지 수신:", { type, commandId, data });

        switch (type) {
          case "CONNECTED":
            this.isConnected = true;
            console.log("🔍 Worker: WebSocket 연결 완료", { commandId });
            if (commandId) {
              this.resolveCommand(commandId, undefined);
            }
            this.notifyStateSubscriptions();
            this.retryPendingSubscriptions();
            break;
          case "SUBSCRIBED":
            const { topic: subscribedTopic } = data as { topic: string };
            console.log("🔍 Worker: 구독 완료 - topic:", subscribedTopic, {
              commandId,
            });
            if (!!commandId) {
              this.resolveCommand(commandId, data);
            }
            break;
          case "MESSAGE":
            const { topic, message } = data as {
              topic: string;
              message: unknown;
            };
            console.log(
              "🔍 Worker: 메시지 수신 - topic:",
              topic,
              "message:",
              message,
              { commandId }
            );
            const callbacks = this.subscriptions.get(topic);
            console.log("callbacks size", callbacks?.size ?? 0, topic, message);
            if (callbacks && callbacks.size > 0) {
              callbacks.forEach((callback) => {
                try {
                  callback(message);
                } catch (err) {
                  console.error("🔍 구독 콜백 에러:", err, { commandId });
                }
              });
            }
            break;
          case "ERROR":
            console.error("🔍 Worker: 에러 발생", error, { commandId });
            this.isConnected = false;
            if (commandId) {
              this.rejectCommand(
                commandId,
                error || new Error("Unknown error")
              );
            }
            this.notifyStateSubscriptions();
            break;
        }
      });

      if (useSharedWorker) {
        (this.port as MessagePort).start();
      }

      await this.sendCommand("CONNECT", config);
    };

    const cleanupWorker = () => {
      if (this.worker && "terminate" in this.worker) {
        (this.worker as Worker).terminate();
      }
      this.worker = null;
      this.port = null;
    };

    try {
      if (this.isSharedWorkerSupported) {
        try {
          console.log("🔍 SharedWorker 모드로 연결 시도");
          await tryConnect(true);
          console.log("🔍 SharedWorker 연결 성공");
        } catch (error) {
          console.warn("🔍 SharedWorker 연결 실패, DedicatedWorker로 폴백:", error);
          cleanupWorker();
          console.log("🔍 DedicatedWorker 모드로 연결 시도");
          await tryConnect(false);
          console.log("🔍 DedicatedWorker 연결 성공");
        }
      } else {
        console.log("🔍 DedicatedWorker 모드로 연결");
        await tryConnect(false);
      }
    } catch (error) {
      console.error("🔍 Worker 연결 실패:", error);
      cleanupWorker();
      throw error;
    }
  }

  async subscribe(
    topic: string,
    callback: (data: unknown) => void
  ): Promise<Subscription> {
    console.log("🔍 구독 시도 - topic:", topic);
    console.log("callback", callback, topic);

    const callbackId = crypto.randomUUID();

    // 기존 Map 가져오기 또는 새로 생성
    let callbacks = this.subscriptions.get(topic);
    const isFirstSubscriber = !callbacks || callbacks.size === 0;

    if (!callbacks) {
      callbacks = new Map<string, (data: unknown) => void>();
      this.subscriptions.set(topic, callbacks);
    }

    // ✅ 반드시 콜백 추가!
    callbacks.set(callbackId, callback);

    // 첫 구독자일 때만 워커에 SUBSCRIBE 전송 또는 대기열 추가
    if (isFirstSubscriber) {
      if (this.port && this.isConnected) {
        await this.sendCommand("SUBSCRIBE", { topic });
        console.log("🔍 구독 요청 완료 - topic:", topic);
      } else {
        if (!this.isConnected) {
          console.log("🔍 연결되지 않음, 구독 대기");
          // 대기 중인 구독으로 저장
          this.pendingSubscriptions.add(topic);
          console.log("🔍 대기 중인 구독 추가:", topic);
        }
        if (!this.port) {
          console.log("🔍 port 없음");
        }
      }
    }

    return { topic, id: callbackId };
  }

  async unsubscribe(subscription: Subscription): Promise<void> {
    this.pendingSubscriptions.delete(subscription.topic);
    const callbacks = this.subscriptions.get(subscription.topic);

    if (!callbacks) {
      return;
    }

    if (callbacks.has(subscription.id)) {
      callbacks.delete(subscription.id);
      // 남은 구독자가 없으면 실제로 해제
      if (callbacks.size === 0) {
        this.subscriptions.delete(subscription.topic);
        if (this.port && this.isConnected) {
          this.port.postMessage({
            type: "UNSUBSCRIBE",
            data: { topic: subscription.topic },
          } as WorkerMessage);
          console.log("🔍 구독 해제 요청 완료 - topic:", subscription.topic);
          console.log("🔍 잔여 구독 콜백 수", callbacks.size);
        }
      }
      return;
    }

    // 콜백 미지정 시 전체 해제
    this.subscriptions.delete(subscription.topic);
    if (this.port && this.isConnected) {
      this.port.postMessage({
        type: "UNSUBSCRIBE",
        data: { topic: subscription.topic },
      } as WorkerMessage);
      console.log("🔍 구독 해제 요청 완료 - topic:", subscription.topic);
    }
  }

  sendMessage(topic: string, message: unknown): void {
    if (this.port && this.isConnected) {
      this.port.postMessage({
        type: "SEND_MESSAGE",
        data: { topic, message },
      } as WorkerMessage);
      console.log("🔍 메시지 전송 요청 완료 - topic:", topic);
    } else {
      throw new Error("Socket is not connected");
    }
  }

  disconnect(): void {
    this.isConnected = false;

    if (this.port) {
      const disconnectCommandId = crypto.randomUUID();
      this.port.postMessage({
        type: "DISCONNECT",
        commandId: disconnectCommandId,
      } as WorkerMessage);
      console.log("🔍 연결 해제 요청 전송", { commandId: disconnectCommandId });
    }

    this.subscriptions.clear();
    this.port = null;
    this.worker = null;
    this.workerMode = "dedicated";
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getWorkerType(): "shared" | "dedicated" {
    return this.workerMode;
  }

  getSubscriptionCount(): number {
    let count = 0;
    this.subscriptions.forEach((set) => (count += set.size));
    return count;
  }

  private retryPendingSubscriptions(): void {
    console.log("🔍 대기 중인 구독들 재시도");

    if (this.pendingSubscriptions.size > 0) {
      console.log("🔍 재시도할 구독 개수:", this.pendingSubscriptions.size);

      this.pendingSubscriptions.forEach(async (topic) => {
        if (this.port && this.isConnected) {
          try {
            await this.sendCommand("SUBSCRIBE", { topic });
            console.log("🔍 지연 구독 요청 완료 - topic:", topic);
          } catch (error) {
            console.error("🔍 지연 구독 실패 - topic:", topic, error);
          }
        }
      });

      // 재시도 후 대기 목록 클리어
      this.pendingSubscriptions.clear();
      console.log("🔍 대기 목록 클리어 완료");
    } else {
      console.log("🔍 대기 중인 구독 없음");
    }
  }

  /**
   * commandId를 사용하여 비동기 명령 전송 및 응답 대기
   */
  private sendCommand(
    type: Exclude<
      WorkerMessage["type"],
      "SEND_MESSAGE" | "UNSUBSCRIBE" | "DISCONNECT"
    >,
    data?: unknown
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.port) {
        reject(new Error("Worker port is not available"));
        return;
      }

      const commandId = crypto.randomUUID();
      console.log("🔍 명령 전송:", { type, commandId, data });

      // 타임아웃 설정
      const timeout = setTimeout(() => {
        this.pendingCommands.delete(commandId);
        reject(new Error(`Command timeout: ${type} (${commandId})`));
      }, this.COMMAND_TIMEOUT);

      // Promise 저장
      this.pendingCommands.set(commandId, { resolve, reject, timeout });

      // 메시지 전송
      this.port.postMessage({
        type,
        data,
        commandId,
      } as WorkerMessage);
    });
  }

  /**
   * commandId로 Promise resolve
   */
  private resolveCommand(commandId: string, value?: unknown): void {
    const pending = this.pendingCommands.get(commandId);
    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingCommands.delete(commandId);
      pending.resolve(value);
      console.log("🔍 명령 완료:", { commandId, value });
    }
  }

  /**
   * commandId로 Promise reject
   */
  private rejectCommand(commandId: string, error: unknown): void {
    const pending = this.pendingCommands.get(commandId);
    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingCommands.delete(commandId);
      pending.reject(error);
      console.error("🔍 명령 실패:", { commandId, error });
    }
  }

  /**
   * 상태 변경 구독
   */
  storeSubscribe = (listener: () => void) => {
    this.stateSubscriptions.add(listener);
    return () => this.stateSubscriptions.delete(listener);
  };

  /**
   * 상태 변경 알림
   */
  private notifyStateSubscriptions(): void {
    this.stateSubscriptions.forEach((listener) => listener());
  }

  getSnapshot(): { isConnected: boolean } {
    return { isConnected: this.isConnected };
  }
}

export const sharedSocketManager = SharedSocketManager.getInstance();
