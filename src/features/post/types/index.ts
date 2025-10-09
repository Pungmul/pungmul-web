import type { ImageObject } from "@/shared";
import type { PostReportType } from "@/shared";
import type { Comment as CommentType } from "@/features/comment";

export interface Post {
  postId: number;
  title: string;
  content: string;
  thumbnail: ImageObject | null;
  imageNum: number;
  viewCount: number;
  likedNum: number;
  commentNum: number;
  timeSincePosted: number;
  timeSincePostedText: string;
  author: string;
}

export interface PostWithCategoryName extends Post {
  categoryName: string;
}

export interface PostDetail extends Post {
  imageList: ImageObject[];
  commentList: CommentType[];
  isLiked: boolean;
  isWriter: boolean;
  categoryId: number;
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
  list: PostWithCategoryName[];
  pageNum: number;
  pageSize: number;
  size: number;
  startRow: number;
  endRow: number;
  pages: number;
  prePage: number;
};


