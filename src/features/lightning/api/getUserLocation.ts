import { LocationType } from "@/features/location";

export const getUserLocationAPI = async (): Promise<LocationType> => {
  const response = await fetch(`/api/location`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) throw new Error("서버 불안정" + response.status);

  return response.json();
};
