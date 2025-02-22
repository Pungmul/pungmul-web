'use client'
import { usePathname, useRouter } from "next/navigation";
import "@pThunder/app/globals.css";
import Image from "next/image";

import HomeIconOutline from '@public/Home-icon-outline.svg';
import HomeIconFilled from '@public/Home-icon-filled.svg';
import ThunderIconOutline from '@public/Thunder-Icon-outline.svg';
import ThunderIconFilled from '@public/Thunder-Icon-filled.svg';
import BoardIconOutline from '@public/Board-icon-outline.svg';
import BoardIconFilled from '@public/Board-icon-filled.svg';
import NewsFeedIconOutline from '@public/NewsFeed-icon-outline.svg';
import NewsFeedIconFilled from '@public/NewsFeed-icon-filled.svg';
import ChatIconOutline from '@public/Chat-icon-outline.svg';
import ChatIconFilled from '@public/Chat-icon-filled.svg';

export default function BottomTabs() {

    const router = useRouter();// 라우터 가져오기
    const pathname = usePathname(); // 현재 경로 가져오기

    return (
        <div className="w-full justify-between bg-white flex-shrink-0 flex flex-row bottom-0 items-center sticky" style={{ height: 74, padding: '0 24px' }}>

            {/* home page button */}
            <div className="w-12 h-12 justify-center items-center cursor-pointer flex" onClick={() => router.push('/home')}>
                {pathname == '/home' ? <Image src={HomeIconFilled} width={32} alt="" /> : <Image src={HomeIconOutline} width={32} alt="" />}
            </div>
            {/* newsfeed page button  */}
            <div className="w-12 h-12 justify-center items-center cursor-pointer flex" onClick={() => router.push('/newsfeed')}>
                {pathname == '/newsfeed' ? <Image src={NewsFeedIconFilled} width={32} alt="" /> : <Image src={NewsFeedIconOutline} width={32} alt="" />}
            </div>
            {/* lightning page button */}
            <div className="w-12 h-12 justify-center items-center cursor-pointer flex" onClick={() => router.push('/lightning')}>
                {pathname == '/lightning' ? <Image src={ThunderIconFilled} width={32} alt="" /> : <Image src={ThunderIconOutline} width={32} alt="" />}
            </div>
            {/* board page button */}
            <div className="w-12 h-12 justify-center items-center cursor-pointer flex" onClick={() => router.push('/board/main')}>
                {pathname == '/board/main' ? <Image src={BoardIconFilled} width={32} alt="" /> : <Image src={BoardIconOutline} width={32} alt="" />}
            </div>
            {/* chat page button */}
            <div className="w-12 h-12 justify-center items-center cursor-pointer flex" onClick={() => router.push('/chats')}>
                {pathname == '/chats' ? <Image src={ChatIconFilled} width={32} alt="" /> : <Image src={ChatIconOutline} width={32} alt="" />}
            </div>
        </div>
    )
}