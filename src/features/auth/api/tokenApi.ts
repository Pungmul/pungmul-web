import { getQueryClient } from "@pThunder/core";
import { useQuery } from "@tanstack/react-query";

const getToken = async (): Promise<string> => {
  const token = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/auth/token`, {
    credentials: "include",
  });

  const { accessToken } = await token.json();

  return accessToken;
};

const useGetToken = () => {
  return useQuery({
    queryKey: ["token"],
    queryFn: getToken,
  });
};

const prefetchToken = () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["token"],
    queryFn: getToken,
  });
  return queryClient;
};

export { getToken, useGetToken, prefetchToken };
