export const postComment = async (id: number, comment: string) => {
  try {
    const response = await fetch(`${id}/comment?postID=${id}`, {
      method: "POST",
      body: JSON.stringify({ content: comment }),
      credentials: "include",
    });

    if (!response.ok) throw Error("비정상 동작");

    const data = await response.json();

    return data;
  } catch (e) {
    console.error(e);
  }
  return false;
};
