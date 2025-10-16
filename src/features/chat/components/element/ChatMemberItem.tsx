import Image from "next/image";
import { User } from "@/features/member/types";

interface ChatMemberItemProps {
  user: User;
  isCurrentUser: boolean;
}

export const ChatMemberItem = ({
  user,
  isCurrentUser,
}: ChatMemberItemProps) => {
  return (
    <div className="flex flex-row items-center gap-[12px] py-[8px] px-[16px] hover:bg-grey-200 cursor-pointer w-full">
      {user.profileImage?.fullFilePath ? (
        <Image
          src={user.profileImage.fullFilePath}
          alt={user.username}
          width={36}
          height={36}
          className="rounded-full object-cover overflow-hidden size-[36px]"
        />
      ) : (
        <div className="size-[36px] bg-gray-300 rounded-full" />
      )}
      {isCurrentUser && (
        <div className="rounded-full bg-gray-500 size-[16px] flex items-center justify-center">
          <span className="text-[11px] font-medium text-white leading-none">
            나
          </span>
        </div>
      )}
      <div className="text-md font-medium">{user.name}</div>
    </div>
  );
};
