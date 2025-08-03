import { NearLightning } from "@/features/lightning/components";
import HomeHotPostList from "./HomeHotPostList";
import { Post } from "@/shared/types/post/type";
import { HomeHeader } from "@/features/board/components";
import { FrequentBoards } from "@/features/board/components";
import Suspense from "@pThunder/shared/components/SuspenseComponent";
import { SkeletonView } from "@pThunder/shared";
import React from "react";

interface HomePageContentProps {
  hotPosts: Post[];
  timeString: string;
}

export default function HomePageContent({
  hotPosts,
  timeString,
}: HomePageContentProps) {
  return (
    <div className="flex flex-col flex-grow md:max-w-[768px] md:mx-auto">
      <div className="flex flex-col gap-[12px] py-[24px]">
        <Suspense
          fallback={
            <div className="flex flex-row justify-between items-end px-[24px]">
              <SkeletonView className="w-[240px] h-[28px] rounded-[8px] md:rounded-[4px]" />
            </div>
          }
        >
          <HomeHeader />
        </Suspense>
        <FrequentBoards />
      </div>
      <div
        className="relative w-full h-full flex-grow flex flex-col overflow-y-auto gap-[32px]"
        style={{ scrollbarWidth: "thin" }}
      >
        <NearLightning />
        <HomeHotPostList hotPosts={hotPosts} timeString={timeString} />
        {/* <PromotionList /> */}
      </div>
    </div>
  );
}
