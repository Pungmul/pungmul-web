import { getQueryClient } from "@pThunder/core";
import {
  BoardHeader,
  BoardListNav,
  loadBoardInfoList,
} from "@pThunder/features/board";
import { loadMyCommentList } from "@pThunder/features/board/api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "풍덩 | 내 댓글",
  description: "내가 작성한 댓글 목록 입니다.",
};

export const dynamic = "force-static";

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

  queryClient.prefetchInfiniteQuery({
    queryKey: ["board", "my-comment"],
    queryFn: ({ pageParam = 0 }) => loadMyCommentList(pageParam),
    initialPageParam: 0,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex flex-col w-full h-full">
      <HydrationBoundary state={dehydratedState}>
        <BoardHeader boardID={"my-comment"} />
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
