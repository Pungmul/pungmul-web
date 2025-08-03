"use client";

import { AnimatePresence } from "framer-motion";

export default function NotificationContainer() {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-100">
      <AnimatePresence mode="sync">
        <div
          id="notification-container"
          className="fixed bottom-[96px] lg:top-4 lg:right-4 flex flex-col lg:flex-col-reverse gap-[4px] z-50"
        />
      </AnimatePresence>
    </div>
  );
} 