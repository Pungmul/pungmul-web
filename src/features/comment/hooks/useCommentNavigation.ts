import { useCallback, useEffect } from "react";

interface UseCommentNavigationProps {
  commentId: string | null;
  commentsRef: React.RefObject<Record<number, HTMLDivElement | null>>;
}

export const useCommentNavigation = ({
  commentId,
  commentsRef,
}: UseCommentNavigationProps) => {
  const moveToHash = useCallback(() => {
    if (commentId) {
      const element = commentsRef.current[parseInt(commentId)];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [commentId]);

  useEffect(() => {
    moveToHash();
  }, [moveToHash]);

  return {
    moveToHash,
  };
};
