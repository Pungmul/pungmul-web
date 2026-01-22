export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
}
