import { getQueryClient } from "@pThunder/core";
import {
  BoardHeader,
  BoardListNav,
  loadBoardInfoList,
  loadMyPostList,
} from "@pThunder/features/board";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "풍덩 | 내 게시글",
  description: "내가 작성한 게시글 목록 입니다.",
};
export default async function MyPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["boardList"],
    queryFn: () => loadBoardInfoList(),
  });

  queryClient.prefetchQuery({
    queryKey: ["board", "my-post"],
    queryFn: () => loadMyPostList(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex flex-col w-full h-full">
      <HydrationBoundary state={dehydratedState}>
        <BoardHeader boardID={"my-post"} />

        <div className="flex flex-col w-full flex-grow relative items-center">
          <div className="flex flex-row justify-center w-full h-full">
            <BoardListNav />
            <div className="w-full max-w-[768px]">{children}</div>
          </div>
        </div>
      </HydrationBoundary>
    </div>
  );
}
