"use client";

import { useEffect, useState } from "react";
import PostBox from "@pThunder/component/post/PostBox";
import { loadPostList } from "./utils";
import PostBoxSkelleton from "@pThunder/component/post/PostBoxSkelleton";

interface RecentPost {
  postId: number;
  title: string;
  content: string;
  viewCount: number;
  likedNum: number;
  categoryId: number;
  timeSincePosted: number;
  timeSincePostedText: string;
  author: string;
}

interface UserPosts {
  total: number;
  list: RecentPost[];
  pageNum: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export default function MyPostList() {
  const [postList, setPostList] = useState<RecentPost[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const boardData = await loadPostList();
        console.log(boardData, "in Page");
        if (boardData) setPostList((prev) => [...prev, ...boardData?.list]);
      } catch {
        alert("오류 발생");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      {postList.map((post) => (
        <PostBox post={post} />
      ))}
      {isLoading && <PostBoxSkelleton length={6} />}
    </div>
  );
}
