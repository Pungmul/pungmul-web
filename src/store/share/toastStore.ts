import { create } from "zustand";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration: number;
}

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
  show: ({
    message,
    type = "success",
    duration = 5000,
  }: {
    message: string;
    type?: "success" | "error" | "warning" | "info";
    duration?: number;
  }) => {
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
