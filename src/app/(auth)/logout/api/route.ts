import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  try {
    // 쿠키 삭제
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    
    return Response.json({ 
      success: true, 
      message: "로그아웃 완료" 
    });
    
  } catch (error) {
    console.error('로그아웃 처리 중 오류:', error);
    return Response.json(
      { success: false, message: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}