"use client";
import { useInitSocketConnect } from "../socket/hooks/useInitSocketConnect";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  useInitSocketConnect();
  return <>{children}</>;
}
