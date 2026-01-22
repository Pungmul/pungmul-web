import { create } from "zustand";

import { ToastConfig } from "../types/toast";

/** 스토어 내부 토스트 상태 — ToastConfig와 동일하되 모든 필드 required */
type ToastProps = Required<ToastConfig>;

interface ToastState {
  visible: boolean;
  toast: ToastProps;
  hide: () => void;
}

export const toastStore = create<ToastState>(() => ({
  visible: false,
  toast: {
    message: "기본 토스트 메시지",
    type: "success",
    duration: 5000,
  },
  hide: () => {
    toastStore.setState({ visible: false });
  },
}));

export const Toast = {
  show: ({ message, type = "success", duration = 5000 }: ToastConfig) => {
    toastStore.setState({
      toast: { message, type, duration },
      visible: true,
    });

    setTimeout(() => {
      toastStore.setState({ visible: false });
    }, duration);
  },
  hide: () => {
    toastStore.setState({ visible: false });
  },
};
