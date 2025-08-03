import Suspense from "@/shared/components/SuspenseComponent";
import RoomPageContent from "./RoomContent";

export default function RoomPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-w-[50dvw] flex-grow">로딩 중...</div>}>
      <RoomPageContent>{children}</RoomPageContent>
    </Suspense>
  );
}
