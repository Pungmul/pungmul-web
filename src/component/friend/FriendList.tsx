// src/app/(main)/friends/FriendList.tsx
import React from 'react';
import Image from 'next/image';

interface Friend {
    friendRequestId: number;
    friendStatus: 'ACCEPTED' | 'PENDING';
    simpleUserDTO: User;
}

interface User {
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


interface FriendListProps {
    friends: Friend[];
    onAccept: (friendRequestId: number, friendName: string) => void;
    onReject: (friendRequestId: number, friendName: string) => void;
}

const FriendList: React.FC<FriendListProps> = ({ friends, onAccept, onReject }) => {
    return (
        <div className="w-80">
            {friends.length > 0 ? friends.map(friend => (
                <div key={friend.friendRequestId} className="hover:bg-gray-100 flex h-16 py-1 px-2 flex-row items-center gap-4">
                    <div className="w-12 h-full bg-slate-200">
                        <Image
                            fill
                            src={friend.simpleUserDTO.profileImage.fullFilePath}
                            alt={friend.simpleUserDTO.profileImage.originalFilename}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="flex flex-grow flex-col gap-1 justify-center">
                        <div className="text-base font-semibold">{friend.simpleUserDTO.name}</div>
                        <div className="text-xs text-gray-300">{friend.simpleUserDTO.username}</div>
                    </div>
                    <div className="text-xs items-center justify-center flex p-0.5 border border-blue-400 rounded-sm text-blue-600 hover:bg-blue-400 hover:text-white cursor-pointer"
                        onClick={() => onAccept(friend.friendRequestId, friend.simpleUserDTO.name)}>
                        수락
                    </div>
                    <div className="text-xs items-center justify-center flex p-0.5 border border-red-400 rounded-sm text-red-600 hover:bg-red-400 hover:text-white cursor-pointer"
                        onClick={() => onReject(friend.friendRequestId, friend.simpleUserDTO.name)}>
                        거절
                    </div>
                </div>
            )) : (
                <div className="self-center">친구가 없습니다ㅠㅠ</div>
            )}
        </div>
    );
};

export default FriendList;