import { Comment as CommentType } from "../../model/index";
import CommentMenu from "./CommentMenu";

const Comment = ({
  comment,
  isReplying,
  setReply,
  commentInputRef,
}: {
  comment: CommentType;
  isReplying: CommentType | null;
  setReply: (comment: CommentType) => void;
  commentInputRef: React.RefObject<HTMLInputElement|null>;
}) => {
  return (
    <div
      style={{
        backgroundColor:
          isReplying?.commentId == comment.commentId ? "#F4F2FF" : "#FFF",
      }}
      className="w-full py-4 px-6 gap-2 flex flex-col border-b"
    >
      <div className="flex flex-row justify-between items-center">
        <div
          className="flex flex-row gap-1 items-center"
          style={{ fontSize: 12 }}
        >
          <div>{comment.userName}</div>
          <div className="text-gray-300">{comment.createdAt}</div>
        </div>
        <div className="flex flex-row items-center">
          <div
            className="w-8 cursor-pointer flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("대댓글을 작성하시겠습니까?")) {
                commentInputRef.current?.focus();
                setReply(comment);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
          </div>
          <div
            className="w-8 cursor-pointer flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("이 댓글을 추천하시겠습니까?")) {
                alert(comment.content.substring(0, 10) + "추천됨");
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#FF7B7B"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
              />
            </svg>
          </div>
          <div className="w-8 cursor-pointer">
            <CommentMenu comment={comment} />
          </div>
        </div>
      </div>
      <div style={{ fontSize: 13 }}>{comment.content}</div>
    </div>
  );
};

export default Comment;