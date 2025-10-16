import { User } from "@/features/member/types";
import { ChatInviteButton } from "./ChatInviteButton";
import { ChatMemberItem } from "./ChatMemberItem";

interface ChatMemberListProps {
  userList: User[];
  currentUsername?: string;
  onInviteUser: () => void;
}

export const ChatMemberList = ({
  userList,
  currentUsername,
  onInviteUser,
}: ChatMemberListProps) => {
  return (
    <section className="flex flex-col m-[12px] bg-grey-100 rounded-[12px] py-[12px]">
      <h3 className="text-[14px] font-medium px-[16px] py-[8px]">멤버</h3>
      <ul className="flex flex-col">
        <li>
          <ChatInviteButton onClick={onInviteUser} />
        </li>
        {userList.map((user) => (
          <li key={user.username}>
          <ChatMemberItem
            user={user}
            isCurrentUser={currentUsername === user.username}
          />
          </li>
        ))}
      </ul>
    </section>
  );
};

