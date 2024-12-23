'use client'
import "@pThunder/app/globals.css";

import BottomTabs from "@pThunder/app/(main)/BottomTabs";
import Image from "next/image";

import MyPageIcon from '@public/MyPage-Icon.svg';
import NotificationIcon from '@public/Notification-Icon.svg'
import { useRouter } from "next/navigation";

export default function Chats() {

  return (
    <div className="flex flex-col h-full w-full">
      <div
        className="flex flex-row items-center justify-between flex-shrink-0"
        style={{ height: 50, paddingLeft: 24, paddingRight: 24 }}>

        <div style={{ fontSize: 16, fontWeight: 700 }}>채팅 목록</div>
        <div className="flex flex-row" style={{ gap: 8 }}>
          {/* 돋보기로 수정 */}
          <Image src={NotificationIcon} width={36} alt="" />
          {/* 채팅 추가로 변경 */}
          <Image src={MyPageIcon} width={36} alt="" />

        </div>
      </div>
      <div className="relative w-full h-full flex-grow flex flex-col overflow-y-auto" style={{scrollbarWidth:'thin'}}>
        {Array.from({ length: 21 }).map(() => (
          <ChatComponent />
        ))}
      </div>
      <BottomTabs />
    </div>
  );
}

const ChatComponent = () => {
  const router = useRouter();
  return (
    <div className="flex flex-row items-center cursor-pointer" style={{ paddingLeft: 28, paddingRight: 28, gap: 12, paddingTop: 12, paddingBottom: 12 }}
    onClick={()=>router.push('chats/room')}>
      <div className="flex-shrink-0" style={{ width: 48, height: 48, borderRadius: 5, backgroundColor: '#D9D9D9' }}>
        {/* 여기 이미지 삽입 */}
      </div>
      <div className="flex flex-col flex-grow" style={{ gap: 4 }}>
        <div className="flex flex-row items-start justify-between" style={{ lineHeight: '125%' }}>
          <div style={{ fontSize: 13, fontWeight: 600, }}>사용자 이름</div>
          <div style={{ fontSize: 11 }}>오전 09:20</div>
        </div>
        <div className="flex-grow flex flex-row items-start justify-center">
          <div className="flex-grow" style={{ whiteSpace: "pre-line", fontSize: 13, lineHeight: '125%', color: '#AEADAD' }}>
            {`가장 최근 메시지\n최대 2줄까지`}
          </div>
          <div className="flex rounded-full items-center justify-center" style={{ width: 20, height: 20, backgroundColor: '#816DFF', fontSize: 11, color: '#FFF', lineHeight:'100%' }}>1</div>
        </div>
      </div>
    </div>
  )
}