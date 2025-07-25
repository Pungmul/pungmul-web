"use client";
import { NotificationData } from "@/shared/types/notification/notification";

export default function NotificationList({notReadMessage}: {notReadMessage: NotificationData[]}) {


  if (notReadMessage.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 h-full w-full flex items-center justify-center">
        알림이 없습니다.
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">알림</h2>
        <button
          onClick={() => {}}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          모두 삭제
        </button>
      </div>
      
      <div className="space-y-3">
        {notReadMessage.map((notification, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 rounded-lg border"
          >
            <div className="font-semibold text-gray-800">
              {notification.title}
            </div>
            <div className="text-gray-600 text-sm mt-1">
              {notification.body}
            </div>
            {/* <div className="text-xs text-gray-400 mt-2">
              {notification.receivedAt.toLocaleString()}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
} 