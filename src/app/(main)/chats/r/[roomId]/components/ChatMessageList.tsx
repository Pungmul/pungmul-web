import React, { useCallback } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';

interface ChatMessageListProps {
    messages: Message[];
    userList: { username: string; name: string }[];
    currentUserId: string;
}

const TimeFormat = (time: Date): string => {

    const Hours = time.getHours();
    const Minutes = time.getMinutes();

    if (Hours === 0) return '오전 12:00';
    if (Hours < 12) return `오전 ${Hours.toString().padStart(2, "0")}:${Minutes.toString().padStart(2, "0")}`;
    if (Hours === 12) return `오후 12:00`;
    return `오후 ${(Hours - 12).toString().padStart(2, "0")}:${Minutes.toString().padStart(2, "0")}`;
};

export const ChatMessageList = React.memo(({ messages, userList, currentUserId }: ChatMessageListProps) => {
    const renderMessage = useCallback((message: Message, prevMessage?: Message) => {
        const isUser = message.senderUsername === currentUserId;
        const userName = userList.find(user => user.username === message.senderUsername)?.name;
        const timeStamp = TimeFormat(new Date(message.createdAt));
        console.log(message.createdAt,TimeFormat(new Date(message.createdAt)), 'createdAt')
        console.log(message, prevMessage, userName);
        if (!prevMessage || prevMessage.senderUsername !== message.senderUsername || 
            TimeFormat(new Date(prevMessage.createdAt)) !== timeStamp) {
            return (
                <li className="flex flex-col gap-2">
                    <div className={`${isUser ? "self-end" : "self-start"} px-[24px] font-light text-[#cdcdcd] text-[11px]`}>
                        {userName}
                    </div>
                    <ChatMessage 
                        key={message.id} 
                        message={message.content} 
                        timestamp={timeStamp} 
                        isUser={isUser} 
                        isRead={true} 
                    />
                </li>
            );
        }

        return (
            <li>
                <ChatMessage 
                    key={message.id} 
                    message={message.content} 
                    timestamp={timeStamp} 
                    isUser={isUser} 
                    isRead={true} 
                />
            </li>
        );
    }, [userList, currentUserId]);

    return (
        <ul className="flex flex-col list-none" style={{ gap: 12 }}>
            {messages.map((message, index) => {
                const prevMessage = messages[index - 1];
                return renderMessage(message, prevMessage);
            })}
        </ul>
    );
}); 