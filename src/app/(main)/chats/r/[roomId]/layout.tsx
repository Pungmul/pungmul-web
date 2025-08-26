import React from 'react'
import { cookies } from 'next/headers'
import { TokenProvider } from '@/features/auth';

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const token = (await cookies()).get('accessToken')?.value;

  return (
    <TokenProvider token={token}>
      {children}
    </TokenProvider>
  )
}