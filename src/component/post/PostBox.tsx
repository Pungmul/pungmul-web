import { WebViewLink } from "@pThunder/app/(main)/board/main/ResponsiveLink";
import { useRouter, useSearchParams } from "next/navigation";

interface RecentPost {
  postId: number;
  title: string;
  content: string;
  viewCount: number;
  likedNum: number;
  timeSincePosted: number;
  timeSincePostedText: string;
  author: string;
}

export default function PostBox({ post }: { post: RecentPost }) {
  const router = useRouter();

  return (
    <div
      key={post.postId}
      onClick={() => {
        const currentParams = new URLSearchParams(window.location.search); // 현재 URL 쿼리 그대로 가져오기
        currentParams.set("postId", String(post.postId)); // postId만 추가 또는 덮어쓰기

        router.push(`?${currentParams.toString()}`, {
          scroll: false,
        });
      }}
      style={{
        gap: 12,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 28,
        paddingRight: 28,
        borderTopWidth: 0.25,
        borderBottomWidth: 0.25,
        borderColor: "#E3E3E3",
      }}
      className={`w-full bg-white flex flex-col px-6 cursor-pointer`}
    >
      <div className="flex justify-between flex-col items-start">
        <div style={{ fontSize: 14 }} className="w-full truncate">
          {post.title}
        </div>
        <div
          style={{ fontSize: 12 }}
          className="text-gray-300 max-w-24 truncate"
        >
          {post.author == "Anonymous" ? "익명" : post.author}
        </div>
      </div>
      <div style={{ fontSize: 12 }} className="text-gray-400 w-full truncate">
        {post.content}
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <div className="flex flex-row items-center gap-1">
            <div style={{ width: 12, height: 12 }} className=" bg-red-200" />
            <div style={{ fontSize: 11 }} className="text-red-200">
              {post.likedNum}
            </div>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div style={{ width: 12, height: 12 }} className=" bg-gray-200" />
            <div style={{ fontSize: 11 }}>{post.viewCount}</div>
          </div>
        </div>
        <div className="flex flex-row gap-2  items-end">
          <div className="flex flex-row gap-1 items-center">
            <div className="text-gray-400 text-xs">
              {post.timeSincePostedText === "0분 전"
                ? "방금"
                : post.timeSincePostedText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
