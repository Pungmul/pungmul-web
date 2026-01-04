"use client";
import { useCallback, useRef } from "react";

export const useScrollPosition = () => {
  const scrollRef = useRef<number>(0);
  const wholeRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const saveScrollPosition = useCallback(() => {
    if (messageContainerRef.current) {
      scrollRef.current = messageContainerRef.current.scrollHeight;
    }
  }, []);

  const maintainScrollPosition = useCallback(() => {
    if (
      scrollRef.current > 0 &&
      wholeRef.current &&
      messageContainerRef.current
    ) {
      const newHeight = messageContainerRef.current.scrollHeight;
      const prevHeight = scrollRef.current;
      const delta = newHeight - prevHeight;

      wholeRef.current.scrollTo({
        top: wholeRef.current.scrollTop + delta,
      });

      scrollRef.current = newHeight;
    }
  }, []);

  const scrollToTop = useCallback(() => {
    wholeRef.current?.scrollTo({ top: 0 });
  }, []);

  return {
    scrollRef,
    wholeRef,
    messageContainerRef,
    saveScrollPosition,
    maintainScrollPosition,
    scrollToTop,
  };
};
