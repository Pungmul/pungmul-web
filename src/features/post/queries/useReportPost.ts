import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postQueryKeys } from "../constant/queryKeys";
import { reportPost } from "../api/reportPost";

export const useReportPostRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportPost,
    mutationKey: ["reportPost"],
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail(),
      });
    },
  });
};

