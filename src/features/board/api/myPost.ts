import { useQuery } from "@tanstack/react-query";
import { MyPostResponse } from "../../post/model/index";

const fetchMyPostList = async (): Promise<MyPostResponse> => {
  const response = await fetch(`/board/my-post/api`);
  const data = await response.json();
  return data;
};

const useMyPostList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["myPostList"],
    queryFn: fetchMyPostList,
  });
  return { data, isLoading };
};

export { useMyPostList };