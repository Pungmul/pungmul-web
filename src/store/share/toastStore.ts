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

export const useToastStore = create<ToastState>(() => ({
  visible: false,
  toast: {
    message: "기본 토스트 메시지",
    type: "success",
    duration: 5000,
  },
  hide: () => {
    useToastStore.setState({ visible: false });
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
    useToastStore.setState({
      toast: { message, type, duration },
      visible: true,
    });

    setTimeout(() => {
      useToastStore.setState({ visible: false });
    }, duration);
  },
  hide: () => {
    useToastStore.setState({ visible: false });
  },
};
