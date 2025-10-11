export const postReply = async (
  id: number,
  comment: string,
  parentId: number,
  anonymity: boolean
) => {
  const response = await fetch(`/api/posts/${id}/comment`, {
    method: "POST",
    body: JSON.stringify({ content: comment, parentId, anonymity }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("대댓글 작성 실패");

  return response.json();
};