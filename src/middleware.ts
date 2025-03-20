import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {

    const accessToken = req.cookies.get('accessToken');

    if (accessToken) {
        if(req.nextUrl.pathname.startsWith('/login') || (req.nextUrl.pathname.startsWith('/sign-up'))) 
            return NextResponse.redirect(new URL('/home', req.url));
    }
    
    if (!accessToken) {
        if (req.nextUrl.pathname.startsWith('/login') || (req.nextUrl.pathname.startsWith('/sign-up')) || req.nextUrl.pathname.startsWith('/cookie')) return NextResponse.next();
        return NextResponse.redirect(new URL('/login', req.url));  // 로그인 페이지로 리다이렉트
    }

    if (req.nextUrl.pathname.startsWith('/logout')
        && accessToken
    ) {

        const response = NextResponse.redirect(new URL('/login', req.url));
        response.cookies.set('accessToken', '', {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            path: '/',
            expires: new Date(0)
        });
        response.cookies.set('refreshToken', '', {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            path: '/',
            expires: new Date(0)
        });
        return response;
    }


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