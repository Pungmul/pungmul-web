import { PostWithCategoryName } from "@pThunder/features/post";

interface HotPostListResponse {
  total: number;
  list: PostWithCategoryName[];
  pageNum: number;
  pageSize: number;
}

export const loadHotPostList = async (): Promise<HotPostListResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/boards/hot-post`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Failed to fetch hot post list");

  return response.json();
};
