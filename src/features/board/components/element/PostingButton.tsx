import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function PostingButton({ boardID }: { boardID: number|'promote' }) {

  return (
    <div className="fixed bottom-[12px] flex justify-center w-full p-[8px] z-30">
      <Link
        className="px-[12px] py-[8px] bg-background rounded-full flex items-center justify-center gap-[8px] border-[1px] border-grey-200"
        href={{
          pathname: `/board/p`,
          query: {
            boardId: boardID,
          },
        }}
        scroll={false}
      >
        <div className="text-[14px] text-grey-800">게시글 작성</div>
        <div
          style={{ height: 24, width: 24, cursor: "pointer" }}
          className="flex justify-center items-center"
        >
          <PencilIcon className="size-6 text-primary" />
        </div>
      </Link>
    </div>
  );
}
