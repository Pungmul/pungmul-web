import { MyPostResponse } from "@pThunder/features/post";

export const loadMyPostList = async (): Promise<MyPostResponse> => {
  const response = await fetch(`/api/posts/me`, {
    credentials: "include",
  });
  const data = await response.json();
  return data;
};
