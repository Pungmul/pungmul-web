import { getQueryClient } from "@pThunder/core";
import { useMutation } from "@tanstack/react-query";

const loadPostDetail = async (postId: number) => {
  const response = await fetch(`/api/post/${postId}`);
  return response.json();
};


const handleDeleteClick = async (postId: number) => {
  try {
    const response = await fetch(`/board/post/${postId}/delete`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error("삭제에 실패했습니다.");
    }
  } catch (error) {
    throw new Error("삭제에 실패했습니다." + error);
  }
};

const useDeletePost = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: handleDeleteClick,
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ["postDetail", postId] , refetchType: "all"});
      queryClient.invalidateQueries({ queryKey: ["postList"] , refetchType: "all"});
    }
  });
};


export { loadPostDetail, useDeletePost };