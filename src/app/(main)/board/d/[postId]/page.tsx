import { PostContentSkeleton, PostDetailComponent } from "@/features/post";
import { Header } from "@pThunder/shared";
import Suspense from "@pThunder/shared/components/SuspenseComponent";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "풍덩 | 게시글 상세",
};

export default async function Page({
  params,
}: {
  params: Promise<{ postId?: string | number }>;
}) {
  const { postId } = await params;

  if (!postId) {
    return notFound();
  }

  return (
    <div className="relative w-full h-full flex-grow bg-grey-100">
      <Suspense
        clientOnly
        fallback={
          <div className="w-full h-full bg-grey-100 max-w-[768px] mx-auto">
            <Header title="" isBackBtn={false} />
            <PostContentSkeleton />
          </div>
        }
      >
        <PostDetailComponent
          postId={Number(postId)}
        />
      </Suspense>
    </div>
  );
}
