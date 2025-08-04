"use client";

import { Suspense, useEffect, useState } from "react";
import { Spinner } from "@pThunder/shared";

export default function SuspenseComponent(props: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const {
    fallback = (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner size={32} />
      </div>
    ),
    children,
  } = props;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return fallback;
  }
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
