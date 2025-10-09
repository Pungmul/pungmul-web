"use client";
import Link from "next/link";
import { useBoardList } from "@/features/board";
import { usePathname } from "next/navigation";

export default function BoardListNav() {
  const pathname = usePathname();
  const { data: boardList = [] } = useBoardList();

  return (
    <aside>
      <nav className="hidden lg:flex flex-col gap-[24px] sticky top-[72px] self-start w-[120px] h-fit">
        <h2 className="text-[17px] font-bold px-4">다른 게시판</h2>
        <ul className="flex flex-col items-start list-none gap-[24px] p-4">
          <li>
            <Link
              href={`/board/hot-post`}
              className={`cursor-pointer text-[15px] ${
                pathname.includes("/board/hot-post") ? "text-primary" : "text-grey-500"
              } hover:text-primary transition-colors`}
            >
              인기 게시글
            </Link>
          </li>
          {boardList.map((board) => (
            <li key={board.id}>
              <Link
                href={`/board/${board.id === 999999 ? "promote" : board.id}`}
                className={`cursor-pointer text-[15px] ${
                  pathname.includes(`/board/${board.id}`)
                    ? "text-primary"
                    : "text-grey-500"
                } hover:text-primary transition-colors`}
                prefetch
              >
                {board.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
