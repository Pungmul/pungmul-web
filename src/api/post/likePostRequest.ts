export const likePostRequest = async (id: number) => {
  try {
    const response = await fetch(`${id}/like?postID=${id}`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw Error("비정상 동작");
    }

    const data = await response.json();
    if (id != data.postId) {
      throw Error("좋아요 업데이트 실패:잘못된 게시물");
    }

    return data;

  } catch (e) {
    throw Error("좋아요 업데이트 실패");
  }
};
