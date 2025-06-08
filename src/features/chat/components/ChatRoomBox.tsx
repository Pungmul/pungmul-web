"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatRelativeDate } from "@/shared/lib/parseDateString";
import { SkeletonView } from "@/shared/components";

interface ChatRoomDto {
  chatRoomUUID: string;
  lastMessageTime: string | null;
  lastMessageContent: string | null;
  unreadCount: number | null;
  senderId: number | null;
  senderName: string | null;
  receiverId: number | null;
  receiverName: string | null;
  chatRoomMemberIds: number[];
  chatRoomMemberNames: string[];
  roomName: string;
  profileImageUrl: string | null;
  group: boolean;
}

const ChatRoomBox = ({ room }: { room: ChatRoomDto }) => {
  const router = useRouter();

  return (
    <div
      className="flex flex-row items-center cursor-pointer bg-white hover:bg-[#F5F5F5] "
      style={{
        paddingLeft: 28,
        paddingRight: 28,
        gap: 12,
        paddingTop: 12,
        paddingBottom: 12,
      }}
      onClick={() => router.push(`/chats/r/${room.chatRoomUUID}`)}
    >
      <div
        className="flex-shrink-0 w-[64px] 
        aspect-square 
        md:min-w-[96px] 
        md:w-full
        lg:w-[48px] 
        lg:h-[48px] 
        lg:min-w-[48px]"
        style={{
          borderRadius: 5,
          backgroundColor: "#D9D9D9",
        }}
      >
        {/* 여기 이미지 삽입 */}
        {room.profileImageUrl && (
          <Image
            src={room.profileImageUrl}
            alt=""
            fill
            style={{ objectFit: "cover", borderRadius: 5 }}
          />
        )}
      </div>
      <div className="md:hidden lg:flex flex-col flex-grow" style={{ gap: 4 }}>
        <div
          className="flex flex-row items-start justify-between"
          style={{ lineHeight: "125%" }}
        >
          <div style={{ fontSize: 13, fontWeight: 600 }}>{room.roomName}</div>
          <div style={{ fontSize: 11 }}>
            {room.lastMessageTime ? (
              formatRelativeDate(new Date(room.lastMessageTime))
            ) : (
              <div style={{ color: "#816DFF" }}>신규</div>
            )}
          </div>
        </div>
        <div className="flex-grow flex flex-row items-start justify-center">
          <div
            className="flex-grow text-ellipsis overflow-hidden"
            style={{
              whiteSpace: "pre-line",
              fontSize: 13,
              lineHeight: "125%",
              color: "#AEADAD",
            }}
          >
            {room.lastMessageContent}
          </div>
          {room.unreadCount && room.unreadCount > 0 && (
            <div
              className="flex rounded-full items-center justify-center"
              style={{
                width: 20,
                height: 20,
                backgroundColor: "#816DFF",
                fontSize: 11,
                color: "#FFF",
                lineHeight: "100%",
              }}
            >
              {room.unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatRoomBoxSkeleton = () => {
  return (
    <div
      className="flex flex-row items-center cursor-pointer bg-white hover:bg-[#F5F5F5] "
      style={{
        paddingLeft: 28,
        paddingRight: 28,
        gap: 12,
        paddingTop: 12,
        paddingBottom: 12,
      }}
    >
      <div
        className="flex-shrink-0 w-[64px] aspect-square md:min-w-[96px] md:w-full lg:w-[48px] lg:h-[48px] lg:min-w-[48px]"
      >
        <SkeletonView className="w-full h-full" style={{ backgroundColor: "#D9D9D9", borderRadius: 5 }} />
      </div>
      <div className="flex-grow flex flex-col gap-2">
        <div className="flex-grow flex flex-row items-start justify-center h-[16px]">
          <SkeletonView className="w-full h-full" style={{ backgroundColor: "#D9D9D9", borderRadius: 5 }} />
        </div>
        <div className="flex-grow flex flex-row items-start justify-center h-[16px]">
          <SkeletonView className="w-full h-full" style={{ backgroundColor: "#D9D9D9", borderRadius: 5 }} />
        </div>
      </div>
    </div>
  );
};

export { ChatRoomBox, ChatRoomBoxSkeleton };