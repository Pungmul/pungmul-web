import { useEffect, useRef, useState, useCallback } from 'react';
import { sharedSocketManager, SocketConfig } from './SharedSocketManager';

export interface UseSharedSocketOptions {
  autoConnect?: boolean;
  config?: SocketConfig;
}

export interface UseSharedSocketReturn {
  isConnected: boolean;
  connect: (config?: SocketConfig) => Promise<void>;
  disconnect: () => void;
  subscribe: (topic: string, callback: (data: unknown) => void) => void;
  unsubscribe: (topic: string) => void;
  sendMessage: (topic: string, message: unknown) => void;
}

export function useSharedSocket(options: UseSharedSocketOptions = {}): UseSharedSocketReturn {
  const { autoConnect = false, config } = options;
  const [isConnected, setIsConnected] = useState(false);
  const subscriptionsRef = useRef<Set<string>>(new Set());

  const connect = useCallback(async (connectConfig?: SocketConfig) => {
    try {
      const finalConfig = connectConfig || config;
      if (!finalConfig) {
        throw new Error('Socket configuration is required');
      }

      await sharedSocketManager.connect(finalConfig);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
      throw error;
    }
  }, [config]);

  const disconnect = useCallback(() => {
    sharedSocketManager.disconnect();
    setIsConnected(false);
    subscriptionsRef.current.clear();
  }, []);

  const subscribe = useCallback((topic: string, callback: (data: unknown) => void) => {
    if (!isConnected) {
      console.warn('Cannot subscribe: WebSocket not connected');
      return;
    }

    sharedSocketManager.subscribe(topic, callback);
    subscriptionsRef.current.add(topic);
  }, [isConnected]);

  const unsubscribe = useCallback((topic: string) => {
    sharedSocketManager.unsubscribe(topic);
    subscriptionsRef.current.delete(topic);
  }, []);

  const sendMessage = useCallback((topic: string, message: unknown) => {
    if (!isConnected) {
      console.warn('Cannot send message: WebSocket not connected');
      return;
    }

    sharedSocketManager.sendMessage(topic, message);
  }, [isConnected]);

  // 자동 연결
  useEffect(() => {
    if (autoConnect && config) {
      connect();
    }

    return () => {
      // 컴포넌트 언마운트 시 구독 해제
      subscriptionsRef.current.forEach(topic => {
        sharedSocketManager.unsubscribe(topic);
      });
    };
  }, [autoConnect, config, connect]);

  return {
    isConnected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    sendMessage
  };
} 