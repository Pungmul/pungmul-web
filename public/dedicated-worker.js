// DedicatedWorker 환경을 위한 필수 설정
self.exports = {};
importScripts('https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js');
importScripts('https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.1.0/bundles/stomp.umd.min.js');

let stompClient = null;
const subscriptions = new Map();
const pendingSubscriptions = []; // 대기 중인 구독들을 저장

// DedicatedWorker 모드
self.addEventListener("message", (event) => {
  console.log("🔍 DedicatedWorker: message 이벤트 수신:", event.data);
  handleMessage(event.data);
});

function handleMessage(data) {
  const { type, data: messageData } = data;

  switch (type) {
    case "CONNECT":
      connectWebSocket(messageData);
      break;
    case "SUBSCRIBE":
      subscribeToTopic(messageData);
      break;
    case "UNSUBSCRIBE":
      unsubscribeFromTopic(messageData);
      break;
    case "SEND_MESSAGE":
      sendMessage(messageData);
      break;
    case "DISCONNECT":
      disconnectWebSocket();
      break;
  }
}

function connectWebSocket(config) {
  console.log("🔍 DedicatedWorker: WebSocket 연결 시도");
  
  if (stompClient && stompClient.connected) {
    console.log("🔍 DedicatedWorker: 이미 연결된 상태");
    self.postMessage({
      type: "CONNECTED",
    });
    return;
  }

  // SockJS 연결
  const socket = new SockJS(config.url);
  console.log("🔍 DedicatedWorker: SockJS 소켓 생성:", config.url);

  stompClient = exports.Stomp.over(socket);
  
  if (!stompClient) {
    console.error("❌ DedicatedWorker: Stomp 클라이언트 생성 실패");
    self.postMessage({
      type: "ERROR",
      error: "Stomp 클라이언트 생성 실패",
    });
    return;
  }
  console.log("🔍 DedicatedWorker: Stomp 클라이언트 생성됨:", stompClient);

  stompClient.connect(
    config.headers || {},
    () => {
      console.log("🔍 DedicatedWorker: WebSocket 연결 완료");
      self.postMessage({
        type: "CONNECTED",
      });

      // 연결 완료 후 대기 중인 구독들을 다시 시도
      retryPendingSubscriptions();
    },
    (error) => {
      console.error("🔍 DedicatedWorker: STOMP 에러", error);
      self.postMessage({
        type: "ERROR",
        error: error,
      });
    }
  );
}

function subscribeToTopic(data) {
  console.log("🔍 DedicatedWorker: 구독 시도 - topic:", data.topic);
  
  if (!stompClient || !stompClient.connected) {
    console.error("🔍 DedicatedWorker: WebSocket not connected, 구독 대기");
    // 대기 중인 구독으로 저장
    pendingSubscriptions.push(data);
    console.log("🔍 DedicatedWorker: 대기 중인 구독 추가:", data.topic);
    return;
  }

  const { topic } = data;

  // 이미 구독 중인 토픽인지 확인
  if (subscriptions.has(topic)) {
    console.log("🔍 DedicatedWorker: 이미 구독 중인 토픽:", topic);
    return;
  } else {
    // 새로운 토픽 구독
    subscriptions.set(topic, true);

    console.log("🔍 DedicatedWorker: 새로운 토픽 구독:", topic);
    
    stompClient.subscribe(topic, (message) => {
      console.log("🔍 DedicatedWorker: 메시지 수신 - topic:", topic);
      const messageData = JSON.parse(message.body);

      self.postMessage({
        type: "MESSAGE",
        data: {
          topic: topic,
          message: messageData,
        },
      });
    });

    // 구독 완료 알림
    self.postMessage({
      type: "SUBSCRIBED",
      data: {
        topic: topic,
      },
    });
  }
}

function unsubscribeFromTopic(data) {
  const { topic } = data;

  // 구독 제거
  if (subscriptions.has(topic)) {
    subscriptions.delete(topic);
    console.log("🔍 DedicatedWorker: 구독 해제:", topic);
  }
}

function sendMessage(data) {
  if (!stompClient || !stompClient.connected) {
    console.error("🔍 DedicatedWorker: WebSocket not connected");
    return;
  }

  const { topic, message } = data;
  stompClient.publish({destination: topic, body: JSON.stringify(message)});
  console.log("🔍 DedicatedWorker: 메시지 전송 - topic:", topic);
}

function disconnectWebSocket() {
  if (stompClient) {
    stompClient.disconnect();
    stompClient = null;
    subscriptions.clear();
    pendingSubscriptions = [];
    console.log("🔍 DedicatedWorker: WebSocket 연결 해제");
  }
}

function retryPendingSubscriptions() {
  console.log("🔍 DedicatedWorker: 대기 중인 구독들 재시도");
  console.log("🔍 DedicatedWorker: 대기 중인 구독들:", pendingSubscriptions);
  if (pendingSubscriptions.length > 0) {
    console.log("🔍 DedicatedWorker: 재시도할 구독 개수:", pendingSubscriptions.length);
    
    pendingSubscriptions.forEach((data) => {
      console.log("🔍 DedicatedWorker: 대기 중인 구독 재시도:", data.topic);
      subscribeToTopic(data);
    });
    
    // 재시도 후 대기 목록 클리어
    pendingSubscriptions = [];
    console.log("🔍 DedicatedWorker: 대기 목록 클리어 완료");
  } else {
    console.log("🔍 DedicatedWorker: 대기 중인 구독 없음");
  }
}
