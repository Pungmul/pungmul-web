"use server";
import { PostWithCategoryName } from "@pThunder/features/post";
import { cookies } from "next/headers";

interface HotPostListResponse {
  total: number;
  list: PostWithCategoryName[];
  pageNum: number;
  pageSize: number;
}

export const prefetchHotPostList = async (): Promise<HotPostListResponse> => {

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/boards/hot-post`,
    {
      headers: {
        Cookie: cookieHeader,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch hot post list");

  return response.json();
};
