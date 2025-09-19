import { useSuspenseQuery } from "@tanstack/react-query";
import { MyPostResponse } from "@/shared/types/post/type";

const fetchMyPostList = async (): Promise<MyPostResponse> => {
  const response = await fetch(`/api/posts/me`, {
    credentials: "include",
  });
  const data = await response.json();
  return data;
};

const useMyPostList = () => {
  return useSuspenseQuery({
    queryKey: ["myPostList"],
    queryFn: fetchMyPostList,
  });
};

export { useMyPostList, fetchMyPostList };