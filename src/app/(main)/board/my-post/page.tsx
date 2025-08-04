"use client";

import { AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";
import { Header } from "@/shared/components";
import { PostDetailOverlay, PostDetailModal } from "@/features/post";
import { MyPostList } from "@/features/board";
import { Responsive } from "@/shared/components/Responsive";
import { Suspense } from "react";
import { Spinner } from "@/shared/components/ui/Spinner";

export default function MyPostPage() {
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
      <Suspense fallback={<Spinner/>}>
        <Responsive
          mobile={<PostDetailOverlay boardName={"내가 작성한 글"} />}
          desktop={<PostDetailModal />}
        />
      </Suspense>
    </AnimatePresence>
  );
}
