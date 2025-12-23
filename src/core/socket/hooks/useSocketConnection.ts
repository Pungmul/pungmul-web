import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector"
import { sharedSocketManager } from "../SharedSocketManager"
/**
 * 
 * @returns 웹 소켓에 연결되어 구독을 받을 준비가 된 상태를 반환합니다.
 */
export function useSocketConnection() {
    return useSyncExternalStoreWithSelector(
        (callback) => sharedSocketManager.storeSubscribe(callback),
        () => sharedSocketManager.getConnectionStatus(),
        () => false,
        (state) => state,
    );
  }