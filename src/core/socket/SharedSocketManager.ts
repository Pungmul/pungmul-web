
export interface SocketConfig {
  url: string;
  headers?: Record<string, string>;
}

export class SharedSocketManager {
  private static instance: SharedSocketManager;
  private worker: SharedWorker | Worker | null = null;
  private port: MessagePort | null = null;
  private subscriptions = new Map<string, (data: unknown) => void>();
  private isConnected = false;
  private isSharedWorkerSupported: boolean;

  private constructor() {
    this.isSharedWorkerSupported = typeof SharedWorker !== 'undefined';
  }

  static getInstance(): SharedSocketManager {
    if (!SharedSocketManager.instance) {
      SharedSocketManager.instance = new SharedSocketManager();
    }
    return SharedSocketManager.instance;
  }

  async connect(config: SocketConfig): Promise<void> {
    if (this.worker) {
      return;
    }

    try {
      if (this.isSharedWorkerSupported) {
        // SharedWorker 사용 (최적화)
        this.worker = new SharedWorker('/socket-worker.js');
        this.port = (this.worker as SharedWorker).port;
        console.log('SharedWorker 모드로 연결');
      } else {
        // DedicatedWorker 사용 (폴백)
        this.worker = new Worker('/socket-worker.js');
        this.port = this.worker as unknown as MessagePort;
        console.log('DedicatedWorker 모드로 폴백');
      }

      if (!this.port) {
        throw new Error('Worker port initialization failed');
      }

      this.port.addEventListener('message', (event) => {
        const { type, data, error } = event.data;
        
        switch (type) {
          case 'CONNECTED':
            this.isConnected = true;
            console.log('Worker: WebSocket 연결 완료');
            break;
          case 'MESSAGE':
            const { topic, message } = data;
            const callback = this.subscriptions.get(topic);
            if (callback) {
              callback(message);
            }
            break;
          case 'ERROR':
            console.error('Worker: 에러 발생', error);
            this.isConnected = false;
            break;
        }
      });

      if (this.isSharedWorkerSupported && this.port) {
        (this.port as MessagePort).start();
      }

      // 웹소켓 연결 요청
      this.port.postMessage({
        type: 'CONNECT',
        data: config
      });

    } catch (error) {
      console.error('Worker 연결 실패:', error);
      throw error;
    }
  }

  subscribe(topic: string, callback: (data: unknown) => void): void {
    this.subscriptions.set(topic, callback);
    
    if (this.port && this.isConnected) {
      this.port.postMessage({
        type: 'SUBSCRIBE',
        data: { topic }
      });
    }
  }

  unsubscribe(topic: string): void {
    this.subscriptions.delete(topic);
    
    if (this.port && this.isConnected) {
      this.port.postMessage({
        type: 'UNSUBSCRIBE',
        data: { topic }
      });
    }
  }

  sendMessage(topic: string, message: unknown): void {
    if (this.port && this.isConnected) {
      this.port.postMessage({
        type: 'SEND_MESSAGE',
        data: { topic, message }
      });
    }
  }

  disconnect(): void {
    if (this.port) {
      this.port.postMessage({
        type: 'DISCONNECT'
      });
    }
    
    this.subscriptions.clear();
    this.isConnected = false;
    this.worker = null;
    this.port = null;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getWorkerType(): 'shared' | 'dedicated' {
    return this.isSharedWorkerSupported ? 'shared' : 'dedicated';
  }
}

export const sharedSocketManager = SharedSocketManager.getInstance(); 