import { useSuspenseQuery } from "@tanstack/react-query";
import { LightningMeeting } from "@pThunder/shared";
import { getQueryClient } from "@pThunder/core";

const loadLightningData = async (): Promise<{ normalLightningMeetings: LightningMeeting[], schoolLightningMeetings: LightningMeeting[] }>  => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/lightning/search`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch lightning data");
  }

  const { normalLightningMeetings, schoolLightningMeetings } =
    await response.json();
  return { normalLightningMeetings, schoolLightningMeetings };
};

const useLoadLightningData = () => {
  return useSuspenseQuery({
    queryKey: ["lightning-data"],
    queryFn: loadLightningData,
  });
};

const prefetchLightningData = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["lightning-data"],
    queryFn: loadLightningData,
  });

  return queryClient;
};


export { useLoadLightningData, prefetchLightningData };