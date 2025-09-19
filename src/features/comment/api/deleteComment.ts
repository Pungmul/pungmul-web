import { useMutation } from "@tanstack/react-query";
import { Toast } from "@pThunder/store/share/toastStore";

const handleDeleteClick = async (commentId: number) => {
  try {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to delete comment");

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: handleDeleteClick,
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
