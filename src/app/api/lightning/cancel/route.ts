import { fetchWithRefresh } from "@/core";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetchWithRefresh(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/lightning/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text(); // 또는 await res.json()
      console.error("🔥 백엔드 에러 메시지:", errorText);
      throw Error("서버 불안정" + response.status);
    }

    return Response.json(response);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create lightning");
  }
}
