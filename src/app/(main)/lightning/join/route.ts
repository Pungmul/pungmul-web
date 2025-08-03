import { fetchWithRefresh } from "@pThunder/core";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    console.log("Request received at /api/lightning/join");
    const body = await req.json();


    console.log("Request body:", body);

    const response = await fetchWithRefresh(
      `${process.env.BASE_URL}/api/lightning`,
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
