import Link from "next/link";

export type Board={ id: number, parentId: number | null, name: string }

export default function BoardList({ boardList }: { boardList: Board[]}) {
    return (
        <div className="py-3 px-2 border-0.5 border-white bg-white rounded-md flex flex-col gap-2">
            {boardList.map(board => (
                <Link href={`/board/${board.id}`} key={board.id} className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
                >
                    <div className="w-6 h-6 bg-slate-500" />
                    <div style={{ fontSize: 17, color: '#666666' }}>{board.name}</div>
                </Link>))}
        </div>
    )
}