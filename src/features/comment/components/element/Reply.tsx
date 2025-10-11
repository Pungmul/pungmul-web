import { HandThumbUpIcon } from "@heroicons/react/24/outline";

import type { Reply as ReplyType } from '../../types';
import CommentMenu from "./CommentMenu";

const Reply = ({ reply }: { reply: ReplyType }) => {
  return (
    <div
      key={reply.commentId}
      className="w-full py-4 pl-8 pr-6 border-b border-b-grey-300 bg-grey-100 gap-[8px] flex flex-col"
    >
      <div className="flex flex-row justify-between items-center">
        <div
          className="flex flex-row gap-1 items-center text-[12px]"
        >
          <div>{reply.userName}</div>
          <div className="text-grey-400">{reply.createdAt}</div>
        </div>
        <div className="flex flex-row items-center cursor-pointer">
          <div
            className="w-8 h-4 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("이 대댓글을 추천하시겠습니까?")) {
                alert(reply.content.substring(0, 10) + "추천됨");
              }
            }}
          >
            <HandThumbUpIcon className="size-6 text-red-500"/>
          </div>
          <div className="w-8 cursor-pointer flex items-center justify-center">
            <CommentMenu comment={reply} />
          </div>
        </div>
      </div>
      <div className="text-[13px] text-grey-800">{reply.content}</div>
    </div>
  );
};

export default Reply;