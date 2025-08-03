"use client";
import { useState } from "react";
import { friendStore } from "@/store/friend/useFriends";
import { FriendBox } from "@/features/friends";
import { Modal, Spinner } from "@/shared/components";
import { useFindFriends } from "@pThunder/features/friends/api/api";
import { Friend } from "@pThunder/shared";

const SelectFriendsModal = ({
  onConfirm,
  isOpen,
  onClose,
}: {
  onConfirm: (friendEmails: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const setSearchKeyword = friendStore((state) => state.setSearchKeyword);
  const searchKeyword = friendStore((state) => state.friendsFilter.keyword);
  const { data: friends } = useFindFriends();

  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);

  const handleSelect = (friendId: number) => {
    if (selectedFriends.some((friend) => friend.simpleUserDTO.userId === friendId)) {
      setSelectedFriends((prev) =>
        prev.filter((friend) => friend.simpleUserDTO.userId !== friendId)
      );
    } else {
      setSelectedFriends((prev) => [
        ...prev,
        friends?.find(
          (friend) => friend.simpleUserDTO.userId === friendId
        ) as Friend,
      ]);
    }
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  console.log(friends, "friends");
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
            value={searchKeyword}
            onChange={onChangeSearch}
            className="w-full rounded-md outline-none"
          />
        </div>

        <div className="flex flex-col flex-grow overflow-y-auto">
          {friends?friends.map((friend) => (
            <div
              key={friend.simpleUserDTO.userId}
              className={`cursor-pointer ${
                selectedFriends.includes(friend) ? "bg-gray-100" : ""
              }`}
            >
              <FriendBox
                key={friend.simpleUserDTO.userId}
                friend={friend.simpleUserDTO}
                onSelect={handleSelect}
              />
            </div>
          )):(
            <div className="flex flex-col flex-grow justify-center items-center">
              <Spinner />
            </div>
          )}
        </div>
        {selectedFriends.length > 0 && (
          <div className="px-4 bg-white">
            <div
              className="bg-blue-500 text-white py-2  text-center rounded-md"
              onClick={() => {
                onConfirm(
                  selectedFriends.map((friend) => friend.simpleUserDTO.username)
                );
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
