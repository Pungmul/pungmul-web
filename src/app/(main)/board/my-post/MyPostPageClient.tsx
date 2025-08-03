"use client";

import { AnimatePresence } from "framer-motion";

import { Header } from "@/shared/components";
import PostDetailOverlay from "@/features/board/post/components/PostDetailOverlay";
import { useRouter } from "next/navigation";
import MyPostList from "./PostList";
import { Responsive } from "@/shared/components/Responsive";
import PostDetailModal from "@/features/board/post/components/PostDetailModal";

export default function MyPostPageClient() {
  const router = useRouter();

  return (
    <AnimatePresence mode="sync">
      <section
        key="my-post-section"
        className={"relative h-full flex flex-col w-full bg-white"}
      >
        <Header
          title={"내가 작성한 글"}
          onLeftClick={() => {
            router.replace("/board/main", { scroll: false });
          }}
          rightBtn={null}
        />

        <MyPostList />
      </section>
      <Responsive
        mobile={<PostDetailOverlay boardName={"내가 작성한 글"} />}
        desktop={<PostDetailModal />}
      />
    </AnimatePresence>
  );
} 