import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@/core";
import { postQueryKeys } from "@pThunder/features/post";
import { reportComment } from "../api/reportComment";

export const useReportComment = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: reportComment,
    mutationKey: ["reportComment"],
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail(),
      });
    },
  });
};
