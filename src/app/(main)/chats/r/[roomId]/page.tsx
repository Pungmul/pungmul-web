'use client'

import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useParams } from "next/navigation";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { Header } from "@pThunder/app/component/Header";

import { useToken } from "../TokenProvider";
import { loadChatLogs } from "./utils";

export const dynamic = 'force-dynamic';

interface ChatRoomInfo {
    chatRoomUUID: string;
    roomName: string;
    profileImageUrl: string | null;
    group: boolean;
}

interface ProfileImage {
    id: number;
    originalFilename: string;
    convertedFileName: string;
    fullFilePath: string;
    fileType: string;
    fileSize: number;
    createdAt: string; // ISO 형식 문자열
}

interface User {
    userId: number;
    username: string;
    name: string;
    profileImage: ProfileImage;
}

// 채팅 메시지
interface Message {
    id: number;
    senderUsername: string;
    content: string;
    chatType: 'CHAT' | 'IMAGE' | string; // 다른 타입이 있다면 확장
    imageUrl: string | null;
    chatRoomUUID: string;
    createdAt: string; // ISO 형식 문자열
}

interface ChatMessage {
    messageLogId: number;
    domainType: 'CHAT'|'IMAGE';
    businessIdentifier: string;
    identifier: string;
    stompDest: string;
    content: {
        id: number;
        senderUsername: string;
        content: string;
        chatType: 'CHAT' | 'ENTER' | 'LEAVE'; // 다른 타입이 있다면 여기에 추가
        imageUrl: string | null;
        chatRoomUUID: string;
        createdAt: string; // 날짜 포맷 문자열 예상, 필요하면 Date로 변환
    };
}
// 메시지 리스트 + 페이지네이션
interface MessageList {
    total: number;
    list: Message[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
}

interface ChatRoomDto {
    chatRoomInfo: ChatRoomInfo;
    userInfoList: User[]
    messageList: MessageList;
}

export default function Page() {

    const { roomId } = useParams();
    const token = useToken();

    const wholeRef = useRef<any>(null);
    const messageRef = useRef<HTMLInputElement>(null)
    const [title, setTitle] = useState('');
    const [userList, setUserList] = useState<User[]>([]);
    const [chatLog, setChatLog] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');

    const clientRef = useRef<Client | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const initLoadChatLogs = async () => {
            try {
                setLoading(true);
                const data = (await loadChatLogs(roomId as string)) as ChatRoomDto;

                setUserList(data.userInfoList);
                setChatLog(data.messageList.list);
                setTitle(data.chatRoomInfo.group ? data.chatRoomInfo.roomName + ' ' + `(${data.userInfoList.length})` : data.chatRoomInfo.roomName);

                console.log('채팅 로그', data);
            } catch (error) {
                console.error('채팅 로그 로드 실패', error);
            } finally {
                setLoading(false);
            }
        }

        initLoadChatLogs();

    }, []);

    useEffect(() => {

        console.log('roomId', roomId, 'token', token);

        if (!token) {
            console.error('Token is not found');
            return;
        }

        const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/ws`);

        const stompClient = new Client({

            webSocketFactory: () => socket,

            reconnectDelay: 5000,

            connectHeaders: {
                Authorization: `Bearer ${token}`,  // JWT 토큰 추가
            },

            onConnect: () => {

                console.log('✅ 연결 완료');

                setLoading(false); // 연결 완료 시 로딩 false
                // 여기에 구독도 같이 진행
                stompClient.subscribe(`/sub/chat/message/${roomId}`, (message) => {

                    const parsedMessage = JSON.parse(message.body) as ChatMessage;
                    console.log(message)
                    const chatMessage: Message = {
                        id: parsedMessage.content.id,
                        senderUsername: parsedMessage.content.senderUsername,
                        content: parsedMessage.content.content,
                        chatType: parsedMessage.content.chatType,
                        imageUrl: parsedMessage.content.imageUrl,
                        chatRoomUUID: parsedMessage.content.chatRoomUUID,
                        createdAt: parsedMessage.content.createdAt || Date.now().toString(),
                    };
                    setChatLog((prevChatLog) => [...prevChatLog, chatMessage]);

                });

            },
            onStompError: (frame) => {

                console.error('❌ STOMP 에러 발생', frame);

            },
        });

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            clientRef.current?.deactivate();
        };
    }, []);

    const TimeFormat = (time: Date): string => {
        const localDate = new Date(time.getUTCHours());
        const Hours = localDate.getHours();
        const Minnutes = localDate.getMinutes();

        if (Hours == 0) return '오전 12:00'
        if (Hours < 12) return `오전 ${Hours.toString().padStart(2, "0")}:${Minnutes.toString().padStart(2, "0")}`
        if (Hours == 12) return `오후 12:00`
        return `오후 ${(Hours - 12).toString().padStart(2, "0")}:${Minnutes.toString().padStart(2, "0")}`
    }

    const rederLogItem = useCallback((item: Message, prevMessage?: Message) => {
        const username = item.senderUsername;
        const isUser = username === 'user';

        const madeTime = new Date(item.createdAt)
        const timeStamp = TimeFormat(madeTime)

        const message = item.content;

        if (!!prevMessage) {

        }

        return <ChatMessage message={message} timestamp={timeStamp} isUser={isUser} isRead={true} />;

    }, [])

    const onSendMessage = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const client = clientRef.current;
        if (!client || !client.connected) {
            console.warn('WebSocket not connected');
            return;
        }

        const trimmedContent = inputValue.trim();
        if (!trimmedContent) return;

        const messagePayload = {
            chatRoomUUID: roomId,
            content: trimmedContent,
            chatType: 'CHAT',
            createdAt: Date.now().toString(),
        };

        client.publish({
            headers: {
                Authorization: `Bearer ${token}`,  // JWT 토큰 추가
            },
            destination: `/pub/chat/message/${roomId}`,
            body: JSON.stringify(messagePayload),
        });

        console.log('📤 Sent message:', messagePayload);

        // 입력 필드 초기화 및 포커스 아웃
        setInputValue('');
    };


    return (
        <div className="flex flex-col h-full">

            <Header title={title} />

            {loading ?
                <div className="flex justify-center items-center h-full" >

                    {roomId}번 방 로딩중...
                </div>
                :
                <>
                    <div>
                        {userList.map((userInfo, index) => (userInfo.name))}
                    </div>
                    <div className="h-full flex flex-col-reverse flex-grow overflow-y-auto">
                        <div ref={wholeRef} style={{ backgroundColor: '#FFF', padding: '24px 0' }} className="flex-grow">
                            <div className="flex flex-col" style={{ gap: 24 }}>
                                {chatLog.map((chatItem, index) => {
                                    if (!!chatLog[index - 1])
                                        return rederLogItem(chatItem, chatLog[index - 1])
                                    return rederLogItem(chatItem)
                                })}
                            </div>
                        </div>
                    </div>
                </>
            }
            <form className="sticky bottom-0 w-fullshadow-up-md" onSubmit={onSendMessage}>
                <div className=" bg-white items-center px-2 py-2 ">
                    <div className="flex flex-row items-center px-0.5 py-0.5 rounded-full" style={{ backgroundColor: '#F9F9F9' }}>
                        {inputValue.length == 0 && <div className="h-9 px-4 bg-[#816DFF] rounded-full text-white justify-center flex flex-col">
                            +
                        </div>}
                        <input
                            ref={messageRef}
                            type="text"
                            name='comment'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.currentTarget.value)}
                            style={{ fontSize: 12 }}
                            placeholder="메시지 입력"
                            className="bg-transparent outline-none px-2 py-1  flex-grow" />
                        {inputValue.length != 0 && <button type="submit" className="w-9 h-9 bg-[#816DFF] rounded-full text-white">
                            ↑
                        </button>}
                    </div>
                </div>
            </form>
        </div>

    )
}

type MessageState = {
    user: string,
    time: string;
} & (
        | { message: string; image?: never; images?: never }
        // | {message ?: never; image: {id: string, uri: string, originHeight: number, originWidth: number }; images?: never }
        // | {message ?: never; image?: never; images: {id: string, uri: string, originHeight: number, originWidth: number }[] }
    );

const ChatMessage = React.memo(({ message, timestamp, isUser, isRead }: { message: string, timestamp: string, isUser: boolean, isRead: boolean }) => {
    return (
        <div style={{ margin: '0 24px' }}>
            <div style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
                <div style={isUser ? styles.MyMessage : styles.PartnerMessage}>{message}</div>
                <div className="flex flex-col justify-end items-end" style={{ gap: 2 }}>
                    {isRead && <div style={styles.readSign}>읽음</div>}
                    <div style={styles.timeStamp}>{timestamp}</div>
                </div>
            </div>
        </div >
    );
});

const styles = {
    PartnerMessage: {
        lineHeight: '110%',
        padding: '12px 16px',
        fontSize: 14,
        maxWidth: 228,
        borderRadius: 10,
        fontWeight: 500,
        borderWidth: 1,
        borderColor: '#F6F6F6',
        overflow: 'hidden'
    },
    MyMessage: {
        lineHeight: '110%',
        display: 'flex',
        padding: '12px 16px',
        fontSize: 14,
        maxWidth: 228,
        borderRadius: 10,
        fontWeight: 500,
        backgroundColor: '#816DFF',
        color: '#ECF3FF',
        overflow: 'hidden'
    },
    timeStamp: {
        lineHeight: '110%',
        fontSize: 11,
        color: '#CDCDCD',
    },
    readSign: {
        lineHeight: '110%',
        fontSize: 11,
        color: '#CDCDCD',
    }
}