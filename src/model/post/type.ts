import { ImageObject } from "../image/type";
import { Comment as CommentType } from "../comment/type";

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
  commentList: CommentType[];
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