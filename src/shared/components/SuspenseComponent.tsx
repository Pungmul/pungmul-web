"use client";

import { Suspense, useSyncExternalStore } from "react";
import { Spinner } from "@pThunder/shared";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  clientOnly?: boolean;
}

const useIsClient = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

export default function SuspenseComponent({
  children,
  fallback = (
    <div className="flex items-center justify-center h-full w-full flex-grow">
      <Spinner size={32} />
    </div>
  ),
  clientOnly = false,
}: Props) {
  const isClient = useIsClient();

  // clientOnly 모드일 때는 SSR 중엔 fallback만 렌더링
  if (clientOnly && !isClient) {
    return fallback;
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
}
