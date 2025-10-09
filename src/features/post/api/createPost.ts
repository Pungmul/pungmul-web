interface CreatePostParams {
  boardId: number;
  formData: FormData;
}

export const createPost = async ({
  boardId,
  formData,
}: CreatePostParams) => {
  const response = await fetch(`/api/posts?boardId=${boardId}`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("게시글 작성 실패");
  }

  return response.json();
};

