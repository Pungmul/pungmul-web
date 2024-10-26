import "@pThunder/app/globals.css";
import ClientComponent from "./clientComponent";
import { GET as LoadList } from "./load/route";

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

export default async function Page() {

    const response = await LoadList();
    const data = await response.json();
    const { friendList, requestedFriendList }: { friendList: FriendList, requestedFriendList: FriendList } = await data ?? { friendList: [], requestedFriendList: [] };

    return (
        <ClientComponent initFriendList={friendList} initRquestedFriendsList={requestedFriendList} />
    )
}


