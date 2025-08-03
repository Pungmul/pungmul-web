import Image from "next/image";
import { Suspense } from "react";
import AddChatRoomButton from "./AddChatRoomButton";

// 동적 렌더링 강제 - 프리렌더 에러 해결
export const dynamic = 'force-dynamic';

// useSearchParams를 사용하는 컴포넌트를 Suspense로 감싸기
function InboxContent() {
  return (
    <div className="flex flex-col flex-grow h-full w-full justify-center items-center">
      <div className="flex flex-col items-center gap-[24px]">
        <Image
          src={"/icons/Chat-icon-outline.svg"}
          height={64}
          width={64}
          color={"#EEE"}
          alt=""
        />
        <div className="text-[24px] font-semibold text-black">
          채팅을 선택해서 대화를 시작해보세요
        </div>
        <AddChatRoomButton />
      </div>
    </div>
  );
}

export default async function InboxPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col flex-grow h-full w-full justify-center items-center">
        <div className="text-[24px] font-semibold text-black">
          로딩 중...
        </div>
      </div>
    }>
      <InboxContent />
    </Suspense>
  );
}
