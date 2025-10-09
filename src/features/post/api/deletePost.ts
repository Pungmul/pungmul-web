interface DeletePostParams {
  postId: number;
}

export const deletePost = async ({ postId }: DeletePostParams) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("게시글 삭제 실패");
  }

  return response.json();
};

