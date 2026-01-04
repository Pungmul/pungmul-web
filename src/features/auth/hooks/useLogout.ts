import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { getQueryClient } from '@/core/config/queryClient';
import { SocketService } from '@/core/socket';

export function useLogout() {
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      // 1. 소켓 연결 해제
      SocketService.disconnectSocket();
      
      // 2. QueryClient 초기화
      const queryClient = getQueryClient();
      queryClient.resetQueries();
      queryClient.clear();
      
      // 3. 로컬 스토리지 클리어
      localStorage.clear();
      sessionStorage.clear();
      
      // 4. 쿠키 삭제
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // 5. 로그인 페이지로 리다이렉트
      router.push('/login');
      
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      // 오류가 발생해도 소켓 연결 해제 시도
      SocketService.disconnectSocket();
      // 오류가 발생해도 로그인 페이지로 이동
      router.push('/login');
    }
  }, [router]);

  return { logout };
} 