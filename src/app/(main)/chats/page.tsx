'use client'
import BottomTabs from "@pThunder/app/(main)/BottomTabs";
import Image from "next/image";
import SockJS from 'sockjs-client';

import MyPageIcon from '@public/icons/MyPage-Icon.svg';
import NotificationIcon from '@public/icons/Notification-Icon.svg'
import { useRouter } from "next/navigation";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { createChatRoom, loadChatRooms } from "./utils";

export function mySocketFactory() {
  return new SockJS(`${process.env.BASE_URL}/api/lightning/nearby`);
}

interface ChatRoomDto {
  chatRoomUUID: string;
  lastMessageTime: string | null;
  lastMessageContent: string | null;
  unreadCount: number | null;
  senderId: number | null;
  senderName: string | null;
  receiverId: number | null;
  receiverName: string | null;
  chatRoomMemberIds: number[];
  chatRoomMemberNames: string[];
  roomName: string;
  profileImageUrl: string | null;
  group: boolean;
}


export default function Chats() {

  const stompClientRef = useRef<Client | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoomDto[]>([]);

  useEffect(() => {
    const initLoadChatRooms = async () => {
      try {
        const data = await loadChatRooms() as ChatRoomDto[];

        setChatRooms(data)
        console.log('Chat rooms loaded:', data);
      } catch (error) {
        console.error('Error loading chat rooms:', error);
      }
    }

    initLoadChatRooms();
  }, [])

  //STOMP 구현 부분

  useEffect(() => {

    const socket = mySocketFactory();
    
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe('/topic/greetings', (response) => {
          console.log('Received message:', response.body);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [])

  const clickAddChatRoom = () => {
    const createChatRoomRequest = async () => {
      try {
        const response = await createChatRoom({ receiverName: "user10@example.com" })

        console.log('Chat room created:', response);

      } catch (error) {
        alert('Failed to create chat room');
        console.error('Error creating chat room:', error);
      }
    }
    createChatRoomRequest();
  };

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
          <Image src={MyPageIcon} width={36} alt="" onClick={clickAddChatRoom} />

        </div>
      </div>
      <div className="relative w-full h-full flex-grow flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {chatRooms.map((room, index) => (
          <ChatComponent key={'room-' + index} room={room} />
        ))}
      </div>
    </div>
  );
}

const ChatComponent = ({ room }: { room: ChatRoomDto }) => {

  const router = useRouter();

  return (
    <div className="flex flex-row items-center cursor-pointer" style={{ paddingLeft: 28, paddingRight: 28, gap: 12, paddingTop: 12, paddingBottom: 12 }}
      onClick={() => router.push(`chats/r/${room.chatRoomUUID}`)}>
      <div className="flex-shrink-0" style={{ width: 48, height: 48, borderRadius: 5, backgroundColor: '#D9D9D9' }}>
        {/* 여기 이미지 삽입 */}
        {room.profileImageUrl && <Image src={room.profileImageUrl} alt=""></Image>}
      </div>
      <div className="flex flex-col flex-grow" style={{ gap: 4 }}>
        <div className="flex flex-row items-start justify-between" style={{ lineHeight: '125%' }}>
          <div style={{ fontSize: 13, fontWeight: 600, }}>{room.roomName}</div>
          <div style={{ fontSize: 11 }}>{room.lastMessageTime}</div>
        </div>
        <div className="flex-grow flex flex-row items-start justify-center">
          <div className="flex-grow" style={{ whiteSpace: "pre-line", fontSize: 13, lineHeight: '125%', color: '#AEADAD' }}>
            {room.lastMessageContent}
          </div>
          {room.unreadCount && room.unreadCount > 0 &&
            <div className="flex rounded-full items-center justify-center" style={{ width: 20, height: 20, backgroundColor: '#816DFF', fontSize: 11, color: '#FFF', lineHeight: '100%' }}>
              {room.unreadCount}
            </div>
          }
        </div>
      </div>
    </div>
  )
}