'use client'
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import HomeIconOutline from '@public/icons/Home-icon-outline.svg';
import HomeIconFilled from '@public/icons/Home-icon-filled.svg';
import ThunderIconOutline from '@public/icons/Thunder-Icon-outline.svg';
import ThunderIconFilled from '@public/icons/Thunder-Icon-filled.svg';
import BoardIconOutline from '@public/icons/Board-icon-outline.svg';
import BoardIconFilled from '@public/icons/Board-icon-filled.svg';
// import NewsFeedIconOutline from '@public/NewsFeed-icon-outline.svg';
// import NewsFeedIconFilled from '@public/NewsFeed-icon-filled.svg';
import ChatIconOutline from '@public/icons/Chat-icon-outline.svg';
import ChatIconFilled from '@public/icons/Chat-icon-filled.svg';
import Link from "next/link";
import {useView} from "@pThunder/lib/shared/useView";


export default function BottomTabs() {

    const { view } = useView()

    if (view === 'webview') {
        // webview에서의 동작
        return null;
    }

    const pathname = usePathname(); // 현재 경로 가져오기

    if (pathname !== '/home' && pathname !== '/board/main' && pathname !== '/chats' && pathname != '/lightning')
        return null;

    // const webviewAction = ()=>{
    //     window.ReactNativeWebView
    // }
    return (
        <div className="w-full justify-between bg-white flex-shrink-0 flex flex-row bottom-0 items-center sticky" style={{ height: 84, padding: '12px 32px 24px 32px' }}>

            {/* home page button */}
            <Link href={'/home'} className="w-12 h-12 justify-center items-center cursor-pointer flex" prefetch>
                {pathname == '/home' ? <Image src={HomeIconFilled} width={36} alt="" /> : <Image src={HomeIconOutline} width={36} alt="" />}
            </Link>
            {/* newsfeed page button  */}
            {/* <div className="w-12 h-12 justify-center items-center cursor-pointer flex" onClick={() => router.push('/newsfeed')}>
                {pathname == '/newsfeed' ? <Image src={NewsFeedIconFilled} width={36} alt="" /> : <Image src={NewsFeedIconOutline} width={36} alt="" />}
            </div> */}
            {/* lightning page button */}
            <Link href={'/lightning'} className="w-12 h-12 justify-center items-center cursor-pointer flex">
                {pathname == '/lightning' ? <Image src={ThunderIconFilled} width={36} alt="" /> : <Image src={ThunderIconOutline} width={36} alt="" />}
            </Link>
            {/* board page button */}
            <Link href={'/board/main'} className="w-12 h-12 justify-center items-center cursor-pointer flex" prefetch>
                {pathname == '/board/main' ? <Image src={BoardIconFilled} width={36} alt="" /> : <Image src={BoardIconOutline} width={36} alt="" />}
            </Link>
            {/* chat page button */}
            <Link href={'/chats'} className="w-12 h-12 justify-center items-center cursor-pointer flex" prefetch>
                {pathname == '/chats' ? <Image src={ChatIconFilled} width={36} alt="" /> : <Image src={ChatIconOutline} width={36} alt="" />}
            </Link>
        </div>
    )
}