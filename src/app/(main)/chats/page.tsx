'use client'
import BottomTabs from "@pThunder/app/(main)/BottomTabs";
import Image from "next/image";
import SockJS from 'sockjs-client';

import MyPageIcon from '@public/MyPage-Icon.svg';
import NotificationIcon from '@public/Notification-Icon.svg'
import { useRouter } from "next/navigation";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

export function mySocketFactory() {
  return new SockJS(`${process.env.BASE_URL}/api/lightning/nearby`);
}

export default function Chats() {

  const stompClientRef = useRef<Client | null>(null);

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

  const sendMessage = () => {
    const stompClient = stompClientRef.current;
    if (stompClient && stompClient.connected) {
      console.log('Sending message:', 'name');
      const token = localStorage.getItem('token');
      
      stompClient.publish({
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        destination: '/app/hello',
        body: 'name',
      });
    } else {
      console.error('Stomp client is not connected');
    }
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
          <Image src={MyPageIcon} width={36} alt="" />

        </div>
      </div>
      <div className="relative w-full h-full flex-grow flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {Array.from({ length: 21 }).map(() => (
          <ChatComponent />
        ))}
      </div>
    </div>
  );
}

const ChatComponent = () => {
  const router = useRouter();
  return (
    <div className="flex flex-row items-center cursor-pointer" style={{ paddingLeft: 28, paddingRight: 28, gap: 12, paddingTop: 12, paddingBottom: 12 }}
      onClick={() => router.push('chats/room')}>
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
          <div className="flex rounded-full items-center justify-center" style={{ width: 20, height: 20, backgroundColor: '#816DFF', fontSize: 11, color: '#FFF', lineHeight: '100%' }}>1</div>
        </div>
      </div>
    </div>
  )
}