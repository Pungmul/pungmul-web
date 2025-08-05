// SharedWorker 환경을 위한 필수 설정
self.exports = {};

importScripts('https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js');
importScripts('https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.1.0/bundles/stomp.umd.min.js');

console.log("🔍 SharedWorker: SockJS 로드됨:", typeof SockJS);
console.log("🔍 SharedWorker: self.StompJS 로드됨:", typeof self.StompJs);
console.log("🔍 SharedWorker: self.StompJS 로드됨:", self.StompJs);

let stompClient = null;
let connections = new Map();
let subscriptions = new Map();
let pendingSubscriptions = new Map(); // 대기 중인 구독들을 저장

// SharedWorker 모드
self.addEventListener("connect", (event) => {
  console.log("🔍 SharedWorker: connect 이벤트 수신");

  const port = event.ports[0];
  const clientId = Date.now() + Math.random();
  connections.set(clientId, port);

  console.log("🔍 SharedWorker: connections 확인:", connections);

  port.addEventListener("message", (event) => {
    console.log("🔍 SharedWorker: 메시지 수신:", event.data);
    handleMessage(event.data, clientId);
  });

  port.start(); // 반드시 호출
});

function handleMessage(data, clientId) {
  const { type, data: messageData } = data;

  switch (type) {
    case "CONNECT":
      connectWebSocket(messageData, clientId);
      break;
    case "SUBSCRIBE":
      subscribeToTopic(messageData, clientId);
      break;
    case "UNSUBSCRIBE":
      unsubscribeFromTopic(messageData, clientId);
      break;
    case "SEND_MESSAGE":
      sendMessage(messageData, clientId);
      break;
    case "DISCONNECT":
      disconnectClient(clientId);
      break;
  }
}

function connectWebSocket(config, clientId) {
  console.log("🔍 SharedWorker: WebSocket 연결 시도 - clientId:", clientId);

  if (stompClient && stompClient.connected) {
    console.log("🔍 SharedWorker: 이미 연결된 상태");
    sendToClient(clientId, {
      type: "CONNECTED",
      clientId: clientId,
    });
    return;
  }
  const socket = new SockJS(config.url);
  console.log("🔍 SharedWorker: SockJS 소켓 생성:", config.url);

  stompClient = new self.StompJs.Client({
    webSocketFactory: () => socket, // SockJS 사용
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: config.headers.Authorization,
    },
    debug: (str) => {
      console.log("🔍 SharedWorker: Stomp 디버그 메시지:", str);
    },
    onConnect: () => {
      console.log("🔍 SharedWorker: WebSocket 연결 완료");

      sendToClient(clientId, {
        type: "CONNECTED",
        clientId: clientId,
      });

      // 연결 완료 후 대기 중인 구독들을 다시 시도
      retryPendingSubscriptions();
    },
    onStompError: (error) => {
      console.error("❌ SharedWorker: STOMP 에러", error);
      sendToClient(clientId, {
        type: "ERROR",
        error: error,
      });
    },
  });

  if (!stompClient) {
    console.error("❌ SharedWorker: Stomp 클라이언트 생성 실패");
    sendToClient(clientId, {
      type: "ERROR",
      error: "Stomp 클라이언트 생성 실패",
    });
    return;
  }

  console.log("🔍 SharedWorker: Stomp 클라이언트 생성됨:", stompClient);

  stompClient.activate();
}

function subscribeToTopic(data, clientId) {
  console.log(
    "🔍 SharedWorker: 구독 시도 - topic:",
    data.topic,
    "clientId:",
    clientId
  );

  if (!stompClient || !stompClient.connected) {
    console.error("🔍 SharedWorker: WebSocket not connected, 구독 대기");
    // 대기 중인 구독으로 저장
    if (!pendingSubscriptions.has(clientId)) {
      pendingSubscriptions.set(clientId, []);
    }
    pendingSubscriptions.get(clientId).push(data);
    return;
  }

  const { topic } = data;

  // 이미 구독 중인 토픽인지 확인
  if (subscriptions.has(topic)) {
    const existingSubscribers = subscriptions.get(topic);
    existingSubscribers.add(clientId);
    console.log("🔍 SharedWorker: 기존 토픽에 구독자 추가:", topic);
  } else {
    // 새로운 토픽 구독
    const subscribers = new Set([clientId]);
    subscriptions.set(topic, subscribers);

    console.log("🔍 SharedWorker: 새로운 토픽 구독:", topic);

    stompClient.subscribe(topic, (message) => {
      console.log("🔍 SharedWorker: 메시지 수신 - topic:", topic);
      const messageData = JSON.parse(message.body);

      // 해당 토픽을 구독하는 모든 클라이언트에게 메시지 전달
      const topicSubscribers = subscriptions.get(topic);
      if (topicSubscribers) {
        topicSubscribers.forEach((subscriberId) => {
          sendToClient(subscriberId, {
            type: "MESSAGE",
            data: {
              topic: topic,
              message: messageData,
            },
          });
        });
      }
    });

    // 구독 완료 알림
    sendToClient(clientId, {
      type: "SUBSCRIBED",
      data: {
        topic: topic,
      },
    });
  }
}

function unsubscribeFromTopic(data, clientId) {
  const { topic } = data;

  // 클라이언트의 구독 제거
  if (subscriptions.has(topic)) {
    const subscribers = subscriptions.get(topic);
    subscribers.delete(clientId);

    // 해당 토픽을 구독하는 클라이언트가 없으면 구독 해제
    if (subscribers.size === 0) {
      subscriptions.delete(topic);
      console.log("🔍 SharedWorker: 토픽 구독 해제:", topic);
    }
  }
}

function sendMessage(data, clientId) {
  if (!stompClient || !stompClient.connected) {
    console.error("🔍 SharedWorker: WebSocket not connected");
    return;
  }

  const { topic, message } = data;
  stompClient.send(topic, {}, JSON.stringify(message));
  console.log("🔍 SharedWorker: 메시지 전송 - topic:", topic);
}

function disconnectClient(clientId) {
  // 클라이언트의 모든 구독 제거
  subscriptions.forEach((subscribers, topic) => {
    subscribers.delete(clientId);
    if (subscribers.size === 0) {
      subscriptions.delete(topic);
    }
  });

  // 연결 제거
  connections.delete(clientId);

  // 모든 클라이언트가 연결 해제된 경우 웹소켓도 해제
  if (connections.size === 0 && stompClient) {
    stompClient.disconnect();
    stompClient = null;
    console.log("🔍 SharedWorker: 모든 클라이언트 연결 해제, WebSocket 해제");
  }
}

function sendToClient(clientId, message) {
  const port = connections.get(clientId);
  if (port) {
    port.postMessage(message);
  }
}

function retryPendingSubscriptions() {
  console.log("🔍 SharedWorker: 대기 중인 구독들 재시도");
  console.log("🔍 DedicatedWorker: 대기 중인 구독들:", pendingSubscriptions);
  
  pendingSubscriptions.forEach((subscriptions, clientId) => {
    subscriptions.forEach((data) => {
      console.log("🔍 SharedWorker: 대기 중인 구독 재시도:", data.topic);
      subscribeToTopic(data, clientId);
    });
  });
  
  // 재시도 후 대기 목록 클리어
  pendingSubscriptions.clear();
}
