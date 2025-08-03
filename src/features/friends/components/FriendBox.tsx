
import Image from "next/image";
import { User } from "@pThunder/features/member";

interface FriendBoxProps {
  friend: User;
  onSelect?: (friendId: number) => void;
}

export default function FriendBox({ friend, onSelect }: FriendBoxProps) {
  return (
    <div
      key={friend.userId}
      className="hover:bg-gray-100 flex h-16 py-2 px-2 flex-row items-center gap-4"
      onClick={() => onSelect?.(friend.userId)}
    >
      <div className="w-12 h-12 bg-slate-200 overflow-hidden relative rounded-[8px]">
        <Image
          src={friend.profileImage.fullFilePath}
          alt={friend.profileImage.originalFilename}
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-grow flex-col gap-1 justify-center">
        <div className="text-base font-semibold">
          {friend.name}
        </div>
        <div className="text-xs text-gray-300">
          {friend.username}
        </div>
      </div>
      {/* {friendStatus === "PENDING" && (
        <FriendAcceptButton friend={friend} />
      )} */}
    </div>
  );
}
