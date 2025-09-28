import { useQuery } from "@tanstack/react-query";
import { getToken } from "../api";

export const useGetToken = () => {
    return useQuery({
      queryKey: ["token"],
      queryFn: getToken,
    });
  };