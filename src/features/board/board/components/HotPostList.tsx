"use client";

import { useEffect, useState } from "react";
import PostBox from "../../post/components/PostBox";
import { loadPostList } from "./HotPostUtils";
import PostBoxSkelleton from "../../post/components/PostBoxSkelleton";
import { Post } from "@/shared/types/post/type";


export default function HotPostList() {
  const [postList, setPostList] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postsData = await loadPostList();
        console.log(postsData, "in Page");
        if (postsData) setPostList((prev) => [...prev, ...postsData?.list]);
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
      {postList.length>0 ?
      postList.map((post) => (
        <PostBox post={post} key={post.postId} />
      )):
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-gray-500 text-lg">핫한 게시글이 없습니다.</div>
      </div>
      }
      {isLoading && <PostBoxSkelleton length={6} />}
    </div>
  );
}
