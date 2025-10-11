export const deleteReply = async (replyId: string) => {
  try {
    const response = await fetch(`/api/comments/replies/${replyId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to delete reply");

    return response.json();
  } catch (error) {
    throw error;
  }
};