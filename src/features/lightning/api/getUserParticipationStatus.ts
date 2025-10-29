import type { UserParticipationData } from "@/features/lightning";

export const getUserParticipationStatusAPI = async (): Promise<UserParticipationData> => {
  const response = await fetch(`/api/lightning/status`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) throw new Error("서버 불안정" + response.status);

  return response.json();
};
