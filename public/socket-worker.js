// SharedWorker 환경을 위한 필수 설정
self.exports = {};

importScripts(
  "https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"
);
importScripts(
  "https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.1.0/bundles/stomp.umd.min.js"
);

let stompClient = null;
const connections = new Map();
const subscriptions = new Map();
const pendingSubscriptions = new Map(); // 대기 중인 구독들을 저장

// SharedWorker 모드
self.addEventListener("connect", (event) => {

  const port = event.ports[0];
  const clientId = Date.now() + Math.random();
  connections.set(clientId, port);

  port.addEventListener("message", (event) => {
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
  if (stompClient && stompClient.connected) {
    sendToClient(clientId, {
      type: "CONNECTED",
      clientId: clientId,
    });
    return;
  }
  const socket = new SockJS(config.url);

  stompClient = new self.StompJs.Client({
    webSocketFactory: () => socket, // SockJS 사용
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: config.headers.Authorization,
    },
    onConnect: () => {

      sendToClient(clientId, {
        type: "CONNECTED",
        clientId: clientId,
      });

      // 연결 완료 후 대기 중인 구독들을 다시 시도
      retryPendingSubscriptions();
    },
    onStompError: (error) => {
      sendToClient(clientId, {
        type: "ERROR",
        error: error,
      });
    },
  });

  if (!stompClient) {
    sendToClient(clientId, {
      type: "ERROR",
      error: "Stomp 클라이언트 생성 실패",
    });
    return;
  }

  stompClient.activate();
}

function subscribeToTopic(data, clientId) {
  if (!stompClient || !stompClient.connected) {
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
  } else {
    // 새로운 토픽 구독
    const subscribers = new Set([clientId]);
    subscriptions.set(topic, subscribers);

    try {
      stompClient.subscribe(topic, (message) => {
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
    } catch (error) {
      sendToClient(clientId, {
        type: "ERROR",
        error: error,
      });
    }
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
    }
  }
}

function sendMessage(data, clientId) {
  if (!stompClient || !stompClient.connected) {
    return;
  }

  const { topic, message } = data;
  stompClient.publish({destination: topic, body: JSON.stringify(message)});
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
  }
}

/**
 *
 * @param {string} clientId
 * @param {{type: "MESSAGE"|"IMAGE", data: {topic: string, message: object}}} message
 */
function sendToClient(clientId, message) {
  const port = connections.get(clientId);
  if (port) {
    port.postMessage(message);
  }
}

function retryPendingSubscriptions() {
  pendingSubscriptions.forEach((subscriptions, clientId) => {
    subscriptions.forEach((data) => {
      subscribeToTopic(data, clientId);
    });
  });

  // 재시도 후 대기 목록 클리어
  pendingSubscriptions.clear();
}
