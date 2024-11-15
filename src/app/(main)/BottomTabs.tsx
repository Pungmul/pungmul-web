'use client'
import { useRouter } from "next/navigation";
import "@pThunder/app/globals.css";
import Image from "next/image";
import ThunderIconoutline from '@public/Thunder-Icon-outline.svg';
import ThunderIconfilled from '@public/Thunder-Icon-filled.svg';

export default function BottomTabs() {
    const router = useRouter();
    const startedUrl = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : '';
    return (
        <div className="w-full justify-center px-4 bg-gray-400 flex flex-row bottom-0 items-center gap-4 py-2 sticky ">
            <div className="w-20 h-20 justify-center items-center bg-stone-400 cursor-pointer flex" onClick={() => router.push('/home')}>
                {startedUrl == 'home' ? <Image src={ThunderIconfilled} width={80} alt="onIt" /> : <Image src={ThunderIconoutline} width={80} alt="outline" />}
            </div>
            <div className="w-20 h-20 justify-center items-center bg-red-400 cursor-pointer flex" onClick={() => router.push('/board/main')}> 게시판 </div>
            <div className="w-20 h-20 justify-center items-center bg-blue-400 cursor-pointer flex" onClick={() => router.push('/my-page')}> 마이페이지 </div>
            <div className="w-20 h-20 justify-center items-center bg-red-400 cursor-pointer flex" onClick={() => router.push('/friends')}> 친구 </div>
            <div className="w-20 h-20 justify-center items-center bg-red-400 cursor-pointer flex" onClick={() => router.push('/logout')}> 로그아웃 </div>
        </div>
    )
}