"use client";

import Link, { LinkProps } from "next/link";
import {useView} from "@pThunder/app/utils/useView";
import { CSSProperties } from "react";

interface CustomLinkProps extends LinkProps {
    className?: string;
    children: React.ReactNode;
    style: CSSProperties
}

export const WebViewLink: React.FC<CustomLinkProps> = ({ href, className, children,style, ...props }) => {

    const { view } = useView();

    if (view === 'webview') {

        const handleClick = () => {
            window.ReactNativeWebView?.postMessage(JSON.stringify({ action: "push", href: href }));
        };

        return (
            <div className={className} onClick={handleClick} style={style}>
                {children}
            </div>
        );
    }

    return (
        <Link href={href} className={className} style={style} {...props}>
            {children}
        </Link>
    );
};