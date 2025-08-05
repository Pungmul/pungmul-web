
export interface SocketConfig {
  url: string;
  headers?: Record<string, string>;
}

export class SharedSocketManager {
  private static instance: SharedSocketManager;
  private worker: SharedWorker | Worker | null = null;
  private port: MessagePort | null = null;
  private subscriptions = new Map<string, (data: unknown) => void>();
  private pendingSubscriptions = new Set<string>(); // 대기 중인 구독들
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
      console.log('🔍 이미 Worker가 존재함');
      return;
    }

    try {
      console.log('🔍 Worker 생성 시작');
      
      if (this.isSharedWorkerSupported) {
        // SharedWorker 사용 (최적화)
        this.worker = new SharedWorker('/socket-worker.js');
        this.port = (this.worker as SharedWorker).port;
        console.log('🔍 SharedWorker 모드로 연결');
      } else {
        // DedicatedWorker 사용 (폴백)
        this.worker = new Worker('/dedicated-worker.js');
        this.port = this.worker as unknown as MessagePort;
        console.log('🔍 DedicatedWorker 모드로 폴백');
      }

      if (!this.port) {
        throw new Error('Worker port initialization failed');
      }

      this.port.addEventListener('message', (event) => {
        const { type, data, error } = event.data;
        console.log('🔍 Worker 메시지 수신:', type, data);
        
        switch (type) {
          case 'CONNECTED':
            this.isConnected = true;
            console.log('🔍 Worker: WebSocket 연결 완료');
            // 연결 완료 후 대기 중인 구독들을 처리
            this.retryPendingSubscriptions();
            break;
          case 'SUBSCRIBED':
            const { topic: subscribedTopic } = data;
            console.log('🔍 Worker: 구독 완료 - topic:', subscribedTopic);
            break;
          case 'MESSAGE':
            const { topic, message } = data;
            console.log('🔍 Worker: 메시지 수신 - topic:', topic, 'message:', message);
            const callback = this.subscriptions.get(topic);
            if (callback) {
              callback(message);
            }
            break;
          case 'ERROR':
            console.error('🔍 Worker: 에러 발생', error);
            this.isConnected = false;
            break;
        }
      });

      if (this.isSharedWorkerSupported && this.port) {
        (this.port as MessagePort).start();
        console.log("🔍 port start");
      }

      // 웹소켓 연결 요청
      this.port.postMessage({
        type: 'CONNECT',
        data: config
      });
      console.log("🔍 connect 요청 전송");

    } catch (error) {
      console.error('🔍 Worker 연결 실패:', error);
      throw error;
    }
  }

  subscribe(topic: string, callback: (data: unknown) => void): void {
    console.log('🔍 구독 시도 - topic:', topic);
    this.subscriptions.set(topic, callback);
    
    if (this.port && this.isConnected) {
      this.port.postMessage({
        type: 'SUBSCRIBE',
        data: { topic }
      });
      console.log('🔍 구독 요청 전송 - topic:', topic);
    } else {
      if (!this.isConnected) {
        console.log('🔍 연결되지 않음, 구독 대기');
        // 대기 중인 구독으로 저장
        this.pendingSubscriptions.add(topic);
        console.log('🔍 대기 중인 구독 추가:', topic);
      }
      if (!this.port) {
        console.log('🔍 port 없음'); 
      }
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

  getSubscriptionCount(): number {
    return this.subscriptions.size;
  }

  private retryPendingSubscriptions(): void {
    console.log('🔍 대기 중인 구독들 재시도');
    
    if (this.pendingSubscriptions.size > 0) {
      console.log('🔍 재시도할 구독 개수:', this.pendingSubscriptions.size);
      
      this.pendingSubscriptions.forEach((topic) => {
        if (this.port && this.isConnected) {
          this.port.postMessage({
            type: 'SUBSCRIBE',
            data: { topic }
          });
          console.log('🔍 지연 구독 요청 전송 - topic:', topic);
        }
      });
      
      // 재시도 후 대기 목록 클리어
      this.pendingSubscriptions.clear();
      console.log('🔍 대기 목록 클리어 완료');
    } else {
      console.log('🔍 대기 중인 구독 없음');
    }
  }
}

export const sharedSocketManager = SharedSocketManager.getInstance(); 