import { 
  NotificationIcon
} from "@/features/notification/components";
import { 
  MyPageIcon,
  // PromotionList 
} from "@/shared/components";
import { NearLightning } from "@/features/lightning/components";
import HomeHotPostList from "./HomeHotPostList";
import { Post } from "@/shared/types/post/type";

interface HomePageContentProps {
  hotPosts: Post[];
  timeString: string;
}

export default function HomePageContent({ hotPosts, timeString }: HomePageContentProps) {
  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <div
        className="relative w-full h-full flex-grow flex flex-col overflow-y-auto"
        style={{ scrollbarWidth: "thin", gap: 24 }}
      >
        <div
          className="flex flex-row justify-end"
          style={{
            paddingTop: 36,
            paddingBottom: 4,
            paddingLeft: 24,
            paddingRight: 24,
            gap: 8,
          }}
        >
          <NotificationIcon />
          <MyPageIcon />
        </div>
        <NearLightning />
        <HomeHotPostList hotPosts={hotPosts} timeString={timeString} />
        {/* <PromotionList /> */}
      </div>
    </div>
  );
} 