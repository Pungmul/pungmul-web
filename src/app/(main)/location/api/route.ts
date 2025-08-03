import { fetchWithRefresh } from "@/core";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetchWithRefresh(
      `${process.env.BASE_URL}/api/location/my-location`
    );

    if (!response.ok) {
      throw new Error("Internal Server Error" + response.status);
    }
    const { response: data } = await response.json();

    return Response.json(
      {
        latitude: data?.latitude,
        longitude: data?.longitude,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    
    const { latitude, longitude } = await req.json();

    const response = await fetchWithRefresh(
      `${process.env.BASE_URL}/api/location/update`,
      {
        method: "POST",
        body: JSON.stringify({ latitude, longitude }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("위치 업데이트 실패", errorText);
      throw new Error("Internal Server Error" + response.status);
    }

    return Response.json({ message: "위치 업데이트 성공" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
