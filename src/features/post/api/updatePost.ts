interface UpdatePostParams {
  postId: number;
  formData: FormData;
}

export const updatePost = async ({ postId, formData }: UpdatePostParams) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: "PATCH",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("게시글 수정 실패");
  }

  return response.json();
};

