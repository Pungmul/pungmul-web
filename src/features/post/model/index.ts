import { ImageObject } from "./image";
import { PostReportType } from "@/shared/constants/post";
import { Comment as CommentType } from "@/features/comment/model";

export interface Post {
  postId: number;
  title: string;
  content: string;
  viewCount: number;
  likedNum: number;
  timeSincePosted: number;
  timeSincePostedText: string;
  author: string;
}

export interface PostDetail extends Post {
  imageList: ImageObject[];
  commentList: CommentType[]; // Comment 타입은 별도로 import하여 사용
  isLiked: boolean;
  isWriter: boolean;
}

export interface PostLikeResponse {
  postId: number;
  liked: boolean;
  likedNum: number;
}

export interface ReportPostBody {
  reportReason: PostReportType;
}

export type MyPostResponse = {
  total: number;
  list: Post[];
  pageNum: number;
  pageSize: number;
  size: number;
  startRow: number;
  endRow: number;
  pages: number;
  prePage: number;
};

// ImageObject 타입도 함께 export
export type { ImageObject } from "./image";
