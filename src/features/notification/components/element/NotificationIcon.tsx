"use client";

import { useState, useEffect, useRef } from "react";
import { useNotReadMessageCount } from "@pThunder/features/home";
import NotificationBadge from "./NotificationBadge";
import Image from "next/image";
import React from "react";

export default function NotificationIcon() {
  const notificationBoxRef = useRef<HTMLDivElement>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { data: notReadMessageCnt } = useNotReadMessageCount();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationBoxRef.current &&
        !notificationBoxRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" onClick={() => setNotificationOpen(!notificationOpen)}>
      <Image
        src={"/icons/Notification-Icon.svg"}
        width={36}
        height={36}
        alt=""
        className="cursor-pointer"
      />
      <div className="absolute bottom-0 right-0">
        <NotificationBadge notReadMessageCnt={notReadMessageCnt || 0} />
      </div>
    </div>
  );
}
