import { useMutation } from "@tanstack/react-query";
import { deleteReply } from "../api/deleteReply";

export const useDeleteReply = () => {
  return useMutation({
    mutationFn: deleteReply,
    onSuccess: () => {
      console.log("대댓글 삭제 성공");
    },
    onError: (error) => {
      console.error("대댓글 삭제 실패:", error);
    },
  });
};
