import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// export function middleware(req: NextRequest) {
//   // 예시: 특정 조건에 따라 리다이렉트
//   if (req.nextUrl.pathname.startsWith('/protected')) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   // 예시: 응답을 직접 반환
//   if (req.nextUrl.pathname === '/hello') {
//     return NextResponse.json({ message: 'Hello from Middleware!' });
//   }

//   // 기본 동작 허용
//   return NextResponse.next();
// }