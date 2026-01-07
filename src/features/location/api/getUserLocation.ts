import { type LocationType, updateUserLocation } from "@/features/location";

import { locationStore } from "../store";

export const getUserLocation = async (): Promise<LocationType> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/location`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user location");
    }

    const serverLocation: LocationType | null = await response.json();

    if (
      !serverLocation ||
      !serverLocation.latitude ||
      !serverLocation.longitude
    ) {
      const { currentLocation, getCurrentPosition } = locationStore.getState();

      let patchPosition = currentLocation;

      if (!patchPosition) {
        const position = await getCurrentPosition();
        if (!position) {
          throw new Error("위치 정보를 가져올 수 없습니다.");
        }
        patchPosition = position;
      }

      if (!patchPosition) {
        throw new Error("위치 정보를 가져오는데 실패했습니다.");
      }

      const updatedLocation = await updateUserLocation({
        latitude: patchPosition.latitude,
        longitude: patchPosition.longitude,
      });

      return updatedLocation;
    }

    return serverLocation;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch user location");
  }
};
