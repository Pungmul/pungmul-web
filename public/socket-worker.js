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

  console.log(
    "[SocketWorker] 클라이언트 연결됨:",
    clientId,
    "총 연결 수:",
    connections.size
  );

  port.addEventListener("message", (event) => {
    handleMessage(event.data, clientId);
  });

  port.start(); // 반드시 호출
});

function handleMessage(data, clientId) {
  const { type, data: messageData, commandId = null } = data;

  console.log("[SocketWorker] 메시지 수신:", {
    type,
    clientId,
    data: messageData,
    commandId,
  });

  switch (type) {
    case "CONNECT":
      connectWebSocket(messageData, clientId, commandId);
      break;
    case "SUBSCRIBE":
      subscribeToTopic(messageData, clientId, commandId);
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

function connectWebSocket(config, clientId, commandId) {
  console.log("[SocketWorker] WebSocket 연결 시도:", {
    clientId,
    commandId,
    url: config.url,
  });

  if (stompClient && stompClient.connected) {
    console.log("[SocketWorker] 이미 연결된 WebSocket 재사용:", clientId);
    sendToClient(clientId, {
      type: "CONNECTED",
      clientId: clientId,
      commandId: commandId,
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
      console.log("[SocketWorker] WebSocket 연결 성공:", {
        clientId,
        commandId,
      });

      sendToClient(clientId, {
        type: "CONNECTED",
        clientId: clientId,
        commandId: commandId,
      });

      // 연결 완료 후 대기 중인 구독들을 다시 시도
      retryPendingSubscriptions();
    },
    onStompError: (error) => {
      console.error("[SocketWorker] WebSocket 연결 에러:", {
        error,
        clientId,
        commandId,
      });
      sendToClient(clientId, {
        type: "ERROR",
        error: error,
        commandId: commandId,
      });
    },
  });

  if (!stompClient) {
    console.error("[SocketWorker] Stomp 클라이언트 생성 실패:", {
      clientId,
      commandId,
    });
    sendToClient(clientId, {
      type: "ERROR",
      error: "Stomp 클라이언트 생성 실패",
      commandId: commandId,
    });
    return;
  }

  console.log("[SocketWorker] Stomp 클라이언트 활성화 중...");
  stompClient.activate();
}

function subscribeToTopic(data, clientId, commandId) {
  const { topic } = data;

  if (!stompClient || !stompClient.connected) {
    console.log("[SocketWorker] WebSocket 미연결, 구독 대기:", {
      topic,
      clientId,
      commandId,
    });
    // 대기 중인 구독으로 저장
    if (!pendingSubscriptions.has(clientId)) {
      pendingSubscriptions.set(clientId, []);
    }
    pendingSubscriptions.get(clientId).push({ ...data, commandId });
    return;
  }

  // 이미 구독 중인 토픽인지 확인
  if (subscriptions.has(topic)) {
    console.log("[SocketWorker] 기존 토픽에 클라이언트 추가:", {
      topic,
      clientId,
    });
    const existingSubscribers = subscriptions.get(topic);
    existingSubscribers.add(clientId);
  } else {
    console.log("[SocketWorker] 새 토픽 구독:", { topic, clientId });
    // 새로운 토픽 구독
    const subscribers = new Set([clientId]);
    subscriptions.set(topic, subscribers);

    try {
      stompClient.subscribe(topic, (message) => {
        const messageData = JSON.parse(message.body);
        console.log("[SocketWorker] 토픽 메시지 수신:", { topic, messageData });

        // 해당 토픽을 구독하는 모든 클라이언트에게 메시지 전달
        const topicSubscribers = subscriptions.get(topic);
        if (topicSubscribers) {
          console.log("[SocketWorker] 클라이언트들에게 메시지 전달:", {
            topic,
            subscriberCount: topicSubscribers.size,
          });
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
        commandId: commandId,
      });
      console.log("[SocketWorker] 구독 완료:", { topic, clientId, commandId });
    } catch (error) {
      console.error("[SocketWorker] 구독 에러:", {
        topic,
        clientId,
        commandId,
        error,
      });
      sendToClient(clientId, {
        type: "ERROR",
        error: error,
        commandId: commandId,
      });
    }
  }
}

function unsubscribeFromTopic(data, clientId) {
  const { topic } = data;
  console.log("[SocketWorker] 토픽 구독 해제:", { topic, clientId });

  // 클라이언트의 구독 제거
  if (subscriptions.has(topic)) {
    const subscribers = subscriptions.get(topic);
    subscribers.delete(clientId);

    // 해당 토픽을 구독하는 클라이언트가 없으면 구독 해제
    if (subscribers.size === 0) {
      console.log("[SocketWorker] 토픽에 구독자가 없어 구독 해제:", topic);
      subscriptions.delete(topic);
    }
  }
}

function sendMessage(data, clientId) {
  if (!stompClient || !stompClient.connected) {
    console.warn("[SocketWorker] WebSocket 미연결, 메시지 전송 실패:", {
      clientId,
      data,
    });
    return;
  }

  const { topic, message } = data;
  console.log("[SocketWorker] 메시지 전송:", { topic, clientId, message });
  stompClient.publish({ destination: topic, body: JSON.stringify(message) });
}

function disconnectClient(clientId) {
  console.log("[SocketWorker] 클라이언트 연결 해제:", { clientId });

  // 클라이언트의 모든 구독 제거
  subscriptions.forEach((subscribers, topic) => {
    subscribers.delete(clientId);
    if (subscribers.size === 0) {
      console.log("[SocketWorker] 토픽 구독 해제 (구독자 없음):", topic);
      subscriptions.delete(topic);
    }
  });

  // 연결 제거
  connections.delete(clientId);
  console.log("[SocketWorker] 남은 연결 수:", connections.size);

  // 모든 클라이언트가 연결 해제된 경우 웹소켓도 해제
  if (connections.size === 0 && stompClient) {
    console.log("[SocketWorker] 모든 클라이언트 연결 해제, WebSocket 종료");
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
    console.log("[SocketWorker] 클라이언트에게 메시지 전송:", {
      clientId,
      messageType: message.type,
    });
    port.postMessage(message);
  } else {
    console.warn("[SocketWorker] 클라이언트 포트를 찾을 수 없음:", clientId);
  }
}

function retryPendingSubscriptions() {
  console.log("[SocketWorker] 대기 중인 구독 재시도:", {
    pendingCount: pendingSubscriptions.size,
  });
  pendingSubscriptions.forEach((subscriptions, clientId) => {
    subscriptions.forEach((data) => {
      const { commandId } = data;
      subscribeToTopic(data, clientId, commandId);
    });
  });

  // 재시도 후 대기 목록 클리어
  pendingSubscriptions.clear();
  console.log("[SocketWorker] 대기 중인 구독 재시도 완료");
}
