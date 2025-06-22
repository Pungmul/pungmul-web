"use client";

import { useState, useEffect, useRef } from "react";
import { NotificationData } from "@/shared/types/notification/notification";
import {
  loadNotReadMessageCnt,
  loadNotReadMessage,
} from "@/app/(main)/home/utils";
import NotificationBadge from "./NotificationBadge";
import NotificationList from "./NotificationList";
import Image from "next/image";

export default function NotificationIcon() {
  const notificationBoxRef = useRef<HTMLDivElement>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notReadMessageCnt, setNotReadMessageCnt] = useState(0);
  const [notReadMessage, setNotReadMessage] = useState<NotificationData[]>([]);

  useEffect(() => {
    if (notificationOpen) return;

    const fetchNotReadMessageCnt = async () => {
      const cnt = await loadNotReadMessageCnt();
      setNotReadMessageCnt(cnt);
    };
    fetchNotReadMessageCnt();
  }, [notificationOpen]);

  useEffect(() => {
    if (!notificationOpen) return;
    const fetchNotReadMessage = async () => {
      const messages = await loadNotReadMessage();
      setNotReadMessage(messages);
    };
    fetchNotReadMessage();
  }, [notificationOpen]);

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
    <div className="relative">
      <Image
        src={"/icons/Notification-Icon.svg"}
        width={36}
        height={36}
        alt=""
        className="cursor-pointer"
        onClick={() => setNotificationOpen(!notificationOpen)}
      />
      <div className="absolute bottom-0 right-0">
        <NotificationBadge notReadMessageCnt={notReadMessageCnt} />
      </div>
      {notificationOpen && (
        <div
          ref={notificationBoxRef}
          className="absolute top-full right-0 w-[320px] h-[400px] bg-white rounded-lg shadow-md z-10"
        >
          <NotificationList notReadMessage={notReadMessage} />
        </div>
      )}
    </div>
  );
}
