import { Friend } from "@/shared/types/friend/type";
import { useAcceptFriendMutation } from "../../api/api";
import { Toast } from "@pThunder/store/share/toastStore";

export default function FriendAcceptButton({ friend }: { friend: Friend }) {
  console.log(friend, "friend");
  const { mutate: acceptFriend } = useAcceptFriendMutation();

  const handleAccept = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log(friend.friendRequestId, "friend.friendRequestId");
    acceptFriend(friend.friendRequestId, {
      onSuccess: () => {
        Toast.show({ message: "친구 수락 완료", type: "success" });
      },
      onError: () => {
        alert("친구 수락 실패");
      },
    });
  };

  return (
    <button
      className="text-xs items-center justify-center flex p-0.5 border border-blue-400 rounded-sm text-blue-600 hover:bg-blue-400 hover:text-white cursor-pointer"
      onClick={handleAccept}
    >
      수락
    </button>
  );
}
