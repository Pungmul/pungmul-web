import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

export async function GET() {

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const refreshToken = cookieStore.get("refreshToken");
  if (!accessToken || !refreshToken) {
    return Response.json({ accessToken: null }, { status: 401 });
  }
  return Response.json({ accessToken: accessToken.value });
}
