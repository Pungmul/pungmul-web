"use client";
import { useNotificationStore } from "@/store/notification/notificationStore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useView } from "@/shared/lib/useView";

export default function NotificationToast() {
  const view = useView();
  const notifications = useNotificationStore((s) => s.notifications);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setVisible(true);
      // 5초 후 자동으로 사라짐
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (notifications.length === 0 || !visible) return null;

  const latest = notifications[0];

  const container = document.getElementById("notification-container");
  if (!container) {
    return null;
  }

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        initial={
          view === "desktop" ? { opacity: 0, x: 300 } : { opacity: 0, y: 300 }
        }
        animate={
          view === "desktop" ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }
        }
        exit={
          view === "desktop" ? { opacity: 0, x: 300 } : { opacity: 0, y: 300 }
        }
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: "320px",
          minWidth: "280px",
        }}
      >
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-semibold text-gray-900 text-sm">
                {latest.title}
              </div>
              <div className="text-gray-600 text-sm mt-1 leading-relaxed">
                {latest.body}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                {latest.receivedAt.toLocaleTimeString()}
              </div>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    container
  );
}
