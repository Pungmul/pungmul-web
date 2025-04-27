import React from 'react'
import { cookies } from 'next/headers'
import { TokenProvider } from '../TokenProvider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '채팅',
  description: '채팅 페이지 입니다.',
}

export const dynamic = 'force-dynamic';


export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = cookies().get('accessToken')?.value;

  // Layout에서 prop 전달을 위해 children을 감싸야 함
  return (
    <TokenProvider token={token}>
      {children}
    </TokenProvider>
  )
}