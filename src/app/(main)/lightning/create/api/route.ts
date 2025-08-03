import { fetchWithRefresh } from "@/core";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    console.log("Request received at /api/lightning/meeting");
    const body = await req.json();


    console.log("Request body:", body);

    const response = await fetchWithRefresh(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/lightning/meeting`,
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

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create lightning");
  }
}
