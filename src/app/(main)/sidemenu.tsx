'use client'
import { useRouter } from "next/navigation";

export default function SideMenu(){
    const router = useRouter();
    return(
        <div className="w-24 h-screen bg-gray-400 flex flex-col items-center gap-2 py-2 sticky top-0">
            <div className="w-20 h-20 justify-center items-center bg-stone-400 flex"> icon </div>
            <div className="w-20 h-20 justify-center items-center bg-red-400 cursor-pointer flex" onClick={()=> router.push('/board/main')}> 게시판 </div>
            <div className="w-20 h-20 justify-center items-center bg-blue-400 cursor-pointer flex" onClick={()=> router.push('/my-page')}> 마이페이지 </div>
            <div className="w-20 h-20 justify-center items-center bg-red-400 cursor-pointer flex" onClick={()=> router.push('/logout')}> 로그아웃 </div>
        </div>
    )
}