import { useMutation } from "@tanstack/react-query";
import { Toast } from "@/shared/store";
import { deleteComment } from "../api/deleteComment";

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      Toast.show({ message: "삭제되었습니다.", type: "success" });
    },
    onError: (error) => {
      Toast.show({
        message: "삭제에 실패했습니다.\n" + error.message,
        type: "error",
      });
    },
  });
};
