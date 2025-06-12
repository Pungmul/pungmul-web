import { Friend } from "@/shared/types/friend/type";
import Image from "next/image";
import FriendAcceptButton from "./FriendAcceptButton";

interface FriendBoxProps {
  friend: Friend;
  onSelect?: (friendEmail: string) => void;
}

export default function FriendBox({ friend, onSelect }: FriendBoxProps) {
  return (
    <div
      key={friend.friendRequestId}
      className="hover:bg-gray-100 flex h-16 py-2 px-2 flex-row items-center gap-4"
      onClick={() => onSelect?.(friend.simpleUserDTO.username)}
    >
      <div className="w-12 h-12 bg-slate-200 overflow-hidden relative rounded-[8px]">
        <Image
          src={friend.simpleUserDTO.profileImage.fullFilePath}
          alt={friend.simpleUserDTO.profileImage.originalFilename}
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-grow flex-col gap-1 justify-center">
        <div className="text-base font-semibold">
          {friend.simpleUserDTO.name}
        </div>
        <div className="text-xs text-gray-300">
          {friend.simpleUserDTO.username}
        </div>
      </div>
      {friend.friendStatus === "PENDING" && (
        <FriendAcceptButton friend={friend} />
      )}
    </div>
  );
}
