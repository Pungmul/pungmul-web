import { getQueryClient } from "@/shared/lib/getQueryClient";
import {
  BoardHeader,
  fetchBoardInformations,
} from "@pThunder/features/board";
import { fetchMyPostList } from "@pThunder/features/board/api/myPost";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Suspense from "@/shared/components/SuspenseComponent";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function MyPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["boardList"],
    queryFn: () => fetchBoardInformations(),
  });

  queryClient.prefetchQuery({
    queryKey: ["board", "my-post"],
    queryFn: () => fetchMyPostList(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex flex-col w-full h-full">
      <HydrationBoundary state={dehydratedState}>
        <div className="z-20 sticky top-0">
          <BoardHeader boardName={"내가 작성한 게시글"} />
        </div>
        <div className="flex flex-col w-full flex-grow relative items-center">
          <Suspense>
            <div className="w-full max-w-[768px]">{children}</div>
          </Suspense>
        </div>
        <div className="z-30" id="post-detail-section" />
        <div className="z-40" id="posting-section" />
      </HydrationBoundary>
    </div>
  );
}
