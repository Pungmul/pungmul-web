"use client";

import Link, { LinkProps } from "next/link";
import { useView } from "@/shared/lib/useView";
import { CSSProperties } from "react";

interface CustomLinkProps extends LinkProps {
  className?: string;
  draggable?: boolean;
  children: React.ReactNode;
  style?: CSSProperties;
}

export const WebViewLink: React.FC<CustomLinkProps> = ({
  href,
  className,
  children,
  style,
  ...props
}) => {
  const view = useView();
  const { draggable = false } = props;
  if (view === "webview") {
    const handleClick = () => {
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({ action: "push", href: href })
      );
    };

    return (
      <div
        className={className}
        onClick={handleClick}
        draggable={draggable}
        style={style}
      >
        {children}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      style={style}
      draggable={draggable}
      {...props}
    >
      {children}
    </Link>
  );
};
