import { Post } from "@pThunder/features/post";

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

export type BriefBoardInfo = {
  id: number | string;
  parentId: number | null;
  name: string;
  description: string;
};