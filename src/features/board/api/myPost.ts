import { useSuspenseQuery } from "@tanstack/react-query";
import { MyPostResponse } from "../../post/model/index";

const fetchMyPostList = async (): Promise<MyPostResponse> => {
  const response = await fetch(`/board/my-post/api`, {
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