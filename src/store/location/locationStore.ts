import { create } from "zustand";
import { throttle } from "lodash";
import { LocationType } from "@/shared/types/location/type";

interface LocationState {
  location: LocationType | null;
  warrentedLocation: LocationType | null;
  isWatching: boolean;
  watchId: number | null;
  error: GeolocationPositionError | null;
  
  // Actions
  setLocation: (location: LocationType) => void;
  setWarrentedLocation: (location: LocationType) => void;
  setError: (error: GeolocationPositionError | null) => void;
  startWatching: () => void;
  stopWatching: () => void;
  getCurrentPosition: () => Promise<void>;
  updateUserLocationOnServer: (latitude: number, longitude: number) => Promise<void>;
}

// 서버에 위치 업데이트 요청하는 함수
const updateUserLocation = async (latitude: number, longitude: number) => {
  const response = await fetch("/location/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ latitude, longitude }),
  });

  if (!response.ok) {
    throw new Error("Failed to update location");
  }

  return response.json();
};

export const useLocationStore = create<LocationState>((set, get) => ({
  location: null,
  warrentedLocation: null,
  isWatching: false,
  watchId: null,
  error: null,

  setLocation: (location: LocationType) => {
    set({ location });
    
    // 위치가 설정되면 서버에 업데이트
    const { updateUserLocationOnServer } = get();
    updateUserLocationOnServer(location.latitude, location.longitude);
  },

  setWarrentedLocation: (location: LocationType) => {
    set({ warrentedLocation: location });
  },

  setError: (error: GeolocationPositionError | null) => {
    set({ error });
  },

  updateUserLocationOnServer: async (latitude: number, longitude: number) => {
    try {
      await updateUserLocation(latitude, longitude);
      const { location } = get();
      if (location) {
        get().setWarrentedLocation(location);
      }
    } catch (error) {
      console.error("Error patching location:", error);
      get().setError(error as GeolocationPositionError);
    }
  },

  getCurrentPosition: async () => {
    return new Promise((resolve, reject) => {
      const { geolocation } = navigator;

      if (!geolocation) {
        const error = new Error("Geolocation is not supported by this browser.");
        console.error(error.message);
        reject(error);
        return;
      }

      geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          get().setLocation(newLocation);
          resolve();
        },
        (error) => {
          console.error("Geolocation error:", error);
          get().setError(error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  },

  startWatching: () => {
    const { geolocation } = navigator;
    
    if (!geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    const { isWatching } = get();
    if (isWatching) {
      return; // 이미 감시 중이면 리턴
    }

    // throttled 위치 업데이트 함수 (10초마다)
    const throttledSetLocation = throttle((position: GeolocationPosition) => {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      get().setLocation(newLocation);
    }, 10000);

    const watchId = geolocation.watchPosition(
      throttledSetLocation,
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.error("Permission denied for geolocation");
        } else {
          console.error("Geolocation error:", error);
        }
        get().setError(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    set({ isWatching: true, watchId, error: null });
  },

  stopWatching: () => {
    const { watchId } = get();
    
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      set({ isWatching: false, watchId: null });
    }
  },
})); 