import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {

    const accessToken = req.cookies.get('accessToken')?.value;

    console.log(req.nextUrl.pathname)
    
    if (accessToken === 'invalid' || !accessToken) {
        if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/sign-up'||req.nextUrl.pathname === '/login/api' || req.nextUrl.pathname === '/sign-up/api') return NextResponse.next();
        return NextResponse.redirect(new URL('/login', req.url));  // 로그인 페이지로 리다이렉트
    }

    if (req.nextUrl.pathname === '/logout') {
        
        const response =NextResponse.redirect(new URL('/login', req.url));
        response.cookies.set('accessToken','',{
            httpOnly:false,
            secure:false,
            sameSite:'strict',
            path:'/',
            expires:new Date(0)
        });
        response.cookies.set('refreshToken','',{
            httpOnly:false,
            secure:false,
            sameSite:'strict',
            path:'/',
            expires:new Date(0)
        });
        return response;
    }

    // 예: 로그인 페이지('/login') 또는 회원가입 페이지('/signup')에서 홈 페이지('/')로 리다이렉트
    

    return NextResponse.next();
}


export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};