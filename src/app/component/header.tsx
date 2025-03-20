'use client'
import { useRouter } from "next/navigation"

export function Header({ title, rightBtn }: { title: string, rightBtn?: React.ReactNode }) {
    // const router = useRouter()
    const router = useRouter()
    return (
        <div style={{ height: 50 }} className="w-full bg-white flex flex-col justify-center items-center sticky flex-shrink-0 top-0" >
            <div className="absolute" style={{ left: 24, width: 24, height: 24, backgroundColor: '#DDD',cursor:'pointer' }}
                onClick={() => router.back()}></div>
            <div style={{fontSize:20}} className="font-normal">{title}</div>
            {rightBtn&& <div className="absolute" style={{right:24}}>{rightBtn}</div> }
        </div>
    )
}