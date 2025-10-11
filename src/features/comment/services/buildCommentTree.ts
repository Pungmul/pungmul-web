import type { Comment as CommentType } from '../types';

/**
 * 댓글 배열을 트리 구조로 변환하는 비즈니스 로직
 * @param commentArray - 평면적인 댓글 배열
 * @returns 부모-자식 관계가 구성된 댓글 트리
 */
export const buildCommentTree = (commentArray: CommentType[]): CommentType[] => {
  const commentMap = new Map<number, CommentType>();
  const rootComments: CommentType[] = [];

  // 각 댓글을 ID 기반으로 매핑 (불변성을 유지하면서 새로운 객체 생성)
  commentArray.forEach((comment) => {
    commentMap.set(comment.commentId, { ...comment, replies: [] });
  });

  // 모든 댓글을 순회하여 부모-자식 관계 구성
  commentArray.forEach((comment) => {
    if (comment.parentId === null) {
      rootComments.push(commentMap.get(comment.commentId)!);
    } else {
      const parentComment = commentMap.get(comment.parentId);
      if (parentComment) {
        parentComment.replies.push(commentMap.get(comment.commentId)!);
      }
    }
  });

  return rootComments;
};
