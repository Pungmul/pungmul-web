import React from 'react'
import { cookies } from 'next/headers'
import { TokenProvider } from '@/features/auth';
import { prefetchChatRoomData } from '@/features/chat/api';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import Suspense from '@pThunder/shared/components/SuspenseComponent';
export const dynamic = 'force-dynamic';

export default async function ChatsLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: Promise<{ roomId: string }>
}) {
  const token = (await cookies()).get('accessToken')?.value;
  const { roomId } = await params;

  const queryClient = await prefetchChatRoomData(roomId);

  // Layout에서 prop 전달을 위해 children을 감싸야 함
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TokenProvider token={token}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </TokenProvider>
    </HydrationBoundary>
  )
}