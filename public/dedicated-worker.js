// DedicatedWorker 환경을 위한 필수 설정
self.exports = {};
importScripts('https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js');
importScripts('https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.1.0/bundles/stomp.umd.min.js');

let stompClient = null;
const subscriptions = new Map();
const pendingSubscriptions = []; // 대기 중인 구독들을 저장

// DedicatedWorker 모드
self.addEventListener("message", (event) => {
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
  if (stompClient && stompClient.connected) {
    self.postMessage({
      type: "CONNECTED",
    });
    return;
  }

  // SockJS 연결
  const socket = new SockJS(config.url);

  stompClient = exports.Stomp.over(socket);
  
  if (!stompClient) {
    self.postMessage({
      type: "ERROR",
      error: "Stomp 클라이언트 생성 실패",
    });
    return;
  }

  stompClient.connect(
    config.headers || {},
    () => {
      self.postMessage({
        type: "CONNECTED",
      });

      // 연결 완료 후 대기 중인 구독들을 다시 시도
      retryPendingSubscriptions();
    },
    (error) => {
      self.postMessage({
        type: "ERROR",
        error: error,
      });
    }
  );
}

function subscribeToTopic(data) {
  
  if (!stompClient || !stompClient.connected) {
    // 대기 중인 구독으로 저장
    pendingSubscriptions.push(data);
    return;
  }

  const { topic } = data;

  // 이미 구독 중인 토픽인지 확인
  if (subscriptions.has(topic)) {
    return;
  } else {
    // 새로운 토픽 구독
    subscriptions.set(topic, true);

    
    stompClient.subscribe(topic, (message) => {
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
  }
}

function sendMessage(data) {
  if (!stompClient || !stompClient.connected) {
    return;
  }

  const { topic, message } = data;
  stompClient.publish({destination: topic, body: JSON.stringify(message)});
}

function disconnectWebSocket() {
  if (stompClient) {
    stompClient.disconnect();
    stompClient = null;
    subscriptions.clear();
    pendingSubscriptions = [];
  }
}

function retryPendingSubscriptions() {
  if (pendingSubscriptions.length > 0) {
    
    pendingSubscriptions.forEach((data) => {
      subscribeToTopic(data);
    });
    
    // 재시도 후 대기 목록 클리어
    pendingSubscriptions = [];
  }
}
