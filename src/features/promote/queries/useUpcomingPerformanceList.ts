import { useSuspenseQuery } from "@tanstack/react-query";
import { loadUpcomingPerformanceList } from "../api";

export const useUpcomingPerformanceList = () => {
  return useSuspenseQuery({
    queryKey: ["upcomingPerformanceList"],
    queryFn: loadUpcomingPerformanceList,
  });
};
