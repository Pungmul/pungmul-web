// src/app/(main)/friends/clientComponent.tsx
import React, { useCallback, useEffect, useState } from "react";
import FriendList from "@pThunder/component/friend/FriendList";
import FriendRequest from "@pThunder/component/friend/FriendRequestButton";
import FindFriends from "@pThunder/component/friend/FindFriendSection";
import { acceptFriendRequest, rejectFriendRequest } from "./utils";


interface Friend {
    friendRequestId: number;
    friendStatus: 'ACCEPTED' | 'PENDING';
    simpleUserDTO: SimpleUserDTO;
}

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

type FriendList = Friend[];

export default function ClientComponent({ initFriendList, initRquestedFriendsList }: { initFriendList: FriendList, initRquestedFriendsList: FriendList }) {
    const [myFreindsList, setFreindsList] = useState(initFriendList);
    const [myRequstedFreindsList, setRequstedFreindsList] = useState(initRquestedFriendsList);
    const [contentType, setContentType] = useState<'MyFriends' | 'FindFriends' | 'RequsetedFriends' | null>(null);

    const AcceptRequest = useCallback(async (friendRequestId: number, friendName: string) => {
        try {
            const response = await acceptFriendRequest(friendRequestId);
            if (!response) throw Error('친구 추가 실패');
            alert(`${friendName}님과 친구가 됐어요`);
            const newList = myRequstedFreindsList.filter(user => user.friendRequestId !== friendRequestId);
            setRequstedFreindsList(newList);
        } catch (e) {
            console.error(e);
            if (e instanceof Error) {
                alert(e.message);
            } else {
                alert("An unknown error occurred");
            }
        }
    }, [myRequstedFreindsList]);

    const RejectRequest = useCallback(async (friendRequestId: number, friendName: string) => {
        try {
            const response = await rejectFriendRequest(friendRequestId);
            if (!response) throw Error('거절 실패');
            alert(`${friendName}님의 요청을 거절했어요`);
            const newList = myRequstedFreindsList.filter(user => user.friendRequestId !== friendRequestId);
            setRequstedFreindsList(newList);
        } catch (e) {
            console.error(e);
            if (e instanceof Error) {
                alert(e.message);
            } else {
                alert("An unknown error occurred");
            }
        }
    }, [myRequstedFreindsList]);

    const renderContent = () => {
        switch (contentType) {
            case 'FindFriends':
                return <FindFriends myFriendList={myFreindsList} />;
            case 'MyFriends':
                return <FriendList friends={myFreindsList} onAccept={AcceptRequest} onReject={RejectRequest} />;
            case 'RequsetedFriends':
                return <FriendRequest requests={myRequstedFreindsList} onAccept={AcceptRequest} onReject={RejectRequest} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <button onClick={() => setContentType('MyFriends')}>내 친구</button>
            <button onClick={() => setContentType('RequsetedFriends')}>친구 요청</button>
            <button onClick={() => setContentType('FindFriends')}>친구 찾기</button>
            {renderContent()}
        </div>
    );
}