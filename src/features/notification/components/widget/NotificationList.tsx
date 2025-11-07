"use client";
import { useNotReadMessageList } from "@pThunder/features/home";
import { useImperativeHandle } from "react";

interface NotificationListProps {
  ref?: React.RefObject<{ refetch: () => void } | null>;
}

export default function NotificationList({ ref }: NotificationListProps) {
  const { data: notReadMessage, refetch } = useNotReadMessageList();

  useImperativeHandle(ref, () => ({
    refetch,
  }));

  if (notReadMessage.length === 0) {
    return (
      <div className="p-4 text-center text-grey-500 w-full flex items-center justify-center h-full">
        알림이 없습니다.
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto flex-grow flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">읽지 않은 알림</h2>
        <button
          onClick={() => {}}
          className="text-sm text-primary hover:text-primary-light"
        >
          모두 삭제
        </button>
      </div>

      <div className="space-y-3">
        {notReadMessage.map((notification, index) => (
          <div key={index} className="p-3 bg-grey-100 rounded-lg border">
            <div className="font-semibold text-grey-800">
              {notification.title}
            </div>
            <div className="text-grey-600 text-sm mt-1">
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
