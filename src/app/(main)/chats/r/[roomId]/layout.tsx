import React from 'react'
import { cookies } from 'next/headers'
import { TokenProvider } from '@/features/auth';

export const dynamic = 'force-dynamic';

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = (await cookies()).get('accessToken')?.value;

  // Layout에서 prop 전달을 위해 children을 감싸야 함
  return (
    <TokenProvider token={token}>
      {children}
    </TokenProvider>
  )
}