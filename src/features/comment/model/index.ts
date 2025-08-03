import { CommentReportType } from "@/shared/constants/comment";
import { ImageObject } from "@/shared/types/image";

export interface Comment {
  commentId: number; // 댓글의 고유 ID
  postId: number; // 연결된 게시글의 ID
  parentId: number | null; // 부모 댓글 ID (대댓글인 경우), null이면 최상위 댓글
  content: string; // 댓글 내용
  userName: string; // 작성자 이름
  profile: ImageObject; // 작성자 프로필 객체
  createdAt: string; // 댓글 작성 시간
  replies: Comment[];
}

export type Reply = Exclude<Comment, "replies">;

export interface ReportedComment {
  commentId: number;
  content: string;
  userName: string;
};

export interface ReportCommentBody {
  reportReason: CommentReportType;
} 