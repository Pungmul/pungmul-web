'use client'
import { useCallback, useEffect, useState } from "react";
import { acceptFriendRequest, findFriends, rejectFriendRequest, requestFriend } from "./utils";
import { debounce } from 'lodash';

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

    console.log(initFriendList, initRquestedFriendsList)
    const [myFreindsList, setFreindsList] = useState<FriendList>(initFriendList);
    const [myRequstedFreindsList, setRequstedFreindsList] = useState<FriendList>(initRquestedFriendsList);
    const [modalVisible, setModalVisible] = useState(false);
    const [contentType, setContentType] = useState<'MyFriends' | 'FindFriends' | 'RequsetedFriends' | null>(null);



    const AcceptRequest = useCallback(debounce(async (friendRequestId: number, friendName: string) => {
        try {
            const response = await acceptFriendRequest(friendRequestId);
            if (!response) throw Error('친구 추가 실패')
            alert(`${friendName}님과 친구가 됐어요`);
            const newList = myRequstedFreindsList.filter(user => user.friendRequestId != friendRequestId) as FriendList;
            setRequstedFreindsList(newList)
        } catch (e: unknown) {
            console.error(e);
            if (e instanceof Error) {
                alert(e.message);
            } else {
                alert("An unknown error occurred");
            }
        }
    }, 300), [myRequstedFreindsList]);

    const RejectRequest = useCallback(debounce(async (friendRequestId: number, friendName: string) => {
        try {
            const response = await rejectFriendRequest(friendRequestId);
            if (!response) throw Error('거절 실패')
            alert(`${friendName}님의 요청을 거절했어요`);
            const newList = myRequstedFreindsList.filter(user => user.friendRequestId != friendRequestId)as FriendList;
            setRequstedFreindsList(newList)
        } catch (e: unknown) {
            console.error(e);
            if (e instanceof Error) {
                alert(e.message);
            } else {
                alert("An unknown error occurred");
            }
        }
    }, 300), [myRequstedFreindsList]);


    const modalContent = useCallback(() => {
        switch (contentType) {
            case 'FindFriends':
                return <FriendFindComponent myFriendList={myFreindsList} myRequstedList={myRequstedFreindsList} />;
            case 'MyFriends':
                return (
                    <div className="w-80">
                        {myFreindsList?.length > 0 ? myFreindsList?.map(Friend => {
                            return (
                                <div key={Friend.friendRequestId} className="hover:bg-gray-100 flex h-16 py-1 px-2 flex-row items-center gap-4">
                                    <div className="w-12 h-full bg-slate-200">
                                        <img
                                            src={Friend.simpleUserDTO.profileImage.fullFilePath}
                                            alt={Friend.simpleUserDTO.profileImage.originalFilename}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex flex-grow flex-col gap-1 justify-center">
                                        <div className="text-base font-semibold">
                                            {Friend.simpleUserDTO.name}
                                        </div>
                                        <div className="text-xs text-gray-300">
                                            {Friend.simpleUserDTO.username}
                                        </div>
                                    </div>
                                </div>
                            )
                        }) :
                            <div className="self-center">친구가 업습니다ㅠㅠ</div>
                        }
                    </div>
                );
            case 'RequsetedFriends':
                return (
                    <div className="w-80">
                        {myRequstedFreindsList?.length > 0 ? myRequstedFreindsList?.map(Friend => {
                            return (
                                <div key={Friend.friendRequestId} className="hover:bg-gray-100 flex h-16 py-1 px-2 flex-row items-center gap-4">
                                    <div className="w-12 h-full bg-slate-200">
                                        <img
                                            src={Friend.simpleUserDTO.profileImage.fullFilePath}
                                            alt={Friend.simpleUserDTO.profileImage.originalFilename}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex flex-grow flex-col gap-1 justify-center">
                                        <div className="text-base font-semibold">
                                            {Friend.simpleUserDTO.name}
                                        </div>
                                        <div className="text-xs text-gray-300">
                                            {Friend.simpleUserDTO.username}
                                        </div>
                                    </div>

                                    <div className=" text-xs items-center justify-center flex p-0.5 border border-blue-400 rounded-sm text-blue-600 hover:bg-blue-400 hover:text-white cursor-pointer"
                                        onClick={() => {
                                            AcceptRequest(Friend.friendRequestId, Friend.simpleUserDTO.name)
                                        }
                                        }>
                                        수락
                                    </div>
                                    <div className=" text-xs items-center justify-center flex p-0.5 border border-red-400 rounded-sm text-red-600 hover:bg-red-400 hover:text-white cursor-pointer"
                                        onClick={() => {
                                            RejectRequest(Friend.friendRequestId, Friend.simpleUserDTO.name)
                                        }
                                        }>
                                        거절
                                    </div>
                                </div>
                            )
                        }) :
                            <div className="self-center">친구 신청이 업습니다ㅠㅠ</div>
                        }
                    </div>
                )
            default: return null;
        }
    }, [myFreindsList, contentType])


    return (
        <>
            <div className="flex flex-col justify-center items-center h-full w-full">
                <div className="flex flex-row items-center justify-center gap-8 p-8 border rounded-md">
                    <div className="flex flex-col gap-2 justify-center cursor-pointer items-center"
                        onClick={() => { setModalVisible(true); setContentType('MyFriends') }}>
                        <div>내친구</div>
                        <div>1</div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center cursor-pointer items-center"
                        onClick={() => { setModalVisible(true); setContentType('RequsetedFriends') }}>
                        <div>친구 신청</div>
                        <div>1</div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center cursor-pointer items-center"
                        onClick={() => { setModalVisible(true); setContentType('FindFriends') }}>
                        <div>친구 찾기</div>
                        <div>돋보기</div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center cursor-pointer items-center">
                        <div>차단 목록</div>
                        <div>1</div>
                    </div>
                </div>
            </div>
            <Modal visible={modalVisible} close={() => setModalVisible(false)}>
                {modalContent()}
            </Modal>
        </>
    );
}

const Modal: React.FC<{ children: React.ReactNode, visible: boolean, close: () => void }> = ({ children, visible, close }) => {
    return (
        <div className={`${visible ? 'absolute' : 'hidden'} w-full h-full bg-black bg-opacity-50 top-0 left-0 flex flex-col items-center justify-center`}
            onClick={(e) => { if (e.currentTarget == e.target) close(); }}>
            <div className="py-2 bg-white rounded-md flex flex-col">
                <div className="mx-2 self-end pb-0.5 w-6 h-6 bg-black cursor-pointer"
                    onClick={close} />
                <div className="px-4">
                    {children}
                </div>
            </div>
        </div>
    )
}


const FriendFindComponent: React.FC<{ myFriendList: FriendList, myRequstedList: FriendList }> = ({ myFriendList, myRequstedList }) => {

    const [keyword, setKeyword] = useState('');
    const [searchedList, setList] = useState([]);

    const FindFriends = useCallback(debounce(async (keyword: string) => {
        try {
            const loadedUsers = await findFriends(keyword);
            setList(loadedUsers);
        } catch (e) {
            console.error(e);
        }
    }, 300), []);

    const FriendRequset = useCallback(debounce(async (friendName: string, freindId: string) => {
        try {
            const response = await requestFriend(freindId);
            if (!response) throw Error('친구 추가 실패')
            alert(`${friendName}님께 친구를 신청했어요`);
        } catch (e: unknown) {
            console.error(e);
            if (e instanceof Error) {
                alert(e.message);
            } else {
                alert("An unknown error occurred");
            }
        }
    }), [])

    useEffect(() => {
        FindFriends(keyword);
    }, [keyword])

    const hasFriendWithId = useCallback((id: number): string => {
        if (myFriendList.some((friend: Friend) => friend.simpleUserDTO.userId == id))
            return 'ACCEPTED';
        else if (myFriendList.some((friend: Friend) => friend.simpleUserDTO.userId == id))
            return 'PENDING';
        else return 'NOTHING'
    }, [])

    return (
        <div>
            <label className="w-72 my-1 py-1 px-4 bg-gray-200 flex flex-row items-center">
                <div className="w-4 h-4 bg-black mr-2" />
                <input
                    type="text"
                    name="keyword"
                    id="keyword"
                    placeholder="친구를 검색하세요"
                    className="bg-transparent outline-none"
                    value={keyword}
                    onChange={e => setKeyword(e.currentTarget.value)} />
            </label>
            <div className="w-full h-96 mt-2 overflow-y-scroll">
                {searchedList.length > 0 ? (
                    <>
                        {searchedList.map((user: SimpleUserDTO, index) => {
                            const friendStatus = hasFriendWithId(user.userId);
                            return (
                                <div key={index} className="hover:bg-gray-100 flex h-16 py-1 px-2 flex-row items-center gap-4">
                                    <div className="w-12 h-full bg-slate-200">
                                        <img
                                            src={user.profileImage.fullFilePath}
                                            alt={user.profileImage.originalFilename}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex flex-grow flex-col gap-1 justify-center">
                                        <div className="text-base font-semibold">
                                            {user.name}
                                        </div>
                                        <div className="text-xs text-gray-300">
                                            {user.username}
                                        </div>
                                    </div>
                                    {
                                        friendStatus == 'ACCEPTED' ?
                                            null : friendStatus == 'PENDING'
                                                ?
                                                <div className=" text-xs items-center justify-center flex p-0.5 border border-blue-400 rounded-sm text-blue-600 hover:bg-blue-400 hover:text-white cursor-pointer"
                                                    onClick={() => FriendRequset(user.name, user.username)}>
                                                    요청 수락
                                                </div>
                                                :
                                                <div className=" text-xs items-center justify-center flex p-0.5 border border-blue-400 rounded-sm text-blue-600 hover:bg-blue-400 hover:text-white cursor-pointer"
                                                    onClick={() => FriendRequset(user.name, user.username)}>
                                                    친구 추가
                                                </div>}
                                </div>
                            )
                        })}
                    </>
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>
        </div >
    )
}