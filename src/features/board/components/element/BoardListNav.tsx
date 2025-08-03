import Link from "next/link";
import { type BoardInfo } from "@/features/board";

export default function BoardListNav({ boardList, currentBoardID }: { boardList: BoardInfo[], currentBoardID: number | 'hot-post'}) {

  return (
    <nav className="hidden lg:flex flex-col gap-[24px] sticky top-[72px] self-start w-[120px] h-fit">
      <h2 className="text-[17px] font-bold px-4">다른 게시판</h2>
      <ul className="flex flex-col items-start list-none gap-[24px] p-4">
        <li>
          <Link href={`/board/hot-post`} 
          className={`cursor-pointer text-[15px] ${currentBoardID === 'hot-post' ? "text-[#816DFF]" : "text-[#bdbdbd]"} hover:text-[#816DFF] transition-colors`}>
            인기 게시글
          </Link>
        </li>
        {boardList.map((board) => (
          <li key={board.id}>
            <Link href={`/board/${board.id}`} 
            className={`cursor-pointer text-[15px] ${currentBoardID === board.id ? "text-[#816DFF]" : "text-[#bdbdbd]"} hover:text-[#816DFF] transition-colors`}>{board.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
