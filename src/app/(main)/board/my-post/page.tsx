"use client";
import { AnimatePresence } from "framer-motion";
import PostDetailOverlay from "../[boardID]/PostDetailOverlay";
import MyPostList from "./PostList";
import { Header } from "@pThunder/component/shared/Header";

export default function MyPostsPage({
  searchParams,
}: Readonly<{ searchParams?: { postId?: string } }>) {
  const { postId } = searchParams || {};

  return (
    <AnimatePresence mode="wait">
      <div className="relative h-full flex flex-col">
        <Header title={"내가 작성한 글"} />
        <MyPostList />
      </div>
      <PostDetailOverlay boardName={"내가 작성한 글"} postId={postId} />
    </AnimatePresence>
  );
}
