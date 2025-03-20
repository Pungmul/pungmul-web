export declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
      // 필요한 다른 메서드들 추가 가능
    };
  }
}