// src/app/(main)/friends/FindFriends.tsx
import React, { useState } from "react";
import { useFindFriends } from "@pThunder/features/friends/api/api"; // 친구 찾기 API를 가져옵니다.
import { friendStore } from "@pThunder/store/friend/useFriends";
import Image from "next/image";

const FindFriends: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const setSearchKeyword = friendStore((state) => state.setSearchKeyword);

  const { data: searchedUserList = [] } = useFindFriends();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    setSearchKeyword(value);
  };

  return (
    <section>
      <label className="w-72 my-1 py-1 px-4 bg-gray-200 flex flex-row items-center">
        <input
          type="text"
          placeholder="친구를 검색하세요"
          className="bg-transparent outline-none"
          value={keyword}
          onChange={handleChange}
        />
      </label>
      <div className="w-full h-96 mt-2 overflow-y-scroll">
        {searchedUserList.length > 0 ? (
          searchedUserList.map((friendStatus) => (
            <div
              key={friendStatus.simpleUserDTO.userId}
              className="hover:bg-gray-100 flex h-16 py-1 px-2 flex-row items-center gap-4"
            >
              <div className="w-12 h-full bg-slate-200">
                <Image
                  src={friendStatus.simpleUserDTO.profileImage.fullFilePath}
                  fill
                  alt={friendStatus.simpleUserDTO.profileImage.originalFilename}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-grow flex-col gap-1 justify-center">
                <div className="text-base font-semibold">{friendStatus.simpleUserDTO.name}</div>
                <div className="text-xs text-gray-300">{friendStatus.simpleUserDTO.username}</div>
              </div>
              <div className="text-xs text-gray-300">{friendStatus.friendStatus}</div>
            </div>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </section>
  );
};

export default FindFriends;
