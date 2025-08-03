"use client";

import { useEffect } from 'react';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { Spinner } from '@/shared/components';

export default function Logout() {
  const { logout } = useLogout();
 
  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center gap-4">
        <Spinner />
        <p className="text-gray-600">로그아웃 중...</p>
      </div>
    </div>
  );
}