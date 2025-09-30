import type { LocationType } from "@/features/location";

export const getUserLocation = async (): Promise<LocationType> => {
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

  return response.json();
};

