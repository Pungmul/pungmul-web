export const postQueryKeys = {
  all: ["post"] as const,
  list: (boardId?: number | null) =>
    boardId !== undefined && boardId !== null
      ? [...postQueryKeys.all, "list", boardId] as const
      : [...postQueryKeys.all, "list"] as const,
  detail: (postId?: number | null) =>
    postId !== undefined && postId !== null
      ? [...postQueryKeys.all, "detail", postId] as const
      : [...postQueryKeys.all, "detail"] as const,
  like: (postId: number) => [...postQueryKeys.all, "like", postId] as const,
};

