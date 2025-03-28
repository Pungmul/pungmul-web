'use client'

import { useCallback, useRef, useState } from "react";
import { Header } from "@pThunder/app/component/Header";

import Image from "next/image";
import React from "react";


export default function Page() {

    const wholeRef = useRef<any>(null);
    const messageRef = useRef<HTMLInputElement>(null)
    const [chatLog, setChatLog] = useState<MessageState[]>([]);
    const [inputValue, setInputValue] = useState('');

    const TimeFormat = (time: Date): string => {
        const localDate = new Date(time.getUTCHours());
        const Hours = localDate.getHours();
        const Minnutes = localDate.getMinutes();

        if (Hours == 0) return '오전 12:00'
        if (Hours < 12) return `오전 ${Hours.toString().padStart(2, "0")}:${Minnutes.toString().padStart(2, "0")}`
        if (Hours == 12) return `오후 12:00`
        return `오후 ${(Hours - 12).toString().padStart(2, "0")}:${Minnutes.toString().padStart(2, "0")}`
    }

    const rederLogItem = useCallback((item: MessageState, prevMessage?: MessageState) => {
        const username = item.user;
        const isUser = username === 'user';

        const madeTime = new Date(item.time)
        const timeStamp = TimeFormat(madeTime)

        const message = item.message;

        if(!!prevMessage){

        }

        return <ChatMessage message={message} timestamp={timeStamp} isUser={isUser} isRead={true} />;
    },[])

    const onSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputValue.trim()) {
            const now = new Date();
            setChatLog((prev) =>[...prev, { user: 'user', message: inputValue, time: now.toISOString() }]);
            setInputValue('');
            messageRef.current?.blur();
        }
    }

    return (
        <div className="flex flex-col h-full">
            <Header title={'상대방 이름'} />
            <div className="h-full flex flex-col flex-grow overflow-y-auto">
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
            <form className="sticky bottom-0 w-fullshadow-up-md" onSubmit={onSend}>
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
        // | { message?: never; image: { id: string, uri: string, originHeight: number, originWidth: number }; images?: never }
        // | { message?: never; image?: never; images: { id: string, uri: string, originHeight: number, originWidth: number }[] }
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