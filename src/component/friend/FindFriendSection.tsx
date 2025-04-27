// src/app/(main)/friends/FindFriends.tsx
import React, { useCallback, useState } from 'react';
import { findFriends } from './utils'; // 친구 찾기 API를 가져옵니다.
import { debounce } from 'lodash';


interface SimpleUserDTO {
    userId: number;
    username: string;
    name: string;
    profileImage: ProfileImage;
}


interface ProfileImage {
    id: number;
    originalFilename: string;
    convertedFileName: string;
    fullFilePath: string;
    fileType: string; // 예: "image/jpeg"
    fileSize: number;  // 바이트 단위 크기
    createdAt: string; // ISO 형식의 날짜 및 시간
}

interface Friend {
    friendRequestId: number;
    friendStatus: 'ACCEPTED' | 'PENDING';
    simpleUserDTO: SimpleUserDTO;
}

type FriendList = Friend[];

const FindFriends: React.FC<{ myFriendList: FriendList }> = ({ myFriendList }) => {
    const [keyword, setKeyword] = useState('');
    const [searchedList, setList] = useState<SimpleUserDTO[]>([]);

    const FindFriends = useCallback(debounce(async (keyword: string) => {
        try {
            const loadedUsers = await findFriends(keyword);
            setList(loadedUsers);
        } catch (e) {
            console.error(e);
        }
    }, 300), []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
        FindFriends(e.target.value);
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
                {searchedList.length > 0 ? (
                    searchedList.map(user => (
                        <div key={user.userId} className="hover:bg-gray-100 flex h-16 py-1 px-2 flex-row items-center gap-4">
                            <div className="w-12 h-full bg-slate-200">
                                <img
                                    src={user.profileImage.fullFilePath}
                                    alt={user.profileImage.originalFilename}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="flex flex-grow flex-col gap-1 justify-center">
                                <div className="text-base font-semibold">{user.name}</div>
                                <div className="text-xs text-gray-300">{user.username}</div>
                            </div>
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