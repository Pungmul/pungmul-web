import { useMutation } from "@tanstack/react-query";

const loadPostDetail = async (postId: number) => {
  const response = await fetch(`/api/posts/${postId}`);
  return response.json();
};

const handleDeleteClick = async (postId: number) => {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
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
  return useMutation({
    mutationFn: handleDeleteClick,
    mutationKey: [],
  });
};

export { loadPostDetail, useDeletePost };
