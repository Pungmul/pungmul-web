import { create } from "zustand";

interface ViewState {
  view: "webview" | "browser";
}

// 최초 실행 시 한 번만 `userAgent` 검사
const getInitialView = (): "webview" | "browser" => {
  if (typeof window !== "undefined") {
    return navigator.userAgent.toLowerCase().includes("react-native") ? "webview" : "browser";
  }
  return "browser"; // 서버 환경에서는 기본적으로 'browser'로 설정
};

// Zustand Store (최초 한 번만 실행)
export const useViewStore = create<ViewState>(() => ({
  view: getInitialView(),
}));

// useView 훅 (zustand 상태만 반환)
export function useView() {
  const view = useViewStore((state) => state.view);
  return { view };
}