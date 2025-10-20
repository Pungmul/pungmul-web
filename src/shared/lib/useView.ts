"use client";
import { create } from "zustand";
import { useMediaQuery } from "react-responsive"; // 이미 있다면 이거 그대로 써라
import { useEffect } from "react";

type ViewType = "webview" | "mobile" | "desktop";

interface ViewState {
  view: ViewType;
  setView: (view: ViewType) => void;
}

// 최초 실행 시 한 번만 userAgent 검사
const getInitialView = (): ViewType => {
  if (typeof window !== "undefined") {
    const ua = navigator.userAgent.toLowerCase();
    if (
      ua.includes("react-native") ||
      ua.includes("wv") ||
      ua.includes("webview")
    ) {
      return "webview";
    }
    // 여기서 모바일/데스크톱은 아래에서 분기
  }
  // SSR 대응: 일단 desktop으로 두고, 클라에서 바꿔줘도 됨
  return "desktop";
};

export const useViewStore = create<ViewState>(() => ({
  view: getInitialView(),
  setView: (view: ViewType) => {
    useViewStore.setState({ view });
  },
}));

export function useView(): ViewType {
  const view = useViewStore((state) => state.view);
  const setView = useViewStore((state) => state.setView);

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  useEffect(() => {
    setView(
      (() => {
        if (view === "webview") return "webview";
        // 아니면 너비로 모바일/데스크톱 분기
        if (isMobile) return "mobile";

        return "desktop";
      })()
    );
  }, [isMobile]);

  // webview면 무조건 webview
  return view;
}
