import { getQueryClient } from "@pThunder/core";
import { loadLightningData } from "./loadLightningData";

export const prefetchLightningData = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["lightning-data"],
    queryFn: loadLightningData,
  });

  return queryClient;
};
