import { useSuspenseQuery } from "@tanstack/react-query";
import { Post } from "@/shared/types/post/type";

interface HotPostListResponse {
  total: number;
  list: Post[];
  pageNum: number;
  pageSize: number;
}

export const fetchHotPostList = async (): Promise<HotPostListResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/boards/hot-post`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to fetch hot post list");

  return response.json();
};

export const useHotPostList = () => {
  return useSuspenseQuery({ queryKey: ["hotPostList"], queryFn: fetchHotPostList });
};
