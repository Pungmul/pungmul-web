import { useEffect, useState } from "react";
import { useFriends } from "@/store/friend/useFriends";
import { Friend } from "@/shared/types/friend/type";
import { hangulPositionStrictMatch } from "@/shared/lib/splitHangeul";
import { FriendBox } from "@/features/friends/components";
import { Modal } from "@/shared/components";

const SelectFriendsModal = ({
  onConfirm,
  isOpen,
  onClose,
}: {
  onConfirm: (friendEmails: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { friends, fetchFriends } = useFriends();

  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const handleSelect = (friendEmail: string) => {
    if (selectedFriends.includes(friendEmail)) {
      setSelectedFriends((prev) =>
        prev.filter((email) => email !== friendEmail)
      );
    } else {
      setSelectedFriends((prev) => [...prev, friendEmail]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
      setSelectedFriends([]);
      setSearch("");
    }
  }, [isOpen, fetchFriends, setSelectedFriends, setSearch]);

  useEffect(() => {
    setFilteredFriends(
      friends.filter((friend) => {
        return (
          hangulPositionStrictMatch(search, friend.simpleUserDTO.name) ||
          hangulPositionStrictMatch(search, friend.simpleUserDTO.username)
          // || friend.simpleUserDTO.name.includes(search)
          // || friend.simpleUserDTO.username.includes(search)
        );
      })
    );
  }, [search, friends]);

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="대화상대 선택"
      style={{ height: "80dvh" }}
    >
      <div className="flex flex-col gap-[16px] w-full h-full">
        <div className="flex flex-row gap-[8px] items-center border border-gray-300 px-[8px] py-[8px] w-full relative rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#DDD"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          <input
            type="text"
            value={search}
            onChange={onChangeSearch}
            className="w-full rounded-md outline-none"
          />
        </div>

        <div className="flex flex-col flex-grow overflow-y-auto">
          {filteredFriends.map((friend) => (
            <div
              key={friend.friendRequestId}
              className={`cursor-pointer ${
                selectedFriends.includes(friend.simpleUserDTO.username)
                  ? "bg-gray-100"
                  : ""
              }`}
            >
              <FriendBox
                key={friend.friendRequestId}
                friend={friend}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </div>
        {selectedFriends.length > 0 && (
          <div className="px-4 bg-white">
            <div
              className="bg-blue-500 text-white py-2  text-center rounded-md"
              onClick={() => {
                onConfirm(selectedFriends);
                onClose();
              }}
            >
              완료
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SelectFriendsModal;