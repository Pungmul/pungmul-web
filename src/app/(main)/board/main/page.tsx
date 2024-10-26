'use client'

import { useEffect, useState } from "react"
import { loadBoardInfomations } from "./utils";
import { useRouter } from "next/navigation";

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
        <div>
            {boardList.map(board => (
                <div key={board.id} className="flex flex-row items-center gap-1 p-0.5 cursor-pointer"
                onClick={()=>router.push(`${board.id}`)}>
                    <div className="w-6 h-6 bg-slate-500"/>
                    <div>{board.name}</div>
                </div>))}
        </div>
    )
}