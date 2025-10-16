import { useChatRoomStore } from '@pThunder/features/chat/store/chatRoomStore';

/**
 * 채팅 알림용 간단한 훅
 * bottomTab이나 다른 컴포넌트에서 읽지 않은 메시지 수만 필요할 때 사용
 */
export const useChatNotification = () => {
  // zustand 스토어에서 필요한 값들만 선택적으로 가져오기
  const totalUnreadCount = useChatRoomStore((state) => state.totalUnreadCount);
  const isSocketConnected = useChatRoomStore((state) => state.isSocketConnected);
  
  return {
    /**
     * 전체 읽지 않은 메시지 수
     */
    totalUnreadCount,
    
    /**
     * 읽지 않은 메시지가 있는지 여부
     */
    hasUnreadMessages: totalUnreadCount > 0,
    
    /**
     * 소켓 연결 상태
     */
    isSocketConnected,
    
    /**
     * 실시간 알림이 활성화되어 있는지
     */
    isRealtimeEnabled: isSocketConnected,
    
    /**
     * 표시할 배지 텍스트 (99+ 처리 포함)
     */
    badgeText: totalUnreadCount > 99 ? '99+' : totalUnreadCount.toString(),
    
    /**
     * 배지를 표시해야 하는지 여부
     */
    shouldShowBadge: totalUnreadCount > 0,
  };
};
