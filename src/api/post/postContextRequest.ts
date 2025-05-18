export const postContextRequest = async ({
  boardId,
  formData,
}: {
  boardId: number;
  formData: FormData;
}) => {
  try {
    const response = await fetch(`/board/${boardId}/post/api`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) throw Error("비정상 동작");

    const data = await response.json();

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const patchContextRequest = async ({
  boardId,
  postId,
  formData,
}: {
  boardId: number;
  postId: number;
  formData: FormData;
}) => {
  try {
    const response = await fetch(
      `/board/${boardId}/post/api?postId=${postId}`,
      {
        method: "PATCH",
        body: formData,
        credentials: "include",
      }
    );
    if (!response.ok) throw Error("비정상 동작");
    const data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
