import { LocationType } from '../types';

export const updateUserLocation = async (
  payload: LocationType
): Promise<LocationType> => {
  const response = await fetch("/api/location", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update location");
  }

  return response.json();
};

