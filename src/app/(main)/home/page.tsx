import { fetchHotPostList } from "@pThunder/features/home/components/fetchHotPostList";
import HomePageContent from "@/features/board/board/components/HomePageContent";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const hotPosts = await fetchHotPostList();
  const timeString = dayjs().format("YYYY.MM.DD HH:mm");

  return (
    <div className="relative w-full flex flex-col flex-grow overflow-y-auto max-w-[100dvw] min-w-[360px]">
      <HomePageContent hotPosts={hotPosts} timeString={timeString} />
    </div>
  );
}
