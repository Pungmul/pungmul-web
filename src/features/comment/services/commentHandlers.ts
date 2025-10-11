import type { Comment as CommentType } from '../types';

/**
 * 폼에서 댓글 데이터를 추출하는 유틸리티 함수
 */
export const extractCommentData = (form: HTMLFormElement) => {
  const formData = new FormData(form);
  const comment = formData.get("comment") as string;
  const anonymity = formData.get("anonymity") as string;
  
  return {
    comment,
    anonymity: anonymity === "true"
  };
};

/**
 * 댓글 작성 성공 후 공통 처리 로직
 */
export const handleCommentSuccess = (
  newComment: CommentType,
  setCommentList: React.Dispatch<React.SetStateAction<CommentType[]>>,
  commentInputRef: React.RefObject<HTMLTextAreaElement | null>
) => {
  // 로컬 상태에 새 댓글 추가
  setCommentList((prev) => [...prev, newComment]);
  // 입력 필드 초기화
  if (commentInputRef.current) {
    commentInputRef.current.value = "";
  }
};

/**
 * 대댓글 작성 성공 후 공통 처리 로직
 */
export const handleReplySuccess = (
  newReply: CommentType,
  setCommentList: React.Dispatch<React.SetStateAction<CommentType[]>>,
  setReply: React.Dispatch<React.SetStateAction<CommentType | null>>,
  commentInputRef: React.RefObject<HTMLTextAreaElement | null>
) => {
  // 로컬 상태에 새 대댓글 추가
  setCommentList((prev) => [...prev, newReply]);
  // 답글 모드 해제 및 입력 필드 초기화
  setReply(null);
  if (commentInputRef.current) {
    commentInputRef.current.value = "";
  }
};
