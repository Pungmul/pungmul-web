import { useLocationStore } from "./locationStore";

/**
 * 위치 정보와 관련된 상태 및 액션을 제공하는 훅
 */
export const useLocation = () => {
  const {
    location,
    warrentedLocation,
    isWatching,
    error,
    getCurrentPosition,
    startWatching,
    stopWatching,
  } = useLocationStore();

  return {
    // 상태
    location,
    warrentedLocation,
    isWatching,
    error,
    
    // 액션
    getCurrentPosition,
    startWatching,
    stopWatching,
  };
};

/**
 * 위치 감시를 자동으로 시작하고 정리하는 훅
 */
export const useLocationWatcher = () => {
  const { startWatching, stopWatching } = useLocationStore();
  
  return {
    startWatching,
    stopWatching,
  };
};

/**
 * 현재 확인된 위치만 가져오는 훅 (서버에 업데이트된 위치)
 */
export const useWarrentedLocation = () => {
  return useLocationStore((state) => state.warrentedLocation);
};

/**
 * 실시간 위치만 가져오는 훅
 */
export const useCurrentLocation = () => {
  return useLocationStore((state) => state.location);
}; 