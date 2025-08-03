import { Post } from "../post/type";

export interface PostListResponse {
  total: number;
  list: Post[];
  pageNum: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface BoardInfo {
  rootCategoryName: string;
  childCategoryName: string | null;
}

export interface PostList {
  total: number;
  list: Post[];
  pageNum: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface BoardData {
  boardInfo: BoardInfo;
  hotPost: Post;
  recentPostList: PostList;
} 