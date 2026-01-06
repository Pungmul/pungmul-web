import { getQueryClient } from "@pThunder/core";
import { loadLightningData } from "./loadLightningData";
import { lightningQueryKeys } from "../queries/queryKeys";

export const prefetchLightningData = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: lightningQueryKeys.data(),
    queryFn: loadLightningData,
  });

  return queryClient;
};
