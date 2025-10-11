export const deleteComment = async (commentId: number) => {
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