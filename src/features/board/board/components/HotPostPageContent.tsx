'use client';

import { AnimatePresence } from "framer-motion";
import PostDetailOverlay from "../../post/components/PostDetailOverlay";
import HotPostList from "./HotPostList";
import { Header } from "@/shared/components";

export default function HotPostPageContent() {
  return (
    <AnimatePresence mode="wait">
      <div className="relative h-full flex flex-col">
        <Header title={"핫게시판"} />
        <HotPostList />
      </div>
      <PostDetailOverlay boardName={"핫 게시글"} />
    </AnimatePresence>
  );
} 