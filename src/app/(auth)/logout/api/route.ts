import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  
  try {
    // 쿠키 삭제
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    
    return NextResponse.json({ 
      success: true, 
      message: "로그아웃 완료" 
    });
    
  } catch (error) {
    console.error('로그아웃 처리 중 오류:', error);
    return NextResponse.json(
      { success: false, message: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET 요청도 처리 (기존 middleware와 호환)
export async function GET(request: NextRequest) {
  return POST(request);
} 