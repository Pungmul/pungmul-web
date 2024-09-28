'use client'
import { useRouter } from "next/navigation";

export default function SideMenu(){
    const router = useRouter();
    return(
        <div className="w-24 h-full bg-gray-400 flex flex-col items-center gap-2 py-2">
            <div className="w-20 h-20 justify-center items-center bg-stone-400"> icon </div>
            <div className="w-20 h-20 justify-center items-center bg-red-400 cursor-pointer" onClick={()=> router.push('/logout')}> 로그아웃 </div>
        </div>
    )
}