"use server"
import Image from "next/image";
import AddChatRoomButton from "./AddChatRoomButton";

export default async function InboxPage() {
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
