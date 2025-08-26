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
  id: number;
  parentId: number | null;
  name: string;
  description: string;
};
