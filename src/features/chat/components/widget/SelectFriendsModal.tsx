"use client";
import { useCallback, useState } from "react";
import { friendStore } from "@pThunder/features/friends/store";
import { FriendBox } from "@/features/friends";
import { Button, Modal, SearchInput, Spinner } from "@/shared/components";
import { useLoadMyFriends } from "@pThunder/features/friends/queries";
import { Friend } from "@pThunder/features/friends";
import Link from "next/link";

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
  const { data: friends } = useLoadMyFriends();

  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);

  const handleSelect = (friendId: number) => {
    if (
      selectedFriends.some(
        (friend: Friend) => friend.simpleUserDTO.userId === friendId
      )
    ) {
      setSelectedFriends((prev) =>
        prev.filter(
          (friend: Friend) => friend.simpleUserDTO.userId !== friendId
        )
      );
    } else {
      setSelectedFriends((prev) => [
        ...prev,
        friends!.acceptedFriendList.find(
          (friend: Friend) => friend.simpleUserDTO.userId === friendId
        )!,
      ]);
    }
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleClose = useCallback(() => {
    onClose();
    setSelectedFriends([]);
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="대화상대 선택"
      style={{ height: "80dvh" }}
    >
      <div className="flex flex-col gap-[16px] w-full h-full">
        <div className="w-full p-1">
          <SearchInput
            placeholder="친구를 검색하세요"
            value={searchKeyword}
            onChange={onChangeSearch}
            onClose={() => setSearchKeyword("")}
          />
        </div>

        <div className="flex flex-col flex-grow overflow-y-auto">
          {friends ? (
            friends.acceptedFriendList.map((friend: Friend) => (
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
            ))
          ) : (
            <div className="flex flex-col flex-grow justify-center items-center">
              <Spinner />
            </div>
          )}
        </div>
        {selectedFriends.length > 0 && (
          <div className="px-4 bg-white">
            <Button
              type="button"
              className="bg-blue-500"
              onClick={(e) => {
                e.preventDefault();
                onConfirm(
                  selectedFriends.map((friend) => friend.simpleUserDTO.username)
                );
                handleClose();
              }}
            >
              완료
            </Button>
          </div>
        )}
        <Link href="/my-page/friends" className="px-2">
          <u className="text-grey-500 text-sm">친구를 새롭게 추가하시나요?</u>
        </Link>
      </div>
    </Modal>
  );
};

export default SelectFriendsModal;
