'use client'

import { useEffect, useState } from "react"
import { loadBoardInfomations } from "./utils";
import { useRouter } from "next/navigation";

import BottomTabs from "@pThunder/app/(main)/BottomTabs";
import Link from "next/link";

import "@pThunder/app/globals.css";

export default function BoardMainPage() {
    const router = useRouter();
    const [boardList, setList] = useState<{ id: number, parentId: number | null, name: string }[]>([]);

    useEffect(() => {
        const loadLists = async () => {
            try {
                const data = await loadBoardInfomations() as { id: number, parentId: number | null, name: string }[];
                setList(data);
            } catch (e) { console.error(e) }
        }

        loadLists();
    }, [])

    return (
        <div className="flex flex-col h-full w-full">
            <div className="w-full h-full flex-grow px-6 py-2" style={{ backgroundColor: '#F9F8FF' }}>
                <div className=" flex flex-col">
                    <div style={{ marginLeft: 8, marginBottom: 12 }} className="text-xl font-semibold">게시판</div>
                    <div className="flex flex-col" style={{ gap: 16 }}>
                        <div className="py-3 px-2 border-0.5 border-white bg-white rounded-md flex flex-col gap-2">

                            <Link href={`/board/1`} className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
                            >
                                <div className="w-6 h-6 bg-slate-500" />
                                <div style={{ fontSize: 17, color: '#666666' }}>내가 쓴 글</div>
                            </Link>
                            <Link href={`/board/1`} className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
                            >
                                <div className="w-6 h-6 bg-slate-500" />
                                <div style={{ fontSize: 17, color: '#666666' }}>내가 쓴 댓댓글</div>
                            </Link>
                            <Link href={`/board/1`} className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
                            >
                                <div className="w-6 h-6 bg-slate-500" />
                                <div style={{ fontSize: 17, color: '#666666' }}>좋아요 누른 글</div>
                            </Link>
                            <Link href={`/board/1`} className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
                            >
                                <div className="w-6 h-6 bg-slate-500" />
                                <div style={{ fontSize: 17, color: '#666666' }}>HOT 게시판</div>
                            </Link>
                        </div>
                        <div className="py-3 px-2 border-0.5 border-white bg-white rounded-md flex flex-col gap-2">
                            {boardList.map(board => (
                                <Link href={`/board/${board.id}`} key={board.id} className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
                                >
                                    <div className="w-6 h-6 bg-slate-500" />
                                    <div style={{ fontSize: 17, color: '#666666' }}>{board.name}</div>
                                </Link>))}
                        </div>
                    </div>
                </div>
            </div>

            <BottomTabs />
        </div>
    )
}