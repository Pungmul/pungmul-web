export const postComment = async (id: number, comment: string, anonymity: boolean) => {
  const response = await fetch(`/api/posts/${id}/comment`, {
    method: "POST",
    body: JSON.stringify({ content: comment, anonymity }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("댓글 작성 실패");

  return response.json();
};