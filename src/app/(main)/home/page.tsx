import { fetchHotPostList } from "@/features/home";
import dayjs from "dayjs";

import { NearLightning } from "@/features/lightning/components";
import { HomeHeader, FrequentBoards, HomeHotPostList } from "@/features/board";
import Suspense from "@pThunder/shared/components/SuspenseComponent";
import { SkeletonView } from "@pThunder/shared";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const hotPosts = await fetchHotPostList();
  const timeString = dayjs().format("YYYY.MM.DD HH:mm");

  return (
    <div className="relative w-full flex flex-col flex-grow overflow-y-auto max-w-[100dvw] min-w-[360px]">
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
    </div>
  );
}
