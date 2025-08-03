import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { getQueryClient } from '@/core/config/queryClient';

export function useLogout() {
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      // 1. QueryClient 초기화
      const queryClient = getQueryClient();
      queryClient.resetQueries();
      queryClient.clear();
      
      // 2. 로컬 스토리지 클리어
      localStorage.clear();
      sessionStorage.clear();
      
      // 3. 쿠키 삭제
      await fetch('/logout/api', {
        method: 'POST',
        credentials: 'include'
      });
      
      // 4. 로그인 페이지로 리다이렉트
      router.push('/login');
      
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      // 오류가 발생해도 로그인 페이지로 이동
      router.push('/login');
    }
  }, [router]);

  return { logout };
} 