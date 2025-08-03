// Worker 환경을 위한 필수 설정
self.exports = {};

// SockJS와 StompJS 라이브러리 로드
importScripts('https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js');
importScripts('https://cdn.jsdelivr.net/npm/@stomp/stompjs@7/bundles/stomp.umd.min.js');

let stompClient = null;
let connections = new Map();
let subscriptions = new Map();

// SharedWorker와 DedicatedWorker 모두 지원
if (typeof SharedWorker !== 'undefined') {
  // SharedWorker 모드
  self.addEventListener('connect', (event) => {
    const port = event.ports[0];
    const clientId = Date.now() + Math.random();
    
    connections.set(clientId, port);
    
    port.addEventListener('message', (event) => {
      handleMessage(event.data, clientId);
    });
    
    port.start();
  });
} else {
  // DedicatedWorker 모드
  self.addEventListener('message', (event) => {
    const clientId = 'dedicated-' + Date.now();
    handleMessage(event.data, clientId);
  });
}

function handleMessage(data, clientId) {
  const { type, data: messageData } = data;
  
  switch (type) {
    case 'CONNECT':
      connectWebSocket(messageData, clientId);
      break;
    case 'SUBSCRIBE':
      subscribeToTopic(messageData, clientId);
      break;
    case 'UNSUBSCRIBE':
      unsubscribeFromTopic(messageData, clientId);
      break;
    case 'SEND_MESSAGE':
      sendMessage(messageData, clientId);
      break;
    case 'DISCONNECT':
      disconnectClient(clientId);
      break;
  }
}

function connectWebSocket(config, clientId) {
  if (stompClient && stompClient.connected) {
    sendToClient(clientId, {
      type: 'CONNECTED',
      clientId: clientId
    });
    return;
  }
  
  // SockJS 연결
  const socket = new SockJS(config.url);
  
  // StompJS 클라이언트 생성 (exports.Stomp 사용)
  stompClient = exports.Stomp.over(socket);
  
  stompClient.connect(config.headers || {}, () => {
    console.log('Worker: WebSocket 연결 완료');
    
    // 모든 연결된 클라이언트에게 연결 완료 알림
    connections.forEach((port, id) => {
      sendToClient(id, {
        type: 'CONNECTED',
        clientId: id
      });
    });
  }, (error) => {
    console.error('Worker: STOMP 에러', error);
    sendToClient(clientId, {
      type: 'ERROR',
      error: error
    });
  });
}

function subscribeToTopic(data, clientId) {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected');
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
    
    stompClient.subscribe(topic, (message) => {
      const messageData = JSON.parse(message.body);
      
      // 해당 토픽을 구독하는 모든 클라이언트에게 메시지 전달
      const topicSubscribers = subscriptions.get(topic);
      if (topicSubscribers) {
        topicSubscribers.forEach(subscriberId => {
          sendToClient(subscriberId, {
            type: 'MESSAGE',
            data: {
              topic: topic,
              message: messageData
            }
          });
        });
      }
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
      // STOMP 구독 해제는 실제로는 구현하지 않음 (다른 클라이언트가 사용할 수 있으므로)
    }
  }
}

function sendMessage(data, clientId) {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket not connected');
    return;
  }
  
  const { topic, message } = data;
  stompClient.send(topic, {}, JSON.stringify(message));
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
    console.log('Worker: 모든 클라이언트 연결 해제, WebSocket 해제');
  }
}

function sendToClient(clientId, message) {
  const port = connections.get(clientId);
  if (port) {
    if (typeof SharedWorker !== 'undefined') {
      // SharedWorker 모드
      port.postMessage(message);
    } else {
      // DedicatedWorker 모드
      self.postMessage(message);
    }
  }
} 